---
title: "Oreki Edition 项目地图"
description: "用源码、构建输入和运行边界理解 Android/Web 双端项目，而不是把仓库当成一串 PR 记录"
tags:
  - 开发入门
  - Android
  - Web
  - 架构
aliases:
  - "/getting-started/project-overview"
---

Oreki Edition 不是把同一套界面复制到两个平台。它把《反物质维度》的成长规则、自动化策略和工程门禁分别落在 Android 与 Web，再尽力让玩家看到相同的因果：资源怎样增长、重置保留什么、自动化何时允许动作、存档怎样恢复。

读项目时最有用的心智模型不是“哪个仓库最近改了什么”，而是下面这条链：

```text
原版游戏规则
      ↓
平台运行时（Android DEX / Web JavaScript）
      ↓
Oreki 适配层与自动化策略
      ↓
构建输入、资源与签名
      ↓
设备或浏览器中的可观察行为
```

每一层回答的问题不同。源码能说明调用关系，构建链能说明哪些源码进入产物，设备或浏览器才能说明行为是否真的发生。把其中一层的结论冒充另一层，是这个项目最容易出现的误判。

## 三个仓库，各自拥有一段真相

| 位置                                                                                | 主要职责                                         | 适合从哪里开始                                                           |
| ----------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------ |
| [AD-Oreki-Edition-Android](https://github.com/OrekiDawson/AD-Oreki-Edition-Android) | Kotlin 接管层、Android 应用、AGP 构建和 APK 交付 | 根 `settings.gradle.kts`、`app/build.gradle.kts`、`app/src/main/kotlin/` |
| [AD-Oreki-Edition-Web](https://github.com/OrekiDawson/AD-Oreki-Edition-Web)         | 浏览器运行时、Web 自动化和浏览器验收             | `src/main.js`、`src/game.js`、`src/core/`                                |
| [AD-Oreki-Wiki](https://github.com/OrekiDawson/AD-Oreki-Wiki)                       | 面向玩家和开发者的解释、来源与兼容入口           | `/player/`、`/developer/` 与来源索引                                     |

Workspace 和历史报告可以帮助追溯证据，但不是 Android 或 Web 的运行时。开发者应回到拥有代码的仓库确认当前实现，Wiki 只把已经能解释、能定位的事实整理成可读文章。

## Android：把未知的 DEX 收束在适配边界

Android 当前仓库的根工程由 `settings.gradle.kts`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/settings.gradle.kts；具体文件证据留在内部核验记录） 和 `:app` 组成。生产 Kotlin 位于 `app/src/main/kotlin/`；构建时生成的绑定位于 `build/kt/generated`，完整游戏的 Manifest、资源、assets 和 JNI 输入由 `app/build.gradle.kts`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/app/build.gradle.kts；具体文件证据留在内部核验记录） 和 `build-logic` 接入。

Android 的特别之处在于，官方游戏类并不是 MOD 的普通编译期依赖。 `GameApi.kt`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/GameApi.kt；具体文件证据留在内部核验记录） 因此承担一个窄而关键的边界：根据版本绑定解析类、字段和方法，缓存句柄，把失败转成可观察的 `OREKI_API_MISS`，再向调度器和 UI 提供语义化访问。自动化调度器不应该自己猜混淆名；它只应通过 `GameApi` 读取玩家状态或请求原版动作。

这也解释了为什么“把所有反编译类全部翻译成 Kotlin”不是默认的第一步：那会把整个官方运行时变成第二个需要同步的源码项目。更可维护的拆分是，MOD 自己拥有状态机、节拍和界面；原版对象的形状变化集中由适配层吸收。

## Web：浏览器入口更直接，但因果仍要追踪

Web 从 `src/main.js`（源码定位：OrekiDawson/AD-Oreki-Edition-Web@e1c93caa758de6c39cf814582123d4a35319eb25/src/main.js；具体文件证据留在内部核验记录） 进入，浏览器检查通过后初始化 `src/game.js`（源码定位：OrekiDawson/AD-Oreki-Edition-Web@e1c93caa758de6c39cf814582123d4a35319eb25/src/game.js；具体文件证据留在内部核验记录）。游戏循环、自动化注册表和页面同步在后续模块展开。这里没有 Android 那样的 DEX 反射边界，却有另一种边界问题：DOM、游戏状态和自动化策略若互相直接改写，页面看似更新，存档或下一次 tick 可能仍然落后。

因此比较双端时，不要比较函数名或文件数量，而要比较行为链：一次购买是否检查同样的前置，是否真实扣除资源，是否触发正确的重置副作用，保存字段是否更新，下一次 tick 是否还能继续。界面不同并不自动表示不一致；因果不同才是问题。

## 构建层：源码存在不等于产物包含它

Android 根 `:app` 的构建输入至少包括：

- `app/src/main/kotlin/` 中的生产业务；
- `build/kt/generated` 中的绑定输入；
- `oreki.fullGameStage` 指向的 Manifest 与资源；
- `build/agp-generated-res`、`build/agp-fullgame-assets` 和 `scripts/payload/lib`；
- 变体、签名和 R8 配置。

这些输入由 `build-logic` 插件和 `local.properties` 共同组织。因而 `:app:compileDebugKotlin` 通过，并不能推出完整游戏 APK 可安装；APK 能安装，也不能推出反射映射、阶段门禁和自动购买器都正确。开发者需要把“编译、打包、签名、安装、运行”当作五个不同问题。

## 如何选择阅读路径

- 想改 Android 业务：先读 [Android 架构](/developer/architecture/android)，再看 [混合运行时 ABI](/developer/architecture/kotlin-runtime) 和 [目录迁移](/developer/architecture/directory-migration)。
- 想改构建：从 [AGP 构建管线](/developer/build/agp) 开始，随后看 [R8](/developer/build/r8)、[APK 签名](/developer/build/apk-signing) 和 [CI/CD](/developer/build/ci-cd)。
- 想改 Web 或对齐双端：读 [Web 架构](/developer/architecture/web) 与 [双端一致性](/developer/architecture/parity)，再回到具体的 `src/core/` 或 Android `GameApi`。
- 第一次贡献：按 [第一次参与 Android 开发](/developer/first-contribution) 完成一条可解释、可验证的小闭环。
- 遇到“源码看着对、游戏表现不对”：先查 [来源索引](/developer/references/source-index) 的版本边界，再进入 [故障排查](/developer/troubleshooting/)；不要用旧报告的 PASS 替代当前候选的运行证据。

本文依据 Android `9d8fc46ce99279720b5b3068027bb76bceb35756` 的根工程、构建配置、`GameApi` 与调度器源码，以及 Web `e1c93caa758de6c39cf814582123d4a35319eb25` 的入口文件撰写。旧 URL `/getting-started/project-overview` 保留为兼容别名；本文解释的是源码与构建边界，不宣称当前 APK、浏览器终局或跨端运行验收已经完成。
