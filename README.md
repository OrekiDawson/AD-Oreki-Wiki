# 反物质维度中文 Wiki

[打开 Wiki](https://wiki.oreki.net/) · [玩家专区](https://wiki.oreki.net/player/) · [开发者专区](https://wiki.oreki.net/developer/)

这里是一座写给人的《反物质维度》（Antimatter Dimensions）中文百科。你可以把它当作攻略书、机制词典，也可以在某个看似离谱的数字旁边坐下来，看看一个“无限”究竟是怎样长出来的。

## 两条阅读路线

### 玩家专区

从[开始游玩](https://wiki.oreki.net/player/getting-started/)起步，沿着无限、永恒、现实与天神一路深入；想知道一个按钮为什么出现、一个重置会留下什么，或自动化为什么突然停了，可以从[玩法机制](https://wiki.oreki.net/player/gameplay/)、[常见问题](https://wiki.oreki.net/player/faq/)和[存档说明](https://wiki.oreki.net/player/gameplay/saves)查起。

专区也收录[原版 Wiki 中文译文](https://wiki.oreki.net/player/original/)。译文尽量忠实于原文，原版规则、Oreki Edition 的改动和历史资料会分开说明。

### 开发者专区

这里不写“某天改了哪个文件”的流水账，而是解释真正值得带走的知识：

- [项目架构](https://wiki.oreki.net/developer/architecture/)：Android 与 Web 从哪里启动，模块怎样协作。
- [构建与交付](https://wiki.oreki.net/developer/build/)：源码如何变成 APK，签名、优化和构建工具各自解决什么问题。
- [逆向与源码恢复](https://wiki.oreki.net/developer/reverse-engineering/)：DEX、寄存器、混淆和 Kotlin 接管之间的关系。
- [排障与参考](https://wiki.oreki.net/developer/troubleshooting/)：从现象追到调用链、数据边界和可复现的修复路径。

如果你是第一次参与开发，可从[开发者专区首页](https://wiki.oreki.net/developer/)选择一条具体的最小路径。

## 为什么值得翻阅

反物质维度最迷人的地方，往往藏在“数字已经大到不讲道理”之后：浮点数会先投降，重置却把进度变成新的燃料；Android 和 Web 看起来在玩同一款游戏，内部却要用不同的语言和运行时维持相同的规则。Wiki 希望把这些机制讲清楚，也把其中的数学、工程取舍和设计巧思讲得有趣。

## 参与贡献

欢迎提交：

- 纠正可核查的事实、公式、数值或链接；
- 改善中文表达、导航和手机阅读体验；
- 补充有来源的机制说明或开发者技术文章；
- 审校原版译文，并保留原文链接、修订信息、署名和许可边界。

请先阅读[贡献与编辑指南](https://wiki.oreki.net/developer/editorial-guidelines)和[版权与许可](https://wiki.oreki.net/copyright)，再通过 [GitHub Issues](https://github.com/OrekiDawson/AD-Oreki-Wiki/issues) 或 Pull Request 提出修改。 维护者需要了解构建与发布细节时，请看仓库内的[维护说明](docs/MAINTENANCE.md)。好的贡献不必很大；一处准确的公式、一个清楚的例子，往往比一页空泛的总结更有用。

## 来源与许可

Wiki 的站点源码和文章位于本仓库：[OrekiDawson/AD-Oreki-Wiki](https://github.com/OrekiDawson/AD-Oreki-Wiki)。Android 与 Web 实现分别见 [Android 仓库](https://github.com/OrekiDawson/AD-Oreki-Edition-Android) 和 [Web 仓库](https://github.com/OrekiDawson/AD-Oreki-Edition-Web)。

本站有权授权的原创百科文字采用 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。原版 Wiki 译文、代码、图片和游戏素材仍受各自版权、许可证与署名要求约束；转载时请保留文章来源、作者与修改说明。

愿你在下一个数量级之前，先找到自己真正想读的那一页。
