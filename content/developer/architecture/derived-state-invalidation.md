---
title: 派生状态与缓存失效：重置之后为什么还要重新计算
description: 以 Web 端 Lazy、GameCache 和永恒挑战入口为例，说明派生状态如何缓存、何时失效，以及如何排查旧值残留。
tags:
  - 开发者
  - 架构
  - Web
  - 缓存
---

游戏里的很多数字并不是存档字段，而是从存档现场推导出来的答案：某个升级后的乘数、当前时间研究树、自动购买器的最低价格，或者一项挑战在本轮运行中见过的最高资源量。把这些答案每次都重新算一遍当然最直接，却会让高频游戏循环反复走同一条昂贵的计算路径。Web 端因此把一部分派生状态做成惰性缓存。

缓存让热路径变轻，也带来一个不太显眼的责任：**改变了依赖数据，就必须让旧答案失效**。否则玩家看到的不是“计算慢”，而是一个看似合理、实际属于上一个状态的数字。这个专题只讨论模型层的派生值和失效边界；页面如何响应状态变化，见 [Web 界面反应式更新](/developer/architecture/web-ui-reactivity)。

## 先分清三种状态

排查缓存问题时，先把“事实”“派生答案”和“显示结果”分开：

- **源状态**是 `player`、资源对象和已购买机制中的事实，例如时间研究 ID 列表、挑战完成次数或本次运行资源峰值。
- **派生状态**是能由这些事实计算出的值，例如 `GameCache.timeStudies`、维度共同倍率和 `ECTimeStudyState.requirementCurrent`。
- **显示结果**是界面把当前值渲染出来的文本、按钮状态或进度条。

三者的故障表现不同。源状态错了，应查重置、购买或读档；源状态正确而派生值没变，优先查失效；派生值正确而画面没变，才进入 UI 更新链。把这三类问题混成“刷新一下页面”会掩盖真正的依赖关系。

## `Lazy` 做了什么，又没有做什么

固定源码中的 `Lazy` 很小，却定义了整个约定：构造时保存计算函数，第一次读取 `value` 时计算并保存；之后的读取直接复用 `_value`；`invalidate()` 只负责清除答案，让下一次读取重新计算。[`src/core/cache.js`（commit `b28b231…`）](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/src/core/cache.js)

```js
get value() {
  if (this._value === undefined) this._value = this._getValue();
  return this._value;
}

invalidate() {
  this._value = undefined;
}
```

这不是带依赖图的自动缓存。`Lazy` 不知道计算函数读取了哪些字段，也不会观察 `player` 的变化。开发者必须在改变依赖的代码附近调用 `invalidate()`，或者把失效绑定到明确的事件。`invalidateOn(...events)` 能替对象注册事件监听，但它依然要求作者准确声明依赖。

## `GameCache`：把热路径的重复计算变成一次

`GameCache` 将这种约定集中命名。比如 `timeStudies` 根据当前研究列表生成布尔数组，`tickSpeedMultDecrease` 从多个升级效果求和，`cheapestAntimatterAutobuyer` 则扫描未购买的自动购买器找出最低成本。它们都只在第一次读取或失效后计算。

这种设计的关键不是“缓存越多越好”，而是为每个缓存回答两个问题：

1. 它读取了哪些源状态？
2. 哪些操作会改变这些状态？

例如购买时间研究后，研究列表和研究树都可能改变，源码在购买路径上使 `GameCache.timeStudies` 失效；符文变化则同时使仓库空间、符文效果和静态符文权重失效。后一个例子说明失效往往是一组依赖，而不是一个孤零零的变量。数组形式的 `antimatterDimensionFinalMultipliers` 甚至覆写了集合的 `invalidate()`，逐项清掉每一层维度的缓存，避免只清除容器而留下内部旧值。

## 为什么重置与读档需要两层失效

重置的危险在于：它通常一次性替换许多源状态，但缓存对象本身仍然活着。固定版本的现实重置流程在完成状态切换后调用 `Lazy.invalidateAll()`，随后专门调用 `ECTimeStudyState.invalidateCachedRequirements()`，最后才发出 `REALITY_RESET_AFTER` 事件。[`src/core/reality.js`（同一 commit）](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/src/core/reality.js)

这里有两个层次：

