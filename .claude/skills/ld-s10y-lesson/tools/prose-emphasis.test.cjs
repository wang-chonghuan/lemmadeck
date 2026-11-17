const assert = require("node:assert/strict")
const test = require("node:test")
const { inline, proseInline } = require("./htmlfrag.js")

const dots = '<span style="text-emphasis-style: dot; text-emphasis-position: under;">'
const word = "\u52a8\u80fd"

test("faithful under-dots render without treating tag or CSS tokens as prose", () => {
  assert.equal(proseInline(`*${dots}${word}</span>*`), `<em>${dots}${word}</span></em>`)
  assert.equal(
    proseInline(`${dots}${word} m 2</span>`),
    `${dots}${word} <span class="sr-prose-math">m</span> <span class="sr-prose-math">2</span></span>`,
  )
})

test("only the two actual source under-dot styles accept attribute whitespace", () => {
  assert.equal(
    proseInline(`${dots.replace("; ", ";\n")}${word}</span>`),
    `${dots}${word}</span>`,
  )
  const filled = '<span style="text-emphasis: filled dot; text-emphasis-position: under;">'
  assert.equal(proseInline(`${filled}<em>${word}</em></span>`), `${filled}<em>${word}</em></span>`)
  assert.equal(
    proseInline(`<span style='text-emphasis-style: dot; text-emphasis-position: under;'>${word}</span>`),
    `${dots}${word}</span>`,
  )
})

test("source strong and em remain attribute-free and properly nested", () => {
  const source = `<strong><em>${word}</em>${word}</strong>`
  assert.equal(proseInline(source), source)
  for (const tag of ["sup", "small"]) {
    assert.equal(proseInline(`<${tag}>${word}</${tag}>`), `&lt;${tag}&gt;${word}&lt;/${tag}&gt;`)
  }
})

test("nested Markdown works for italic, strong and combined whole-paragraph wrappers", () => {
  assert.equal(proseInline(`*${word} **${word}**${word}*`), `<em>${word} <strong>${word}</strong>${word}</em>`)
  assert.equal(proseInline(`**${word} *${word}*${word}**`), `<strong>${word} <em>${word}</em>${word}</strong>`)
  assert.equal(proseInline(`***${word}***`), `<em><strong>${word}</strong></em>`)
})

test("KaTeX annotation newlines and stars stay opaque to whole-paragraph emphasis", () => {
  const math = "$m|\\vec{g}|h +\n  \\vec{v}^{*}$\u3002"
  const prefix = "\u529b\u3002\n"
  const formula = inline(math)
  assert.ok(formula.includes('class="katex"'))
  assert.ok(formula.includes("m|\\vec{g}|h +\n  \\vec{v}^{*}"))
  assert.equal(proseInline(`*${prefix}${math}*`), `<em>\u529b\u3002<br>${formula}</em>`)
  assert.equal(proseInline(`**${prefix}${math}**`), `<strong>\u529b\u3002<br>${formula}</strong>`)
  assert.equal(inline(`*$a*b$*`), `<em>${inline("$a*b$")}</em>`)
})

test("unsafe HTML and arbitrary CSS are escaped, including their closing tags", () => {
  const openings = [
    '<span style="color: red;">',
    '<span style="text-emphasis-style: dot; text-emphasis-position: under; color: red;">',
    '<span style="text-emphasis-style: dot; text-emphasis-position: under;" onclick="alert(1)">',
    '<span style="text-emphasis-style: url(javascript:alert(1)); text-emphasis-position: under;">',
    '<em onclick="alert(1)">',
    '<strong class="anything">',
    '<script>',
    '<svg onload="alert(1)">',
  ]
  for (const opening of openings) {
    const name = opening.match(/^<(\w+)/)[1]
    assert.equal(
      proseInline(`${opening}${word}</${name}>`),
      opening.replaceAll("<", "&lt;").replaceAll(">", "&gt;") + word + `&lt;/${name}&gt;`,
      opening,
    )
  }
  assert.equal(proseInline('<img src="x" onerror="alert(1)">'), '&lt;img src="x" onerror="alert(1)"&gt;')
  assert.equal(proseInline("</span>"), "&lt;/span&gt;")
  assert.equal(proseInline(`<em>${word}`), `&lt;em&gt;${word}`)
  assert.equal(
    proseInline(`<span style="**arbitrary**">${word}</span>`),
    `&lt;span style="**arbitrary**"&gt;${word}&lt;/span&gt;`,
  )
})
