---
title: 效果对象与倍率组合：从一项奖励到完整公式
description: 以 Web 端 Effect、GameMechanicState 和牺牲公式为例，说明条件效果、上限、动态值及效果叠加如何组成可维护的机制模型。
---

游戏里写“某项升级使维度变强”很容易，真正困难的是把这句话变成一套不会互相打架的计算规则：升级可能尚未生效，效果可能有上限，数值可能随着完成次数变化，同一项奖励还可能在一个公式里相加、在另一个公式里相乘。Web 端没有让每个机制各自发明一套 `if`，而是用 `Effect` 把这些差异收进一个可组合的对象。

这套抽象值得单独理解，因为它正好位于派生状态和具体公式之间。缓存只回答“什么时候重算”；`Effect` 回答“重算时，一个机制到底贡献什么”。本文依据 Web 固定提交 `b28b231efa5b694ce1da8a1e508cfc3ecc099344` 的核心源码，重点讨论模型层，不讨论 Vue 组件如何显示结果。

## `Effect` 的核心不是一个数字

[`src/core/game-mechanics/effect.js`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/src/core/game-mechanics/effect.js) 的构造函数接受三个概念：效果值、上限和条件。效果值可以是常量，也可以是函数；上限同样可以动态计算；条件则决定这项效果此刻是否满足前提。

因此一个效果对象至少有四种不同的观察方式：

- `uncappedEffectValue`：不应用上限的原始贡献，适合显示“理论值”或继续参与特定推导。
- `effectValue`：应用 `cap` 后的实际数值，供通常的公式使用。
- `isEffectConditionSatisfied`：效果自身的条件是否满足。
- `canBeApplied`：效果是否激活且满足条件；它才是“这项奖励当前能不能用”的总判断。

这一区分避免了一个常见错误：把“效果存在”当成“效果生效”。例如一项永久升级可能已经在机制表中，但当前挑战禁用了它；读取 `effectValue` 并不自动替调用方判断业务条件，调用方应使用 `effectOrDefault()` 或先检查 `canBeApplied`。

```js
effectOrDefault(defaultValue) {
  return this.canBeApplied ? this.effectValue : defaultValue;
}

applyEffect(applyFn) {
  if (this.canBeApplied) applyFn(this.effectValue);
}
```

这两个入口把“未生效时使用什么”写在调用点：默认值可能是加法中的 `0`，也可能是乘法中的 `1`。默认值选错，公式仍然能运行，却会悄悄改变整个成长曲线。

## 动态值为什么仍然像属性一样读取

`Effect` 使用 getter 暴露效果，而不是在构造时把函数结果冻结下来。一个依赖完成次数、当前资源或其他升级的效果，读取 `effectValue` 时才得到当前结果。若存在上限，源码还会根据第一次实际返回的是 JavaScript `number` 还是 `Decimal`，选择相应的 `Math.min` 或 `Decimal.min` 路径。

这解决了两个工程问题：

1. 定义机制时可以写 `effect: completions => ...`，而不必在每一次完成挑战时手动同步一个影子字段。
2. 大数效果不会被普通数字的比较规则截断；`Decimal` 的上限和效果要在同一数值域内比较。

但动态 getter 不是免费缓存。每次读取都可能重新调用函数；如果效果最终位于高频路径，应由上层派生缓存控制读取次数，而不是在 `Effect` 内偷偷保存一个永不过期的结果。这个边界正是派生状态缓存失效专题所讨论的内容：缓存负责生命周期，效果对象负责语义。

## 上限、条件和激活是三道不同的门

可以把效果的使用过程画成：

```text
效果定义 ──> 是否激活 ──> 条件是否满足 ──> 计算原始值 ──> 应用上限 ──> 进入公式
```

`isEffectActive` 通常表示机制本身是否可用；`isEffectConditionSatisfied` 表示额外条件；`cap` 只限制数值大小。把三者揉成一个 `if` 会丢失重要信息：调试界面可能需要显示未封顶值，玩家提示可能需要显示“条件未满足”，而公式只应该拿到最终可应用值。

上限也不等于软上限。`Effect` 的 `cap` 是对象层面的硬裁剪：实际值不能超过它，但 `uncappedEffectValue` 仍保留原始结果。软上限、递减收益或分段函数应写在效果计算函数本身，因为它们改变的是曲线，而不是简单的 `min`。

## `GameMechanicState` 如何把数据表变成效果对象

