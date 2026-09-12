const assert = require("node:assert/strict")
const { inline, proseParagraphs } = require("../tools/htmlfrag.js")

const html = inline("题目：\n1) $x+1$；\n2) $x+2$.")
assert.match(html, /题目：<br>1\)/)
assert.match(html, /；<br>2\)/)

assert.deepEqual(
  proseParagraphs("第一句。\n第二句。\n\n第三句。"),
  ["第一句。\n第二句。", "第三句。"],
)
