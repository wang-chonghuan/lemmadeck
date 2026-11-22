const assert = require("node:assert/strict")
const test = require("node:test")
const { proseFlow } = require("./htmlfrag.js")

const figure = (id) => ({ kind: "fig", id: `fig-${id}`, label: `图 ${id}` })
const caption = (id) => ({ kind: "cap", text: `图 ${id}` })

test("grouped captions follow their uniquely labeled figures without changing source blocks", () => {
  const figures = [54, 55, 56].map(figure)
  const captions = [54, 55, 56].map(caption)
  const input = [...figures, ...captions]
  const snapshot = JSON.stringify(input)
  assert.deepEqual(proseFlow(input), [
    figures[0], captions[0], figures[1], captions[1], figures[2], captions[2],
  ])
  assert.equal(JSON.stringify(input), snapshot)
  assert.equal(proseFlow(input)[1], captions[0])
})

test("unmatched and duplicate captions retain source order", () => {
  for (const input of [
    [figure(54), figure(55), caption(54)],
    [figure(54), figure(55), caption(54), caption(54)],
    [figure(54), figure(54), caption(54), caption(54)],
    [figure(54), { kind: "cap", text: "Additional explanation" }],
  ]) assert.deepEqual(proseFlow(input), input)
})

test("caption matching does not cross prose or change semantic paragraph boundaries", () => {
  const first = { kind: "p", text: "First paragraph." }
  const second = { kind: "p", text: "Second paragraph." }
  const input = [first, figure(54), figure(55), caption(54), caption(55), second]
  const flow = proseFlow(input, [{ before: first.text, after: second.text }])
  assert.deepEqual(flow.filter((block) => block.kind === "p").map((block) => block.text),
    [first.text, second.text])
  assert.equal(flow.at(-1).sectionBreak, true)
  const separated = [figure(54), first, caption(54)]
  assert.deepEqual(proseFlow(separated), separated)
})