[`src/core/game-mechanics/game-mechanic.js`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/src/core/game-mechanics/game-mechanic.js) 让具体机制继承 `Effect`。构造时，它保存原始配置；如果配置含有 `effects`，还会为每个嵌套键建立一个子 `Effect`，并把子效果的 `isEffectActive` 委托给父机制。

这意味着一个升级可以暴露多个语义明确的贡献，例如同时改变价格和倍率，而不需要让调用者知道配置对象长什么样。父机制被禁用时，子效果也一起失效；调用方不必在每个子字段旁重复写一份挑战判断。

机制对象还保留 `id`、配置和事件注册能力。`createAccessor()` 则把数据表映射成按 ID 取用的访问器。数据定义与运行时对象因此分层：配置描述“有哪些机制”，状态对象负责“当前效果如何计算”。新增机制时，优先沿用这条边界，而不是在消费方直接读取原始 JSON。

## 加法和乘法不是实现细节

效果对象只提供贡献，不替调用者决定所有贡献如何合并。合并规则属于具体机制的数学语义。固定源码中的 [`src/core/sacrifice.js`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfcf3ecc099344/src/core/sacrifice.js) 是一个很好的例子：牺牲指数先把成就 32、57 的效果用 `Effects.sum()` 聚合，再与成就 88 和时间研究 228 的另一组加成聚合，最后把这些组作为乘数相乘。

抽象地写就是：

```text
exponent = base × (1 + sum(pre-change effects)) × (1 + sum(post-change effects)) × triad
```

这里不能把所有效果扔进一个总和，也不能把每个效果直接相乘。源码注释说明这种分组是为了保留旧版本的行为：挑战 2 改变基础公式，挑战 8 还有独立路径，历史兼容要求决定了效果的组合层级。代码看起来绕，实际是在保护一个玩家已经体验到的数学系统。

因此排查倍率差异时，先问“这个效果应该加在哪里”，再问“它的值是多少”。同一奖励如果单独检查是正确的，合入错误的组合层仍会产生错误结果。数值模型专题解释大数表示；本文补上的是公式结构和效果语义。

## 什么时候用 `effectOrDefault`，什么时候显式判断

如果缺少效果时的中性元是明确的，`effectOrDefault` 很合适：加法项通常用 `0`，乘法项通常用 `1`。但以下情况应显式判断：

- 未生效时不是数学中性值，而是要走另一条公式；
- 需要向玩家解释“为什么没有效果”；
- 未封顶值和封顶值都要参与后续逻辑；
- 条件判断本身会改变流程，而不仅是贡献一个数字。

不要用 `effectValue || defaultValue` 替代这些语义。零可能是合法效果，`Decimal` 也不应依赖 JavaScript 的真假判断。更不要直接读取配置里的 `effect` 函数并绕过 `canBeApplied`，那会跳过条件和上限，制造“数据表写对了、游戏结果却不对”的隐性分叉。

## 新增效果时的核查顺序

为一个已有机制增加效果或修改组合方式，可以按四步检查：

1. **先定义语义。** 写清它是加法项、乘法项、指数、阈值折扣还是流程开关，并决定未生效时的中性值。
2. **再决定生命周期。** 效果是否依赖完成次数、挑战状态、资源或符文？这些依赖变化时，承载它的派生缓存是否会失效？
3. **固定数值域。** 普通数值、`Decimal` 和整数计数不要隐式混算；上限函数必须与效果返回类型匹配。
4. **验证组合层。** 用一个“只有该效果”的例子检查自身值，再用一个包含多个效果的例子检查 `sum`、乘法和条件分支，避免只测局部 getter。

常见故障可以按症状反推：显示未封顶值而实际购买使用封顶值，通常是读取了错误属性；效果在挑战中仍然生效，通常绕过了 `canBeApplied`；重置后倍率停留在旧值，通常是效果所在的派生缓存没有失效；单项数值正确但最终指数错误，通常是组合层级或默认值错误。

## 相关源码

- [效果基类 `effect.js`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/src/core/game-mechanics/effect.js)：条件、上限、动态 getter 与默认值。
- [机制状态 `game-mechanic.js`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/src/core/game-mechanics/game-mechanic.js)：配置到机制对象、嵌套效果和访问器。
- [牺牲公式 `sacrifice.js`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/src/core/sacrifice.js)：效果分组与历史公式兼容。
- 派生状态与缓存失效专题：效果依赖变化后如何让旧答案退出缓存。
