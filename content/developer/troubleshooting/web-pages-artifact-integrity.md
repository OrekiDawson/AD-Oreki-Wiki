---
title: Web Pages 产物身份：如何证明线上不是另一份代码
description: 从固定部署工作流和验证脚本解释 Web Pages 如何绑定精确源码、CI、静态资源与移动端行为，并排查缓存漂移和错误部署。
tags:
  - 开发者
  - 故障排查
  - Web
  - Pages
---

“网页能打开”是发布检查里最容易得到、也最容易被高估的结论。对一个带游戏逻辑的静态站点来说，线上页面可能来自旧部署、错误分支、残留资源或与源码不匹配的缓存；首页显示出来，只说明浏览器拿到了一组可以解析的字节。

Web 端当前的发布设计把“这是谁的产物”单独当成一个问题回答。本文依据固定提交 `b28b231efa5b694ce1da8a1e508cfc3ecc099344` 的部署工作流、staging 检查器、部署结构检查和线上验证脚本，解释如何把源码身份、CI 身份、静态文件身份和真实浏览器行为连起来。它不重复 Android 的 AGP、APK 签名或通用 CI 任务图。

## 产物身份不是一个 SHA

一个可追溯的 Web 部署至少有四个身份：

```text
批准的 main SHA
        ↓
该 SHA 对应的成功 Web CI Run
        ↓
由该 SHA 组装的 Pages staging 目录
        ↓
线上 deployment.json、资源字节和浏览器行为
```

只知道其中一个哈希是不够的。源码 SHA 能说明“准备从哪个提交发布”，不能说明 Pages 实际收到了它；`src/main.js` 的字节哈希能说明一个关键文件相同，不能说明整站所有资源和运行行为都正确；浏览器能启动，也不能反推出它用了哪个 CI Run。发布验收的价值，就是让这些证据互相指向同一个候选。

## 部署入口为什么要求精确 SHA

固定的 [`.github/workflows/deploy.yml`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/.github/workflows/deploy.yml) 只接受 `workflow_dispatch` 的 `approved_sha` 输入。门禁作业用这个值检出源码，然后比较：

```text
git rev-parse HEAD == approved_sha == GITHUB_SHA
```

随后它按 `head_sha`、`event=push`、`main` 和成功结论寻找对应的 Web CI Run，并要求其中的 `Node checks` 与 `Mobile Chromium smoke` 都成功。这里的重点是“复用已经检查过的精确提交”，而不是重新找一个当前看起来最新的成功运行。

如果部署工作流直接检出 `main`，就会出现一个危险窗口：CI 检查的是提交 A，人工批准后 `main` 前进到提交 B，部署却把 B 组装进 Pages。B 可能是合格修复，也可能是未经审查的半成品；无论哪种情况，原来的 CI 结果都不再能证明部署对象。

工作流的第二个作业还要求 `web-production` 环境，并通过受保护凭据触发 Pages 仓的 `deploy-approved-web.yml`。当前仓库只负责发出带身份的部署请求，不直接把静态文件推入生产 Pages；这使 Pages 仓的构建和生产权限保持独立。

## staging 检查的是“站点形状”

[`scripts/check_pages_staging.py`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/scripts/check_pages_staging.py) 在发布前检查组装好的目录，而不是只检查 Git 工作树。它要求：

- `.nojekyll`、`index.html`、`src/main.js` 和 `public/icon.png` 存在；
- `src`、`modules`、`public` 目录存在；
- `CNAME` 的内容严格是 `oreki.net`；
- `index.html` 引用的本地脚本、样式、图片和媒体文件都能在 staging 根目录中找到；
- 相对资源路径不能逃出 staging 根目录。

最后一项尤其有用。HTML 可能语法正确，文件也可能全部存在，但一个多余的 `../` 会让生产服务器寻找 staging 之外的资源。检查器把引用解析后约束在根目录内，先阻止这类“本机能打开、Pages 丢文件”的差异。

这个脚本只证明产物目录结构和静态引用完整，不证明游戏逻辑正确，也不证明线上已经部署。它是发布前的形状检查，不是浏览器验收的替代品。

## `deployment.json` 是线上身份证

Pages 站点需要一个很小但明确的身份文件，例如：

```json
{
  "web_sha": "批准部署的 40 位提交 SHA",
  "web_ci_run_id": 123456789
}
```

它不是业务数据，也不应该被页面逻辑当作版本号使用。它回答的是运维问题：线上自称来自哪个 Web 提交、复用了哪次成功 CI。若这个文件与批准值不一致，线上验收应在资源和浏览器检查之前停止；继续点页面只会把一份身份不明的站点当成候选。

## 为什么还要比较线上 `src/main.js` 字节

线上验证脚本 [`verify-live.mjs`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/reports/R109-01/web-pages/verify-live.mjs) 先带缓存破坏参数读取 `deployment.json`，确认 `web_sha` 和 CI Run 都匹配；然后同时读取线上与本地精确提交的 `src/main.js`，计算 SHA-256 并比较字节长度与摘要。

