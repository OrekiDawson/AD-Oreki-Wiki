#!/usr/bin/env bash
# 薄仓库构建准备：clone 固定版本的官方 Quartz 5 源码，再叠加本仓库内容。
# 用法: bash scripts/bootstrap-quartz.sh <target_dir>
set -euo pipefail
TARGET="${1:-.quartz-build}"
PIN="7cfb0796165c848be5438117e9806802123bf676"
rm -rf "$TARGET"
mkdir -p "$TARGET"
git -C "$TARGET" init -q
git -C "$TARGET" remote add origin https://github.com/jackyzha0/quartz.git
# 分支 v5 的 tip 会继续移动；按 Commit 拉取才能保证可复现构建。
git -C "$TARGET" fetch --depth 1 origin "$PIN"
git -C "$TARGET" checkout -q --detach FETCH_HEAD
ACTUAL="$(git -C "$TARGET" rev-parse HEAD)"
if [ "$ACTUAL" != "$PIN" ]; then
  echo "FAIL: Quartz v5 tip ${ACTUAL} 与固定版本 ${PIN} 不一致；请人工审核后更新 scripts/bootstrap-quartz.sh" >&2
  exit 1
fi
rm -rf "$TARGET/content"
cp -r content "$TARGET/content"
cp quartz.config.yaml "$TARGET/quartz.config.yaml"
if [ -d static ]; then
  rm -rf "$TARGET/quartz/static"
  mkdir -p "$TARGET/quartz/static"
  cp -r static/. "$TARGET/quartz/static/"
fi
if [ -d quartz/styles ]; then
  mkdir -p "$TARGET/quartz/styles"
  cp -r quartz/styles/. "$TARGET/quartz/styles/"
fi
mkdir -p "$TARGET/scripts"
cp -r scripts/. "$TARGET/scripts/"
cp README.md "$TARGET/README.md"
# 将内容许可说明同步到临时构建目录，供内容审核脚本验证。
cp LICENSE-CONTENT.md "$TARGET/LICENSE-CONTENT.md"
echo "Quartz source ready at $TARGET (pin $PIN)"
