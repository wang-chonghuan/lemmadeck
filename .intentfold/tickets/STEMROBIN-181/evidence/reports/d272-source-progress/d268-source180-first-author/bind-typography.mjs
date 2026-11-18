import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const out = path.dirname(fileURLToPath(import.meta.url))
const mdPath = path.join(out, 'source/10p/pages/0180/page.md')
const md = fs.readFileSync(mdPath, 'utf8')
const end = md.indexOf('\n---', 4)
const meta = JSON.parse(md.slice(4, end))
const body = md.slice(end + 5)
const blocks = [...body.matchAll(/<!-- ([^>]+) -->\n([\s\S]*?)(?=\n<!-- |$)/g)]
  .map(m => ({ header: m[1], lines: m[2].trimEnd().split('\n') }))
assert.equal(blocks.length, 10)
assert.equal(blocks.reduce((n, b) => n + b.lines.length, 0), 27)
for (const note of meta.notes) {
  if (!['bold', 'italic'].includes(note.type)) continue
  assert(!note.character_range_1based_inclusive, 'Bind once before native')
  const index = Number(note.block.split('#')[1]) - 1
  const line = blocks[index].lines[note.line_range[0] - 1]
  const start = line.indexOf(note.text)
  assert(start >= 0)
  assert.equal(line.indexOf(note.text, start + 1), -1)
  note.character_range_1based_inclusive = [start + 1, start + note.text.length]
  assert.equal(line.slice(start, start + note.text.length), note.text)
}
const spans = []
for (const index of [3, 4, 7]) {
  for (const [lineIndex, line] of blocks[index].lines.entries()) {
    for (const match of line.matchAll(/\$([^$]+)\$/g)) {
      const expression = match[1]
      spans.push({
        block: `p0180#${index + 1}`, line: lineIndex + 1,
        text: expression,
        character_range_1based_inclusive: [match.index + 2, match.index + 1 + expression.length],
        encoding: 'LaTeX inline math; variables italic, subscripts preserved, numerals/operators not bolded',
      })
    }
  }
}
meta.notes.find(n => n.type === 'math-typography').ranges = spans
fs.writeFileSync(mdPath, `---\n${JSON.stringify(meta, null, 2)}\n---${body}`)
console.log(JSON.stringify({
  bodyLines: 27,
  boundRanges: meta.notes.filter(n => ['bold', 'italic'].includes(n.type)),
  mathSpans: spans,
}, null, 2))
