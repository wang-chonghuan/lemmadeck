const assert = require("node:assert/strict")
const { inline, proseInline, proseParagraphs, proseFlow } = require("../tools/htmlfrag.js")

const html = inline("题目：\n1) $x+1$；\n2) $x+2$.")
assert.match(html, /题目：<br>1\)/)
assert.match(html, /；<br>2\)/)

const proseHtml = proseInline("当 a=8 时，值为 72，且 $a+1=9$。")
assert.match(proseHtml, /当 <span class="sr-prose-math">a<\/span>=<span class="sr-prose-math">8<\/span>/)
assert.match(proseHtml, /值为 <span class="sr-prose-math">72<\/span>/)
assert.equal((proseHtml.match(/sr-prose-math/g) ?? []).length, 3)

assert.deepEqual(
  proseParagraphs("第一句。\n第二句。\n\n第三句。"),
  ["第一句。\n第二句。", "第三句。"],
)

assert.deepEqual(
  proseFlow([
    { kind: "p", text: "第一段。\n\n第二段。" },
    { kind: "p", text: "第三段。" },
  ], [1, 2]),
  [
    { kind: "p", text: "第一段。" },
    { kind: "p", text: "第二段。", sectionBreak: true },
    { kind: "p", text: "第三段。", sectionBreak: true },
  ],
)
