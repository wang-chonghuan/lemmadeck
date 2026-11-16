const test = require("node:test")
const assert = require("node:assert/strict")
const { proseFlow, inline, proseInline } = require("../tools/htmlfrag.js")

const fig = (label) => ({ kind: "fig", id: label, label, text: "" })
const cap = (label) => ({ kind: "cap", label, text: label })

test("pairs uniquely labeled adjacent figures and captions without mutating source order", () => {
  const blocks = [fig("223"), fig("224"), cap("223"), cap("224")]
  const snapshot = JSON.stringify(blocks)
  assert.deepEqual(proseFlow(blocks), [blocks[0], blocks[2], blocks[1], blocks[3]])
  assert.equal(JSON.stringify(blocks), snapshot)
})

test("retains already paired figures and captions", () => {
  const blocks = [fig("223"), cap("223"), fig("224"), cap("224")]
  assert.deepEqual(proseFlow(blocks), blocks)
})

test("never guesses associations with missing, duplicate, or mismatched labels", () => {
  for (const blocks of [
    [fig("223"), fig("224"), cap("223")],
    [fig("223"), fig("224"), cap("223"), cap("223")],
    [fig("223"), fig("223"), cap("223"), cap("224")],
    [fig("223"), cap("224")],
    [fig(null), cap(null)],
  ]) assert.deepEqual(proseFlow(blocks), blocks)
})

test("does not move captions across prose or alter semantic section breaks", () => {
  const blocks = [fig("223"), { kind: "p", text: "Before.\n\nAfter." }, cap("223")]
  const flow = proseFlow(blocks, [{ before: "Before.", after: "After." }])
  assert.equal(flow[0], blocks[0])
  assert.equal(flow[1].text, "Before.")
  assert.equal(flow[2].text, "After.")
  assert.equal(flow[2].sectionBreak, true)
  assert.equal(flow[3], blocks[2])
})

test("renders single and double emphasis, preserves unmatched stars and escapes markup", () => {
  const unmarkLatin = (html) => html.replace(/<span class="sr-prose-math">([^<]+)<\/span>/g, "$1")
  for (const render of [inline, proseInline]) {
    assert.equal(unmarkLatin(render("*visible* and **definition**")), "<em>visible</em> and <strong>definition</strong>")
    assert.equal(unmarkLatin(render("*unmatched")), "*unmatched")
    assert.equal(unmarkLatin(render("*<term>*")), "<em>&lt;term&gt;</em>")
    const math = unmarkLatin(render("*visible* $a*b$ **definition**"))
    assert(math.includes("<em>visible</em>"))
    assert(math.includes("<strong>definition</strong>"))
    assert(math.includes('class="katex"'))
  }
})
