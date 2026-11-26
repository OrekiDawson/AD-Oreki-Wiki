# 原版 Wiki 首页对应清单

本清单把原版 Wiki 首页与页面目录的导航栏目对应到本站中文入口。它只记录真实存在的译文路径；尚未收录的条目保留英文来源链接，不创建空白占位页。

| 原版首页栏目                  | 本站入口                                                                                         | 处理原则                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| About Antimatter Dimensions   | `/player/original/` 首页“关于原版游戏”                                                           | 中文本地化介绍，不能混入 MOD 事实            |
| Play for free / 平台          | `/player/original/` 首页平台入口                                                                 | 只保留真实官方链接，不复制英文站的动态版本号 |
| Guides                        | `/player/` 玩家专区与原版阶段导航                                                                | 原版译文和本站原创攻略分开                   |
| Mechanics                     | “Ω 初始阶段”与“其他资料”                                                                         | 优先链接已收录译文                           |
| Game Navigation               | “游戏进程导航”                                                                                   | 保留 Ω、∞、Δ、Ϟ、⚕ 的阶段层次                |
| Contributing / Official Links | “社区与原始资料”                                                                                 | 保留源码、原版 Wiki 和贡献入口               |
| 英文页面目录                  | [原版 Wiki 页面目录](https://antimatterdimensions.wiki.gg/wiki/Antimatter_Dimensions_Wiki/pages) | 作为尚未收录条目的真实来源                   |

## 覆盖检查

首页导航只链接当前 `content/player/original/` 中存在的译文页面；每次新增或迁移译文后运行 `node scripts/check-navigation.mjs`，并用 `docs/translation/source-manifest.json` 核对来源、原始修订、署名和审校状态。原版首页视觉或栏目调整不得改变原版与 MOD 的内容边界。
