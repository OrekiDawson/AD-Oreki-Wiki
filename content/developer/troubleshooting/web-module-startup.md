---
title: Web 模块启动链：全局兼容桥与初始化故障排查
description: 从固定源码解释 Web 端如何按顺序建立 shims、遗留全局和游戏入口，以及如何区分模块加载、浏览器能力和游戏初始化故障。
tags:
  - 开发者
  - 故障排查
  - Web
  - 启动链
---

Web 端的“白屏”常被归咎于某个组件或某个游戏机制，但很多故障在界面出现之前就已经发生了。这个项目使用原生 ES module 作为入口，同时保留了一部分依赖 `window` 全局名称的旧代码。两种编程模型要先在启动阶段接上，游戏循环才有机会运行。

本文依据 Web 固定提交 `b28b231efa5b694ce1da8a1e508cfc3ecc099344` 的 `src/main.js`、`src/shims.js`、`src/merge-globals.js` 与 `src/game.js`，讨论启动顺序、全局桥、循环依赖和故障定位。它不是构建工具介绍，也不讨论 Vue 组件收到更新之后的渲染过程。

## 入口不是初始化本身

`index.html` 只加载一个模块脚本：`./src/main.js`。[`src/main.js`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/src/main.js) 随后按顺序导入：

```text
speed-config
  → 触摸拖拽模块
  → shims
  → merge-globals
  → Oreki 工具
  → game.js 中的 browserCheck / init
```

最后只有在 `browserCheck()` 返回真时才调用 `init()`。因此“脚本请求成功”只证明浏览器拿到了入口文件，并不代表游戏已经初始化；同样，`main.js` 能解析也不代表它依赖的全局名称已经准备好。

这条链可以帮助我们把白屏拆成三个边界：

1. **模块边界**：入口或某个静态 import 解析失败，`init()` 根本不会被调用。
2. **兼容层边界**：模块加载成功，但旧代码需要的 `window` 属性未建立或发生冲突。
3. **游戏边界**：兼容层完成，`browserCheck()` 通过，但 `game.js:init()` 在读档、注册机制或创建 UI 时失败。

不要用“页面没有报错”代替这三层判断；浏览器可能只在控制台记录 `pageerror`，而页面本身仍然保持空壳。

## `shims` 是有意的运行时注入

[`src/shims.js`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/src/shims.js) 从模块导入 CodeMirror、Decimal 和 Vue，然后把它们写入 `window`：

```js
window.CodeMirror = CodeMirror;
window.Decimal = Decimal;
window.Vue = Vue;
```

这不是把 ES module 变回普通脚本，而是给仍以全局方式访问这些库的旧模块提供一座明确的桥。桥的顺序很重要：`merge-globals.js` 和后续游戏模块可能在模块求值阶段就读取 `Decimal` 或 `Vue`；如果把 `shims` 移到后面，错误会表现为“某个后期功能缺少方法”，根因却是启动早期没有注入依赖。

修改 shims 时应同时检查两件事：

- 依赖方究竟读取的是 `window.Decimal`、模块导入值，还是另一层包装；
- 注入的是同一个库实例，还是误加载了第二份构造器。

第二种问题尤其隐蔽。两个看似相同的 `Decimal` 构造器可能让 `instanceof` 判断失效，数值却仍能打印出来，直到某条类型分支才崩溃。

## `merge-globals` 如何处理遗留代码

[`src/merge-globals.js`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/src/merge-globals.js) 使用 `mergeIntoGlobal()` 遍历模块的命名导出，把它们挂到 `window`。它有一个刻意严格的规则：如果目标名称已经存在，就直接抛错，而不是静默覆盖。

```js
const existingValue = window[key];
if (existingValue !== undefined) {
  throw `Property ${key} already exists in global context`;
}
window[key] = value;
```

这条规则像一只很早响起的烟雾警报。它会阻止“后加载模块把同名函数覆盖掉”，代价是新增导出或改名时可能在启动阶段直接失败。维护者不应简单改成覆盖模式，因为覆盖会把确定的初始化错误变成顺序相关的运行时错误：今天能启动，换一个浏览器或新增一个 import 后却调用了另一份函数。

文件把导出分成三类：核心工具和数据库、保留的旧组件全局、`core/globals.js` 与 `game.js` 的统一导出。注释明确要求不要继续把新的全局塞进组件文件。这个边界很有价值：新代码优先使用显式 `import`，只有确实需要兼容旧调用方时才扩展桥，并为名称和所有者写出稳定的归属。

## 为什么 `game.js` 不能随处直接 import

全局桥的最后一步导入 `game.js`，再把它的导出合并到 `window`。看起来像是反向依赖，实际是为旧模块提供例如 `gainedInfinityPoints()` 这类运行时入口。[`src/core/oreki-smart-strategy.js`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/src/core/oreki-smart-strategy.js) 的源码注释给出了重要取舍：这个 MOD 策略模块直接调用全局函数，而不是重新 `import game.js`，以免形成这样的 ESM 环：

