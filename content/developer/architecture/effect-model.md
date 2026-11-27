---
title: "效果模型"
description: "说明 Web 端效果的条件、上限、动态取值和组合层级，以及它与派生缓存的边界"
tags:
  - 开发者
  - 架构
  - Web
  - 游戏机制
---

“升级使维度变强”只是玩家能听懂的结论，代码必须进一步回答：效果现在是否激活？它的原始值是多少？有没有上限？多个效果应相加还是相乘？Web 端把前两层语义集中在 `Effect`，把具体的组合规则留给使用它的机制。

本文解释效果对象，不重复讲缓存失效；派生值的生命周期见[派生状态](/developer/architecture/derived-state-invalidation)，超大数值见[数值模型](/developer/architecture/numeric-model)。

## 一个效果的四个读法

`src/core/game-mechanics/effect.js` 的构造函数接受效果值、上限和条件。效果值和上限都可以是常量，也可以是 getter 函数，因此同一个对象能随完成次数、资源或挑战状态变化。

- `uncappedEffectValue` 是不应用上限的原始贡献。
- `effectValue` 是应用 `cap` 后给通常公式使用的值。
- `isEffectConditionSatisfied` 只表示额外条件是否满足。
- `canBeApplied` 同时要求机制激活且条件满足。

“效果对象存在”不等于“效果能进入公式”。应使用 `effectOrDefault()` 或 `applyEffect()`，而不是直接调用配置里的函数：

```js
effectOrDefault(defaultValue) {
  return this.canBeApplied ? this.effectValue : defaultValue;
}
```

未生效时的默认值必须符合公式语义。加法通常用 `0`，乘法通常用 `1`；如果未生效要走另一条流程，就应显式判断，而不是把所有情况都塞进一个默认数字。

## 条件、上限与动态值

`isEffectActive` 是机制自身是否可用，条件 getter 是额外前提，`cap` 只负责裁剪数值。三者分开后，界面可以显示理论值，公式可以使用封顶值，排查时也能指出到底是“未激活”还是“达到条件但被封顶”。软上限和递减收益不是简单的 `min`，应直接写在效果函数中，因为它们改变的是曲线。

getter 的另一个后果是：动态效果每次读取都可能重新计算。`Effect` 不负责缓存；如果它位于每帧都会访问的热路径，应由上层 `GameCache` 控制读取次数，而不是在效果对象里偷偷保存一个没有失效边界的结果。

效果还必须留在同一数值域内。常规数值和 `Decimal` 的上限分别走 `Math.min` 与 `Decimal.min`；不能把超大效果先转成 JavaScript `Number` 再比较，否则上限判断可能已经失真。

## 机制状态分层

`src/core/game-mechanics/game-mechanic.js` 中的 `GameMechanicState` 继承 `Effect`，保存原始配置并暴露 `id`。配置含有 `effects` 时，它会为每个嵌套键建立子 `Effect`，并让子效果的 `isEffectActive` 委托父机制。

这层关系解决了一个实际问题：一项升级可以同时提供多个语义不同的效果，例如改变价格和倍率，而消费方只需取 `upgrade.effects.price` 或 `upgrade.effects.multiplier`。父机制失效时，子效果不会继续偷偷生效。`createAccessor()` 则把一组配置变成按 ID 取用的机制对象，避免各个消费方直接解读原始数据表。

## 组合顺序才是公式

效果对象只提供贡献，不决定所有贡献如何合并。以 `src/core/sacrifice.js` 为例，牺牲指数的公式把不同来源先分别用 `Effects.sum()` 聚合，再把聚合后的组作为乘数相乘；成就、时间研究和挑战影响并不是一个扁平列表。

抽象写法类似：

```text
指数 = 基础值 × (1 + 第一组总和) × (1 + 第二组总和) × 其他因子
```

如果把所有效果放进一个总和，单个 getter 仍然可能“看起来正确”，最终指数却会不同。排查倍率时，先确认效果落在哪个组合层，再检查效果值本身。源码里的分组往往同时承担历史公式兼容和设计语义，不能为了简化代码随意扁平化。

## 写新效果时的四问

1. 它是加法项、乘法因子、指数、阈值还是流程开关？未生效时的中性值是什么？
2. 它的条件和上限属于效果对象，还是属于消费它的流程？
3. 它返回普通数值还是 `Decimal`？上下限是否在同一数值域？
4. 依赖字段改变时，哪个派生缓存会失效？

常见错误有三种：用 `effectValue || defaultValue` 吃掉合法的零；绕过 `canBeApplied` 直接读原始函数；在消费方复制挑战条件，使同一效果出现两套判定。修复时应回到这四问，而不是继续添加局部 `if`。

固定源码定位：Web `game-mechanics/effect.js`、`game-mechanics/game-mechanic.js` 与 `sacrifice.js`，提交为 `OrekiDawson/AD-Oreki-Edition-Web@b28b231efa5b694ce1da8a1e508cfc3ecc099344`。

## 相关条目

- [派生状态](/developer/architecture/derived-state-invalidation)：效果依赖改变时如何使旧答案失效。
- [数值模型](/developer/architecture/numeric-model)：`Decimal` 与 Android `BigDouble` 的数值边界。
- [双端行为一致性](/developer/architecture/parity)：比较效果结果时应比较哪些可观察契约。