这一层专门对付静态托管的错觉：

- `deployment.json` 正确但 `src/main.js` 不同，说明身份文件和资源发布没有绑定好；
- `src/main.js` 相同但浏览器拿到旧组件，说明还要继续检查其他静态资源或缓存；
- 两者都相同但启动失败，问题已越过部署身份边界，应进入运行时排查。

之所以选择入口脚本作为第一份字节探针，是因为它连接了 shims、全局桥和游戏入口；但它不是整站哈希。关键修复涉及其他模块时，线上验证还应对受影响资源做相同的比较，不能把一个入口文件的相同误写成“全站完全一致”。

## 浏览器验证回答另一类问题

线上验证脚本在身份和字节检查之后，才用移动视口打开站点。它监听页面异常、控制台错误、失败响应和请求失败，并等待三个比“HTTP 200”更接近游戏运行的信号：

1. `#ui` 已出现可读内容；
2. 反物质等运行时对象已经可访问；
3. 等待一段时间后，游戏时间或资源发生合理变化。

随后它执行移动端导航交互并保存截图。这个顺序不是为了让脚本更复杂，而是为了保留因果：如果身份不匹配，先报告部署错误；如果身份和入口字节匹配但 `#ui` 不出现，才调查运行时；如果能启动但导航或资源不动，才进入功能故障。

浏览器检查也必须把“预期的第三方 CSP 噪声”和真正的页面错误分开，否则一个分析脚本被浏览器策略拦截，就可能掩盖实际的模块加载失败。反过来，也不能把所有控制台错误都列为可忽略噪声；每条豁免都应有明确来源和范围。

## 常见故障的定位顺序

### `deployment.json` 不是批准值

先停止，不要继续验收页面。确认 Pages 工作流使用的是哪个 `approved_sha`，再确认它在 `main` 上真实存在且有对应成功 CI。不要用“最近一次 CI 成功”替代精确 SHA 的成功，因为最近一次可能属于不同分支或不同候选。

### 身份正确，入口字节不一致

优先检查 Pages 仓组装阶段是否检出了错误 ref、是否复用了旧 artifact，以及 CDN/浏览器缓存是否被验证请求绕开。若 `deployment.json` 由一套作业写入而静态文件由另一套作业生成，还要检查二者是否来自同一次 dispatch 输入。

### staging 通过，线上缺少资源

比较 staging 清单、Pages artifact 内容和线上失败响应。重点看相对路径大小写、URL 编码、`CNAME` 和 `.nojekyll`；Windows 本地文件系统对大小写不敏感，而生产静态服务器通常不会替你修正大小写错误。

### 身份和资源都正确，但移动端白屏

把问题转交运行时边界：模块解析、shims、全局桥、浏览器能力和 `init()` 的阶段顺序。此时继续重跑部署不会增加证据；应保存第一个 `pageerror`、失败资源 URL 和启动时的网络响应。

### 能启动但游戏不动

先检查页面是否真的加载了当前入口和相关模块，再区分游戏时钟没有推进、存档加载异常、自动化没有动作和 UI 没有投影。资源哈希只能证明“拿到什么”，不能证明“代码做了什么”。

## 修改发布链时的最小验证

修改 Pages 工作流或组装脚本后，至少做四层验证：

1. 用 `scripts/check_deploy_workflow.mjs` 检查工作流仍要求 `approved_sha`、精确检出、对应 CI Run、受保护环境和 Pages dispatch，并且没有偷偷恢复直接推送 Pages 的路径。
2. 在临时 staging 目录运行 `check_pages_staging.py`，故意移走一个本地资源，确认检查器会失败；否则“通过”可能只是没有覆盖守卫。
3. 用固定提交生成 `deployment.json`，核对 SHA 与 CI Run 字段来自同一候选。
4. 部署后先验收身份和资源字节，再做移动浏览器启动、时钟和导航检查。

这套顺序的核心经验是：发布系统不要只告诉你“最后一步成功”，而要让每一步都能回答它究竟在验证哪一份对象。线上站点是可执行产物，不是源码仓库的自动镜像；只有把身份、字节和行为接起来，才知道读者打开的到底是哪一版游戏。

## 相关源码

- [Pages 请求工作流 `deploy.yml`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/.github/workflows/deploy.yml)：批准 SHA、复用 CI、环境保护与 Pages dispatch。
- [staging 检查器 `check_pages_staging.py`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/scripts/check_pages_staging.py)：站点结构、CNAME 与本地资源路径检查。
- [工作流结构守卫 `check_deploy_workflow.mjs`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/scripts/check_deploy_workflow.mjs)：阻止浮动分支和直接覆盖 Pages。
- [线上验证 `verify-live.mjs`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/reports/R109-01/web-pages/verify-live.mjs)：线上身份、资源字节与移动浏览器验收。
- [Web 端架构](/developer/architecture/web)：身份和资源通过后，继续定位模块初始化和游戏循环故障。
