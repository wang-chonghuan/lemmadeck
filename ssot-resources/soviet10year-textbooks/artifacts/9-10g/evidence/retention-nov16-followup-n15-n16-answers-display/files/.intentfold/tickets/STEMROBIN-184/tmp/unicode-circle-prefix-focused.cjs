const fs = require('node:fs')
const vm = require('node:vm')
const assert = require('node:assert/strict')

const source = fs.readFileSync('.claude/skills/ld-s10y-lesson/tools/render_lesson.js', 'utf8')
const start = source.indexOf('    const sourceNumber = printedNumber == null')
const end = source.indexOf('    out += `<li class="ex" id="ex-', start)
assert(start >= 0 && end > start)
const evaluate = vm.compileFunction(`${source.slice(start, end)}\nreturn {numberLabel, text};`,
  ['e', 'printedNumber', 'esc', 'inline'])
const body = 'Body $x+1$.'
const cases = [
  [159, `159\u00b0. ${body}`, '$159^{\\circ}$.', body],
  [164, `164\u00b0\uFF0E ${body}`, '$164^{\\circ}$.', body],
  [165, `165\u00b0\u3002 ${body}`, '$165^{\\circ}$.', body],
  [169, `169\u00b0 ${body}`, '$169^{\\circ}$.', body],
  [159, ` \t159\u00b0.\n${body}`, '$159^{\\circ}$.', body],
  [159, `160\u00b0. ${body}`, '159.', `160\u00b0. ${body}`],
  [null, `159\u00b0. ${body}`, '', `159\u00b0. ${body}`],
  [159, `159. ${body}`, '159.', body],
  [159, `159* ${body}`, '159.*', body],
  [159, `$159^{\\circ}$. ${body}`, '$159^{\\circ}$.', body],
  [159, `159$^{\\bullet}$. ${body}`, '$159^{\\bullet}$.', body],
  [159, `159.5\u00b0 ${body}`, '159.', `5\u00b0 ${body}`],
]
for (const [number, text, label, remainder] of cases) {
  const actual = evaluate({ text }, number, value => value, value => value)
  assert.deepEqual(actual, { numberLabel: label, text: remainder })
}
console.log(`PASS ${cases.length} source-prefix fixtures; Unicode-circle punctuation, exact identity, existing plain/star/LaTeX behavior`)
