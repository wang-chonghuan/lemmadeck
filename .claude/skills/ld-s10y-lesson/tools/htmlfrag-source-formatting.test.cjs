const assert = require("node:assert/strict")
const { test } = require("node:test")
const { inline, proseInline, proseParagraphs, proseFlow } = require("./htmlfrag.js")

test("safe source title and under-dot styles render without a required final semicolon", () => {
  assert.equal(inline("<strong>Title</strong>"), "<strong>Title</strong>")
  for (const suffix of ["", ";"]) {
    assert.equal(
      inline(`<span style="text-emphasis:filled dot;text-emphasis-position:under${suffix}">word</span>`),
      '<span style="text-emphasis: filled dot; text-emphasis-position: under;">word</span>',
    )
  }
  assert.equal(inline("<strong><em>term</em></strong>"), "<strong><em>term</em></strong>")
})

test("reference attaches to its sentence and numeric entities stay text-safe", () => {
  assert.deepEqual(proseParagraphs("Sentence.\n\n<sup>&#9312;\n</sup>"),
    ["Sentence.<sup>&#9312;</sup>"])
  assert.equal(inline("<sup>&#9312;</sup>"), `<sup>${String.fromCodePoint(9312)}</sup>`)
  assert.equal(inline("&#60;script&#62;"), "&lt;script&gt;")
  assert.equal(inline("&#x3c;script&#x3e;"), "&lt;script&gt;")
  assert.equal(inline("&#1114112;"), "&amp;#1114112;")
})

test("whole footnote stays small across paragraphs, closes its quotation, and inherits the rule", () => {
  const quote = String.fromCodePoint(0x201d)
  const body = `<small>&#9312;\nQuote.\n\nEnd.\n${quote}\nCorrection.\n\nConclusion.\n\n</small>`
  const paragraphs = proseParagraphs(body)
  assert.deepEqual(paragraphs, [
    "<small>&#9312; Quote.</small>",
    `<small>End.${quote}\nCorrection.</small>`,
    "<small>Conclusion.</small>",
  ])
  const flow = proseFlow([
    { kind: "p", text: "Main text." },
    { kind: "p", label: "source-footnote-rule", text: "---" },
    { kind: "p", label: "source-footnote-1", text: body },
  ])
  assert.equal(flow.length, 4)
  assert.equal(flow[1].sectionBreak, true)
  assert.equal(flow[2].sectionBreak, undefined)
  for (const item of flow.slice(1)) {
    assert.match(proseInline(item.text), /^<small>[\s\S]+<\/small>$/)
    assert.doesNotMatch(proseInline(item.text), /&lt;|&amp;#/)
  }
  assert.deepEqual(proseFlow([{ kind: "p", text: "---" }]), [{ kind: "p", text: "---" }])
})

test("unsafe attributes, unknown tags and unmatched wrappers remain escaped", () => {
  for (const text of [
    '<small onclick="alert(1)">note</small>',
    '<span style="text-emphasis:filled dot;text-emphasis-position:under;color:red">word</span>',
    '<sup onclick="alert(1)">1</sup>',
    "<script>alert(1)</script>",
    "<small>unclosed",
    "<strong><em>crossed</strong></em>",
  ]) assert.match(inline(text), /&lt;/)
  assert.equal(inline("**bold** and *italic*"), "<strong>bold</strong> and <em>italic</em>")
  assert.match(inline("$1+2$;"), /^<span class="sr-nb">.*;<\/span>$/)
})
