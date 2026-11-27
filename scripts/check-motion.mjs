#!/usr/bin/env node
import fs from "node:fs"

const config = fs.readFileSync("quartz.config.yaml", "utf8")
const styles = fs.readFileSync("quartz/styles/custom.scss", "utf8")
const errors = []
const cssBlock = (selector) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return styles.match(new RegExp(`${escaped}[^{}]*\\{([^{}]*)\\}`, "s"))?.[1] ?? ""
}
if (!/^\s*enableSPA:\s*true\s*$/m.test(config))
  errors.push("Quartz enableSPA 必须保持 true，以保留快速客户端导航")
const htmlBlock = cssBlock("html")
if (!/scroll-behavior:\s*auto\s*!important/.test(htmlBlock))
  errors.push("必须禁用 Quartz 根元素的平滑滚动")
const bootstrap = fs.readFileSync("scripts/bootstrap-quartz.sh", "utf8")
if (!bootstrap.includes("startLoading()") || !bootstrap.includes("SPA loading animation was not removed"))
  errors.push("构建必须移除 SPA 路由的进度条创建逻辑")
const progressBlock = cssBlock(".navigation-progress")
const pageTransitionBlock = cssBlock(".page-transition")
if (!/display:\s*none\s*!important/.test(progressBlock))
  errors.push("必须隐藏 .navigation-progress，不能显示页面加载进度条")
if (!/animation:\s*none\s*!important/.test(pageTransitionBlock) || !/transition:\s*none\s*!important/.test(pageTransitionBlock))
  errors.push("必须禁用页面切换动画")
const viewTransitionBlock = styles.match(/::view-transition-group\(root\),[\s\S]*?\{([^{}]*)\}/s)?.[1] ?? ""
if (!/animation:\s*none\s*!important/.test(viewTransitionBlock) || !/transition:\s*none\s*!important/.test(viewTransitionBlock))
  errors.push("必须禁用 View Transition 页面动画")
if (!/@media\s+all\s+and\s*\(\$mobile\)[\s\S]*?\.explorer\s+\.explorer-content[\s\S]*?transition:\s*none\s*!important/.test(styles))
  errors.push("移动端 Explorer 抽屉必须禁用 transform/visibility 过渡")
if (!/\.explorer,\s*\.explorer \*/.test(styles) || !/\.explorer \*/.test(styles.match(/\.explorer,[\s\S]*?transition:\s*none\s*!important/)?.[0] ?? ""))
  errors.push("Explorer 全部导航节点必须禁用 transition")
if (!/\.page\s*>\s*#quartz-body[\s\S]*?transition:\s*none\s*!important/.test(styles))
  errors.push("SPA 正文容器必须禁用 transition")
if (!/scroll-behavior:\s*auto\s*!important/.test(styles)) errors.push("导航与页面滚动必须保持即时")
if (!/\.explorer\.collapsed\s*>\s*\.explorer-content[\s\S]*?transform:\s*translateX\(-100vw\)\s*!important/.test(styles) ||
    !/\.explorer:not\(\.collapsed\)\s*>\s*\.explorer-content[\s\S]*?transform:\s*translateX\(0\)\s*!important/.test(styles))
  errors.push("移动端 Explorer 必须用即时状态切换抽屉位置")
if (errors.length) {
  console.error(errors.join("\n"))
  process.exit(1)
}
console.log("OK 已核对 SPA 配置与页面切换动画/进度条的静态覆盖规则；线上行为仍需浏览器验收")