```text
game.js
  → 自动化模块
      → 策略模块
          → game.js
```

ESM 循环依赖不一定立刻抛出清晰错误；更危险的情况是模块已经开始求值，但被引用的绑定尚未初始化，出现“偶尔是 undefined”的启动故障。拆环的原则不是到处复制函数，而是把共享的纯逻辑下沉到独立模块，或通过已经建立的全局桥提供明确的运行时边界。

这也解释了为什么“把所有 import 改成全局”不是修复方案。全局桥本身有初始化顺序和命名冲突门禁；它适合承接既有兼容边界，不适合成为新业务的默认依赖注入方式。

## 浏览器检查与游戏初始化是两个判据

[`src/game.js`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/src/game.js) 的 `browserCheck()` 只负责判断用户代理是否属于支持范围。`init()` 还要继续完成运行环境、存档、自动化和界面相关的初始化。源码另有 `window.onload` 路径，会再次执行浏览器检查并设置 `GameUI.initialized`；这说明“支持的浏览器”和“UI 已经准备好”是两个状态，不应在排障中合并成一个布尔值。

因此，看到浏览器警告时先不要修改游戏机制；看到 `GameUI.initialized` 为假时也不要直接推断浏览器不支持。应该记录：

- `main.js` 是否被成功加载和解析；
- `merge-globals` 是否在冲突处中止；
- `browserCheck()` 返回什么；
- `init()` 是否进入、在哪个初始化阶段退出；
- `GameUI.initialized` 是从未设置，还是初始化后被设置为假。

## 按启动边界排查白屏

### 入口请求失败或模块解析失败

先看 Network 中 `index.html` 和 `src/main.js` 的状态、MIME 类型及相对路径。再看第一个 `SyntaxError`、`Failed to fetch dynamically imported module` 或 `404`，不要从最后一条组件异常开始。原生模块对路径和服务器响应类型更敏感，静态资源目录错一层就足以让整个初始化链停止。

### 全局冲突

若控制台出现 `already exists in global context`，记录冲突名称和首次赋值来源。检查最近新增的命名导出、`shims` 注入以及是否有旧脚本在 `main.js` 之前写入同名 `window` 属性。不要通过删除冲突检查或强制覆盖来“让页面先显示”；应先决定哪个模块拥有该名称。

### 全局缺失或类型不匹配

若出现 `Decimal is not defined`、`Vue is not defined` 或某个游戏函数不存在，检查失败发生在 `shims`、`merge-globals` 还是具体模块求值阶段。若对象存在但 `instanceof` 或方法调用失败，检查是否加载了两份依赖，而不只是检查属性是否非空。

### `browserCheck` 通过但没有游戏

此时入口和基本能力检查已经越过，重点转向 `init()`：读档解码、数据库对象创建、自动化注册和 UI 初始化可能在不同阶段失败。把异常栈的第一个项目源码帧与初始化顺序对应起来，先做最小复现——清除缓存只用于排除旧资源，不能代替保存用户存档和固定资源版本。

## 修改启动链时的安全做法

新增全局前，先问能否改成显式导入；只有遗留调用方确实需要时，才把它加入桥。每次修改入口顺序，都要做一次最小启动检查和一次真实功能入口检查，因为“首页出现”只证明启动链走得更远，并不证明读档、自动化或核心数值可以运行。

推荐把错误记录成边界事实，而不是写成笼统的“启动失败”：

```text
资源请求 → 模块解析 → shims 注入 → 全局合并 → 浏览器能力 → init → GameUI
```

这样同一个故障可以被准确地交给不同负责人：资源和部署检查静态文件，模块负责人检查 import 图，运行时负责人检查全局桥，游戏机制负责人检查 `init()` 之后的状态。启动链的价值不在于让所有代码都依赖全局，而在于把历史兼容的代价限制在一段可读、可诊断的边界内。

## 相关源码

- [入口 `src/main.js`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/src/main.js)：入口导入顺序与 `browserCheck()`/`init()` 调用。
- [兼容注入 `src/shims.js`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/src/shims.js)：把第三方模块实例注入 `window`。
- [全局桥 `src/merge-globals.js`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/src/merge-globals.js)：导出合并、冲突保护和遗留组件边界。
- [游戏入口 `src/game.js`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/src/game.js)：浏览器检查、初始化和运行时入口。
- [自动购买策略 `src/core/oreki-smart-strategy.js`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/src/core/oreki-smart-strategy.js)：避免直接导入 `game.js` 的策略模块边界。
- [Web 端架构](/developer/architecture/web)：沿启动、游戏循环和存档恢复继续阅读。
