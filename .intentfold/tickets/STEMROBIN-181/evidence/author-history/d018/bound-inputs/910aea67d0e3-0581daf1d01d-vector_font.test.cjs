const assert = require('node:assert/strict')
const test = require('node:test')
const { withVectorGlyphFont } = require('./htmlfrag.js')

test('unaffected figure markup remains byte-identical', () => {
  for (const svg of [
    '<svg><text data-label-id="force">F</text></svg>',
    '<svg><text>F\u20d7</text></svg>',
  ]) assert.equal(withVectorGlyphFont(svg), svg)
})

test('vector labels receive a scoped existing-font policy without altering labels or geometry', () => {
  const svg = '<svg viewBox="0 0 640 340"><path d="M0 0L10 10"/>'
    + '<text data-label-id="F12" x="20" y="40">F\u20d7\u2081\u2082</text></svg>'
  const output = withVectorGlyphFont(svg)
  assert.ok(output.startsWith('<svg viewBox="0 0 640 340" data-ld-vector-font="katex-main">'))
  assert.ok(output.includes('{font-family:KaTeX_Main,Arial,Helvetica,sans-serif}'))
  assert.ok(output.endsWith(svg.slice(svg.indexOf('<path'))))
  assert.equal(withVectorGlyphFont(output), output)
})

test('vector label markup without a valid SVG root fails explicitly', () => {
  assert.throws(() => withVectorGlyphFont('<text data-label-id="F">F\u20d7</text>'), /SVG root/)
})
