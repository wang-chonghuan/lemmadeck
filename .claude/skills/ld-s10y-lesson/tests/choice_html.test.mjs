import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { choiceHtml } from '../tools/choice_html.mjs'

const { inline } = createRequire(import.meta.url)('../tools/htmlfrag.js')

test('non-table math and inequalities keep the existing inline rendering', () => {
  const text = '当 $x<0$ 时，$|x|-x=-2x$；结果是 **正数**。'
  assert.equal(choiceHtml(text), inline(text))
})

test('complete tables preserve every row and cell with rendered mathematics', () => {
  const html = choiceHtml('$y=2x$\n\n| $x$ | -2 | 0 | 3 |\n|---|---|---|---|\n| $y$ | -4 | 0 | $6$ |')
  assert.equal((html.match(/<th>/g) ?? []).length, 4)
  assert.equal((html.match(/<td>/g) ?? []).length, 4)
  assert(html.includes('<thead>') && html.includes('<tbody>'))
  assert(html.includes('katex') && html.includes('>-4</td>') && html.includes('>3</th>'))
  assert(!html.includes('|---|'))
})

test('table cells are escaped rather than interpreted as arbitrary HTML', () => {
  const html = choiceHtml('| label | value |\n|---|---|\n| <script>alert(1)</script> | 2 |')
  assert(!html.includes('<script>'))
  assert(html.includes('&lt;script&gt;'))
})

test('two tables retain their order and intervening mathematical text', () => {
  const html = choiceHtml('| $a$ | 1 |\n|---|---|\n| $b$ | 2 |\n\n$b=2a$\n\n| $u$ | 3 |\n|---|---|\n| $v$ | 6 |')
  assert.equal((html.match(/<table>/g) ?? []).length, 2)
  assert(html.indexOf('>2</td>') < html.indexOf('>6</td>'))
})
