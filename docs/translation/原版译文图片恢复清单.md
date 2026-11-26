# 原版译文图片恢复清单

原版 Wiki 的图片不是装饰品：界面截图能说明按钮位置，阶段图标能标记进度，时间研究树和符文图示则直接承载机制信息。本清单由 `scripts/audit-original-images.mjs` 根据原版 Wiki API 生成，逐页记录原文图片、本站资源路径、许可证、署名和恢复状态。

当前策略是先审查、后下载。来源不明、许可证无法确认或带有第三方限制的素材保持“待核实”，不以外站热链或临时截图代替授权审查。恢复图片时应保留原文相对位置、图注、替代文本、清晰度和动画效果；不得用 AI 生成的虚构游戏截图替换真实素材。

运行：

```sh
node scripts/audit-original-images.mjs
```

机器可读明细见 [`original-image-manifest.json`](./original-image-manifest.json)。
