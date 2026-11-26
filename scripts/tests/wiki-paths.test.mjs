import test from "node:test"
import assert from "node:assert/strict"
import { CATEGORY_DIRS, ORIGINAL_TRANSLATION_DIR } from "../wiki-paths.mjs"

test("原版译文目录是正式内容分类且只有一个路径来源", () => {
  assert.ok(CATEGORY_DIRS.includes(ORIGINAL_TRANSLATION_DIR))
  assert.equal(ORIGINAL_TRANSLATION_DIR, "content/player/original/")
})
