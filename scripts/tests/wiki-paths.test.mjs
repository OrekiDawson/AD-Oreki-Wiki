import test from "node:test"
import assert from "node:assert/strict"
import { existsSync, readFileSync, readdirSync } from "node:fs"
import { CATEGORY_DIRS, ORIGINAL_NAMESPACE, ORIGINAL_ROUTE_PREFIX, ORIGINAL_TITLE_PREFIX, ORIGINAL_TRANSLATION_DIR } from "../wiki-paths.mjs"

test("原版译文目录是正式内容分类且只有一个路径来源", () => {
  assert.ok(CATEGORY_DIRS.includes(ORIGINAL_TRANSLATION_DIR))
  assert.ok(existsSync(ORIGINAL_TRANSLATION_DIR))
  const expectedRoutePrefix = `/${ORIGINAL_TRANSLATION_DIR.replace(/^content\//, "")}`
  assert.equal(ORIGINAL_ROUTE_PREFIX, expectedRoutePrefix)
  assert.equal(ORIGINAL_NAMESPACE, "original:")
  const pages = readdirSync(ORIGINAL_TRANSLATION_DIR).filter((name) => name.endsWith(".md") && name !== "index.md")
  assert.ok(pages.length > 0)
  for (const page of pages) {
    const titleLine = readFileSync(ORIGINAL_TRANSLATION_DIR + page, "utf8").split(/\r?\n/).find((line) => /^title:\s*/.test(line)) ?? ""
    const frontmatter = titleLine.match(/^\s*title:\s*(?:"([^"]*)"|'([^']*)'|([^#\s][^#]*?))\s*(?:#.*)?$/)?.slice(1).find((value) => value !== undefined)?.trim()
    assert.ok(frontmatter?.startsWith(ORIGINAL_TITLE_PREFIX), page)
  }
})
