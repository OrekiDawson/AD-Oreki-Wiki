#!/usr/bin/env node
import fs from "node:fs"

const config = fs.readFileSync("quartz.config.yaml", "utf8")
const styles = fs.readFileSync("quartz/styles/custom.scss", "utf8")
const errors = []
if (!/^\s*enableSPA:\s*true\s*$/m.test(config))
  errors.push("Quartz enableSPA 必须保持 true，以保留快速客户端导航")
if (!/\.navigation-progress[\s\S]*?display:\s*none\s*!important/.test(styles))
  errors.push("必须隐藏 .navigation-progress，不能显示页面加载进度条")
if (!/\.page-transition[\s\S]*?animation:\s*none\s*!important/.test(styles))
  errors.push("必须禁用页面切换动画")
if (!/::view-transition-(?:group|old|new)\(root\)[\s\S]*?animation:\s*none\s*!important/.test(styles))
  errors.push("必须禁用 View Transition 页面动画")
if (errors.length) {
  console.error(errors.join("\n"))
  process.exit(1)
}
console.log("OK 页面切换保持 SPA，但无动画和 navigation-progress")
