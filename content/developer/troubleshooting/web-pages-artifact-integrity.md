---
title: Web Pages 产物身份：如何证明线上不是另一份代码
description: 从部署提交、静态资源和浏览器行为三个层面定位 Web Pages 的错版、缺文件与缓存问题。
tags:
  - 开发者
  - 故障排查
  - Web
  - Pages
---

“页面能打开”只说明浏览器收到了可解析的 HTML。它不能说明页面来自批准的提交，也不能说明脚本、样式和媒体文件属于同一份构建。静态站点出现白屏、旧界面或部分功能失效时，先判断问题是在部署身份、目录组装、资源缓存还是运行时；否则很容易反复发布，却始终没有增加有效证据。

本文讨论 Web Pages 的产物身份和排障顺序。源码、部署工作流和验证脚本以 Web 仓库提交 [`b28b231efa5b694ce1da8a1e508cfc3ecc099344`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/tree/b28b231efa5b694ce1da8a1e508cfc3ecc099344) 为参考；它解释的是静态站点如何证明“发布了哪一版”，不是某次部署已经成功的报告。

## 先把故障分成四层

一次线上故障通常要沿着下面的顺序缩小：

```text
批准的源码提交
    ↓
对应的成功 CI 运行
    ↓
由该提交组装的 staging 目录
    ↓
线上文件与浏览器运行时
```

每层只能证明自己的问题：

| 层 | 能回答的问题 | 不能回答的问题 |
| --- | --- | --- |
| 源码提交 | 部署允许使用哪份代码 | Pages 是否真的收到了它 |
| CI 运行 | 这份提交是否通过指定检查 | 产物是否被另一份文件替换 |
| staging 目录 | HTML 和本地资源是否组成完整站点 | CDN 是否仍返回旧文件 |
| 浏览器运行时 | 当前下载的文件能否启动并推进 | 这份文件来自哪次构建 |

因此，不能用“CI 绿了”证明线上版本，也不能用“浏览器启动了”反推部署身份。

## 第一步：确认部署对象没有漂移

部署工作流通过 `workflow_dispatch` 接收 `approved_sha`。它先检出这个精确提交，再要求：

```text
git rev-parse HEAD == approved_sha == GITHUB_SHA
```

随后按 `head_sha`、`event=push`、`main` 和成功结论寻找对应的 Web CI 运行，并检查 `Node checks` 与 `Mobile Chromium smoke`。这里的关键不是“找到最近一次成功运行”，而是确认成功运行检查的就是准备发布的提交。

如果工作流在批准后重新检出浮动的 `main`，就会形成错配：CI 检查了提交 A，部署却组装提交 B。即使 B 看起来更新，A 的检查结果也不能证明 B。遇到这种情况，应先停止线上验收，回到部署输入和 CI 的 `head_sha` 重新对齐。

当前仓库还需要受保护的 `web-production` 环境，并通过凭据触发 Pages 仓的 `deploy-approved-web.yml`。这意味着源仓库的成功只代表部署请求通过了自己的门槛，不能把它当成生产 Pages 已经完成更新。

## 第二步：检查 staging 是否是一个闭合的站点

[`scripts/check_pages_staging.py`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/scripts/check_pages_staging.py) 检查的是组装后的目录，而不是 Git 工作树。它验证：

- `.nojekyll`、`index.html`、`src/main.js` 和 `public/icon.png` 存在；
- `src`、`modules`、`public` 目录存在；
- `CNAME` 的内容严格为 `oreki.net`；
- `index.html` 引用的本地脚本、样式、图片和媒体都能在 staging 根目录找到；
- 相对路径解析后仍在 staging 根目录内。

最后一项解决的是常见的“本机正常、Pages 缺资源”：HTML 中的 `../` 可能让浏览器离开预期目录，或者 Windows 不区分大小写而生产静态服务器区分大小写。staging 检查通过，只能证明目录形状和静态引用完整，不能证明游戏逻辑或线上缓存正确。

修改组装脚本后，应该用一个故意缺失的资源做负向测试：暂时移走被 `index.html` 引用的文件，检查器必须失败。若缺文件仍然通过，说明守卫没有覆盖真实引用路径。

## 第三步：用线上身份文件排除错版

Pages 站点中的 `deployment.json` 是给验收脚本读取的身份记录，内容类似：

```json
{
  "web_sha": "批准部署的 40 位提交 SHA",
  "web_ci_run_id": 123456789
}
```

它不是游戏版本号，也不参与页面逻辑。它只回答两个问题：线上声称来自哪个 Web 提交，以及复用了哪次成功 CI 运行。

如果 `web_sha` 或 `web_ci_run_id` 与批准值不符，先停止后续浏览器检查。继续点击页面只会把一份身份不明的站点当成候选。若身份文件正确但页面仍旧，说明问题转移到了静态文件或缓存层，而不是继续修改部署元数据。

