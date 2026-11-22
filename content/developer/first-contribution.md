---
title: "第一次参与开发"
description: "从 Web 本地运行、跟踪真实启动入口，到提交一次有来源的最小文档修改"
tags:
  - 开发入门
  - Web
  - Git
---

第一次参与 Oreki Edition，**先不从 Android APK 签名、DEX 逆向或完整游戏长跑开始**。用 Web 仓库完成一次小练习更合适：把本地服务启动起来，找到游戏从哪里进入，再修正一处经过源码核对的文档说明。这样既能熟悉仓库，也不会修改存档或挑战结算。

这一教程的目标有三个：**本地看到网页、定位一条真实的代码路径、检查并提交一个小而准确的修改**。命令对应 Web 仓库 2026-11-22 的源码 `90d89de2`；本文编写时只做了仓库和脚本静态核对，**没有在作者环境实际启动服务器，运行结果为 `NOT RUN`**。

## 开始前准备

需要 Git、可运行 `node` 的 Node.js 环境、现代浏览器，以及可以访问 GitHub 的网络。若准备直接推送原仓分支，还需要相应仓库权限；没有权限时使用自己的 Fork 发起 PR。这个练习无需 Android SDK、签名密钥、官方 XAPK 或游戏存档。

在终端先检查本地工具：

```bash
git --version
node --version
```

这两条命令只是确认工具存在，不表示已经取得了正确的项目源码。

## 第一步：取得 Web 代码

```bash
git clone https://github.com/OrekiDawson/AD-Oreki-Edition-Web.git
cd AD-Oreki-Edition-Web
git status --short
git rev-parse HEAD
```

第一次克隆后，`git status --short` 通常没有输出，说明没有本地修改；`git rev-parse HEAD` 会显示你当前的完整提交 ID。请记住这个 ID，后续若某次文档解释与运行行为不符，就能检查是不是代码版本发生了变化。

教程中的源码示例基于 [Web Commit `90d89de2`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/tree/90d89de2048332f3c329ae6834ebee2675453a02)。不必强行切换到旧 Commit；但如果今天的 `main` 已更新，应先阅读实际文件再沿用下面的结论。

## 第二步：用 HTTP 启动页面

项目根目录有一个 [`serve.mjs`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/90d89de2048332f3c329ae6834ebee2675453a02/serve.mjs)。它使用 Node 内置的 `http`、`fs` 等模块提供静态文件，不依赖额外安装的 HTTP 服务包。浏览器里的 ES 模块应当通过 HTTP 加载，而不是直接双击 `index.html` 以 `file://` 方式打开。

仍在 Web 仓库根目录时，执行：

```bash
node --check serve.mjs
node serve.mjs 8080
```

第一个命令只检查 JavaScript 语法；第二个命令才真正启动本地服务。**预期**终端会提示服务监听 `http://127.0.0.1:8080/`。用浏览器打开这个地址，观察页面是否正常加载。服务器绑定 `127.0.0.1`，因此默认仅供本机访问，不是部署到公网。

如果遇到端口占用，脚本会给出相关提示。可以停止已有服务，或换一个端口：

```bash
node serve.mjs 8081
```

如果浏览器打开空白页，先检查终端是否报错、浏览器开发者工具的 Console 和 Network 是否出现请求错误，再排查资源路径；不要直接修改游戏进度试图“修复”加载。

完成观察后，回到运行服务器的终端用 `Ctrl+C` 终止程序。

## 第三步：跟着一条真实代码路径读

先打开 [`src/main.js`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/90d89de2048332f3c329ae6834ebee2675453a02/src/main.js)。它先导入速度配置、触控拖动支持、兼容层与 Oreki 工具，再从 `src/game.js` 导入 `browserCheck` 和 `init`。最后执行的是：

```js
if (browserCheck()) init();
```

这不是完整的游戏循环，而是**浏览器启动入口**。接着打开 [`src/game.js`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/90d89de2048332f3c329ae6834ebee2675453a02/src/game.js)；这里能看到游戏初始化和 MOD 自动化模块的集成。

例如，`src/game.js` 会引入 `OrekiSmartExecutor`，并使用 `register(...)` 关联若干策略执行入口。这说明**调度的逻辑与实际执行的逻辑不是同一个模块**。如果需要修改自动化，不应仅凭 `src/main.js` 猜测所有行为都在页面启动时完成，而应进一步查阅 `src/core/` 中对应实现。

本步骤的可检验结果是：你应该能准确指出“本地 HTTP 入口是什么、浏览器初始化入口是什么、游戏与自动化集成点在哪里”，并给出这些实际文件，而不是只记住了某个 R 轮次编号。

## 第四步：做一次安全的小改动

第一次练习推荐修改**已存在且确实需要纠正的文档**，例如 Web `README.md` 中的启动或源码定位说明。不要为了交差提交无意义的空白行；如果原文没有错误或缺口，就停止这一步，换一个有事实依据的 Issue。

有实际内容需要修正时，再建立分支：

```bash
git switch -c docs/first-contribution
```

使用自己熟悉的编辑器修改相应文件。假如你修改的是 `README.md`，可以先检查：

```bash
git diff --check
git diff -- README.md
git status --short
```

`git diff --check` 主要检查空白符等 Diff 问题，**并不能确认你写的事实正确**。请再对照刚阅读的 `serve.mjs`、`src/main.js` 等原始文件，确认命令、目录、解释没有写错。

如果修改确实成立且你拥有对应仓库的写入权限：

```bash
git add README.md
git commit -m "docs: 核对本地启动说明"
git push -u origin docs/first-contribution
```

然后从 GitHub 为该分支创建 PR。没有原仓写入权限时，应先 Fork，再把分支推送到自己的 Fork；上面的 `origin` 命令不能直接照搬为所有账户的推送方式。

PR 描述至少回答：**纠正了什么、用哪个实际源码版本核对、执行了哪些命令、什么没有执行**。如果只跑了语法检查，就写“语法检查”，别写“游戏功能 PASS”。

## 继续开发前要知道的两件事

**Android 的构建比 Web 复杂得多。** 生产 Kotlin 业务位于 `app/src/main/kotlin/`，AGP 工程位于 `agp/`。默认 `./gradlew -p agp :app:assembleRelease` 只覆盖 bridge/骨架包模式；完整游戏还需要经过来源验证的游戏类 JAR 和 `orekiFullGame` 参数。千万别把骨架构建的 PASS 当成可交付的完整游戏 APK。详见 [Android 架构](/developer/architecture/android)和 [AGP 构建](/developer/build/agp)。

**游戏真实性比构建速度重要。** 影响资源、自动购买器、存档、挑战或结算的代码，必须保持合法前置和真实原版结算；一次静态语法检查或网页打开成功无法证明 180 分钟终局、存档兼容或跨端一致性。

## 本文实际核查范围

- 已从 GitHub 读取 Web `README.md`、`package.json`、`serve.mjs`、`src/main.js` 与 `src/game.js` 的源码内容，并确认所述路径存在。
- **作者环境的 Git 克隆、Node 启动、浏览器加载、代码修改和 PR 演练：`NOT RUN`**。步骤是可供读者执行的教程，不是本次作者已经完成的实测记录。
- 如今日源码已有更新，优先以实际 `HEAD` 和仓库最新规则为准，不能套用过期结果。
