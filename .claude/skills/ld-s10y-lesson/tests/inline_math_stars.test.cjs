const assert = require("node:assert/strict")
const test = require("node:test")
const { inline, proseInline } = require("../tools/htmlfrag.js")

const annotations = (html) => [...html.matchAll(
  /<annotation encoding="application\/x-tex">([\s\S]*?)<\/annotation>/g,
)].map((match) => match[1])

test("wildcard stars remain literal in every adjacent formula", () => {
  for (const render of [inline, proseInline]) {
    const html = render("$72***$ and $75***$; $*3***$ and $*8*$")
    assert.deepEqual(annotations(html), ["72***", "75***", "*3***", "*8*"])
    assert.ok(!html.includes("<strong>"))
    assert.ok(!html.includes("S10YINLINE"))
  }
})

test("prose bold can enclose a formula without changing its stars", () => {
  const html = inline("**Unit $|OB|$** and **$72***$**.")
  assert.equal((html.match(/<strong>/g) || []).length, 2)
  assert.deepEqual(annotations(html), ["|OB|", "72***"])
})

test("marker-like source text and ordinary emphasis remain unchanged", () => {
  const html = inline("S10YINLINE0END **word** $2$.")
  assert.ok(html.startsWith("S10YINLINE0END <strong>word</strong> "))
  assert.deepEqual(annotations(html), ["2"])
})