## 第四步：比较资源字节，再进入浏览器

[`verify-live.mjs`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/reports/R109-01/web-pages/verify-live.mjs) 读取线上 `deployment.json` 时加入缓存破坏参数，然后把线上与批准提交中的 `src/main.js` 分别下载，比较长度和 SHA-256。

这个入口脚本是有用的第一根探针，因为它连接 shims、全局桥和游戏入口，但它不是整站哈希。不同结果应这样解释：

- 身份文件正确、入口脚本不同：检查 Pages 组装阶段、旧 artifact 和 CDN 缓存；
- 入口脚本相同、页面仍加载旧组件：继续比较受影响的模块、样式或媒体文件；
- 身份和资源都相同、页面仍白屏：部署身份边界已排除，转查模块解析、shims、全局桥和 `init()` 顺序；
- 资源一致但游戏不推进：转查存档、游戏时钟、自动化或 UI 投影，不要继续重跑部署。

入口脚本相同不能写成“全站完全一致”。修复涉及其他资源时，应把相同的字节比较扩展到这些资源；否则只能证明入口没有漂移。

## 浏览器检查应该放在最后

身份和资源通过后，再用移动视口打开站点，观察三类信号：

1. `#ui` 出现可读内容；
2. 反物质等运行时对象可以访问；
3. 等待一段时间后，游戏时间或资源按预期变化。

还要同时记录第一个 `pageerror`、失败资源 URL、请求失败和控制台错误。预期的第三方 CSP 噪声可以单独豁免，但每条豁免都要有明确来源；不能把所有控制台错误都归入噪声，否则真正的模块加载失败会被掩盖。

移动端导航和截图属于行为检查，不是部署身份检查。只有当身份、资源和启动都已对齐后，导航不动或资源不变才值得进入 UI、游戏循环或存档排查。

## 按症状选择下一步

### `deployment.json` 不是批准值

确认 Pages 工作流使用的 `approved_sha`，确认它存在于 `main`，再确认对应的 CI 运行成功。不要用“最近一次成功”替代精确提交匹配。

### 身份正确，但入口字节不同

检查 Pages 仓是否检出了错误 ref、是否复用了旧 artifact，以及身份文件和静态文件是否由同一次 dispatch 生成。缓存破坏请求只能帮助观察真实响应，不能修复错误部署。

### staging 通过，线上缺少资源

比较 staging 清单、Pages artifact 和线上失败响应，重点检查路径大小写、URL 编码、`CNAME` 和 `.nojekyll`。Windows 本地测试通过不代表区分大小写的生产服务器也能找到文件。

### 身份和资源正确，但移动端白屏

保存第一个 `pageerror`、失败资源 URL 和启动阶段网络响应，转查模块解析、shims、全局桥和 `init()` 顺序。继续发布同一份产物不会增加证据。

### 能启动，但游戏不动

先确认当前入口和相关模块确实被加载，再区分游戏时钟、存档加载、自动化动作和 UI 投影。资源哈希只能证明“拿到什么”，不能证明“代码做了什么”。

## 修改发布链后的最小验证

修改部署工作流或组装脚本后，按以下顺序验证：

1. 用 [`check_deploy_workflow.mjs`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/scripts/check_deploy_workflow.mjs) 确认精确 SHA、对应 CI、受保护环境和 Pages dispatch 仍然存在；
2. 在临时 staging 目录中执行一次缺资源的负向测试；
3. 从同一候选生成 `deployment.json`，核对 SHA 和 CI 运行编号；
4. 部署后先检查身份与受影响资源字节，再做移动浏览器启动、时钟和导航检查。

这套顺序把“发布错版”“目录缺文件”“缓存旧资源”和“游戏运行故障”分开。每一层都先证明自己的对象，下一层才有继续调查的价值。

## 相关入口

- [Pages 请求工作流 `deploy.yml`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/.github/workflows/deploy.yml)：批准提交、CI 复用、环境保护和 Pages dispatch。
- [staging 检查器 `check_pages_staging.py`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/scripts/check_pages_staging.py)：站点结构、CNAME 与本地资源路径检查。
- [工作流结构守卫 `check_deploy_workflow.mjs`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/scripts/check_deploy_workflow.mjs)：阻止浮动分支和直接覆盖 Pages。
- [线上验证 `verify-live.mjs`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/b28b231efa5b694ce1da8a1e508cfc3ecc099344/reports/R109-01/web-pages/verify-live.mjs)：线上身份、资源字节与移动浏览器检查。
- [Web 端架构](/developer/architecture/web)：身份和资源通过后，继续定位模块初始化和游戏循环故障。