- `Lazy.invalidateAll()` 清理注册表中所有通用惰性缓存，适合跨越大量字段的全局重置。
- `ECTimeStudyState.invalidateCachedRequirements()` 清理挑战入口对象自己的 `cachedCurrentRequirement`，因为它不是 `Lazy`，而是每个挑战对象维护的峰值采样。

只做第一层并不够：不属于 `Lazy` 的缓存不会自动消失。反过来，所有地方都无条件全清也会丢掉局部更新的性能收益，所以普通购买路径仍应优先做定向失效。

读档同样不能只把序列化数据写回 `player` 就结束。存储模块在装载存档、初始化自动化之后调用 `Lazy.invalidateAll()`；挑战入口的缓存也会单独清理。这样下一次读取派生值时，答案来自新存档，而不是来自读档前那一局游戏。[`src/core/storage/storage.js`（同一 commit）](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/src/core/storage/storage.js)

## 一个有代表性的峰值缓存：永恒挑战入口

`ECTimeStudyState` 展示了“缓存的值并不等于当前值”。它的 `requirementCurrent` 读取当前资源；第一次读取时保存样本，之后只保留本次运行中更大的值。于是它表达的是“本轮见过的最高值”，而不是某一帧的瞬时资源。

这正是设计取舍：入口条件可能要求玩家在一次运行中达到峰值，重置后却不能把上一轮的峰值带进来。`invalidateRequirement()` 把 `cachedCurrentRequirement` 设回未初始化状态，统一失效函数遍历所有挑战对象执行它。[`src/core/time-studies/ec-time-study.js`（同一 commit）](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/src/core/time-studies/ec-time-study.js)

这个例子也给出一个实用判断：如果某个入口在重置后立刻显示“已经达到”，不要先怀疑数值精度或界面；先确认 `requirementBits` 这类合法的持久标记与本轮峰值缓存是否被有意区分。前者表示曾经合法达成，后者表示当前运行中实际观察到的最大值，二者不能互相代替。

## 从症状反推失效边界

遇到“数据看起来已经变了，但结果没变”时，可以按下面的顺序缩小范围：

1. **记录源字段。** 在触发购买、重置或读档前后，确认实际改变的是哪个 `player` 字段或机制集合；不要只看按钮文字。
2. **找到派生值的计算函数。** 搜索 `new Lazy`、`cached`、`requirementCurrent` 或对应的 `GameCache` 成员，列出它直接读取的源字段。
3. **沿改变路径找失效。** 购买路径应有定向 `invalidate()`，全局重置和读档应有全局清理；如果缓存是对象字段，还要检查它是否有自己的失效函数。
4. **强制一次冷读。** 失效后再读取同一派生值。若冷读正确，问题在失效时机；若仍错误，才检查计算函数、数值类型和源字段。
5. **最后检查显示链。** 只有模型冷读已正确而画面仍旧时，才转去排查事件和组件更新，不要把 UI 刷新当成模型修复。

开发时可把这条链画成：

```text
源状态改变 ──> 依赖失效 ──> 下一次读取重新计算 ──> UI 得到新派生值
       └──────── 缺失一步，就可能得到“合法但过期”的答案
```

## 设计新缓存时的边界

新增一个缓存前，先问它是否真的位于热路径；缓存一次只被读取一次的冷路径，通常不值得引入失效负担。确定要缓存后，把计算函数、依赖字段和失效入口放在同一处或同一专题中说明，并优先选择语义清晰的事件名。对“本轮峰值”“历史最好值”这类有意跨帧累积的数据，要把重置边界写进对象的生命周期，而不是依赖调用者记忆。

最容易出错的不是 `invalidate()` 本身，而是新增依赖后忘记补失效。例如一个原本只依赖升级效果的乘数后来又读取挑战奖励；如果购买挑战的路径没有清掉它，结果会稳定地旧一个版本。代码审查时，应把“计算函数读取了什么”和“哪些写操作发生了什么”成对检查，而不是只检查缓存是否存在。

## 相关源码与阅读路径

- [Web 数值模型](/developer/architecture/numeric-model)：派生乘数最终如何参与大数计算。
- [Web 端反应式更新](/developer/architecture/web-ui-reactivity)：模型改变后，组件如何收到更新。
- [Web 双端一致性](/developer/architecture/parity)：当同一机制在 Android 与 Web 上给出不同结果时，如何区分实现差异和陈旧派生值。
