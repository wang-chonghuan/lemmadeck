import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const out = path.dirname(fileURLToPath(import.meta.url))
const page = 179
const p = path.join(out, 'source/10p/pages/0179/page.md')
const content = fs.readFileSync(p, 'utf8')
const end = content.indexOf('\n---', 4)
const meta = JSON.parse(content.slice(4, end))
const body = content.slice(end + 4)
const blocks = [...body.matchAll(/<!-- ([^>]+) -->\n([\s\S]*?)(?=\n<!-- |$)/g)]
for (const note of meta.notes) {
  if (!note.ranges) continue
  const blockIndex = Number(note.block.split('#')[1]) - 1
  const lines = blocks[blockIndex][2].trim().split('\n')
  for (const range of note.ranges) {
    const line = lines[range.line - 1]
    const start = line.indexOf(range.text)
    assert(start >= 0, `${note.block} ${range.text}`)
    assert.equal(line.indexOf(range.text, start + 1), -1)
    range.character_range_1based_inclusive = [start + 1, start + range.text.length]
  }
}
fs.writeFileSync(p, `---\n${JSON.stringify(meta, null, 2)}\n---${body}`)
console.log(JSON.stringify({ page, blocks: blocks.length, resolvedRanges: meta.notes.filter(n => n.ranges).flatMap(n => n.ranges) }, null, 2))
