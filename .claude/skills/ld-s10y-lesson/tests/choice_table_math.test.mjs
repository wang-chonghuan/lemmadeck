import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import test from 'node:test'
import { choiceHtml } from '../tools/choice_html.mjs'

const { inline } = createRequire(import.meta.url)('../tools/htmlfrag.js')
const annotations = (html) => [...html.matchAll(
  /<annotation encoding="application\/x-tex">([\s\S]*?)<\/annotation>/g,
)].map((match) => match[1])

test('length bars do not split formula-bearing table cells', () => {
  const text = '| Length | Segments |\n| --- | --- |\n'
    + '| $\\frac{2}{5}|OK|$ | $OC,MA,CB,AK$ |\n'
    + '| $\\frac{3}{5}|OK|$ | $OA,MB,CK$ |\n\n'
    + '$|CB|=\\frac{2}{5}|OK|$.'
  const html = choiceHtml(text)
  assert.equal((html.match(/<th>/g) || []).length, 2)
  assert.equal((html.match(/<td>/g) || []).length, 4)
  assert.deepEqual(annotations(html), [
    '\\frac{2}{5}|OK|', 'OC,MA,CB,AK',
    '\\frac{3}{5}|OK|', 'OA,MB,CK', '|CB|=\\frac{2}{5}|OK|',
  ])
  assert.ok(!html.includes('katex-error'))
  assert.ok(!html.includes('S10YMATH'))
})

test('display formulas and marker-like literal text survive table parsing', () => {
  const html = choiceHtml('S10YMATH0END\n\n| $$|AB|$$ | Value |\n'
    + '| --- | --- |\n| $$|CD|$$ | $2$ |')
  assert.ok(html.includes('S10YMATH0END'))
  assert.deepEqual(annotations(html), ['|AB|', '|CD|', '2'])
})

test('ordinary tables and text without tables keep their rendering', () => {
  assert.equal(choiceHtml('$|AB|$ and $2$.'), inline('$|AB|$ and $2$.'))
  const html = choiceHtml('| Label | Value |\n| --- | --- |\n| A | 2 |')
  assert.equal(html, '<table><thead><tr><th>Label</th><th>Value</th></tr></thead>'
    + '<tbody><tr><td>A</td><td>2</td></tr></tbody></table>')
})
