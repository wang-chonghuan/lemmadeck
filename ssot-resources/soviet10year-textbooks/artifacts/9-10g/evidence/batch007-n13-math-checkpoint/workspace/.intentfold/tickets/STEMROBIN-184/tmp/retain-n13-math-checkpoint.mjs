import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const book = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g'
const root = `${book}/evidence/batch007-n13-math-checkpoint`
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bindings = [
  [`${ticket}/geo910-n13-independent-math-source-first.md`, 'cd4df1c7f74187ecda75c9c4bbff0cb1b10cbb30decf0689d21d084556570877'],
  [`${ticket}/geo910-n13-author-source-solve.md`, '1692e5fd133c52a6f63d6f6c628f8a41862268e3426bacfe85c8c30ac96e9f19'],
  [`${ticket}/geo910-n13-independent-math-comparison.md`, '3e450745c518535380be9c16b9759e78439624663af3a550a00bf3059c5f5312'],
  [`${book}/lessons/geo910-c1-s1-n13/lesson.json`, 'ddc8569269972b1fc0966b8f4e4fcd00af3aea957e3a3e924ee771df919ca581'],
  [`${book}/lessons/geo910-c1-s1-n13/lesson.md`, 'b7729e8e23c5fcfeab89469d2e950cc16e89b81a042535949abc6a9e30181e22'],
  [`${book}/lessons/geo910-c1-s1-n13/exercises.json`, 'ad5ca0568108c9c13e2a08c8f13036fc649eaf95e4e23695fc4552bc28b38cb7'],
]
assert(!fs.existsSync(root), 'Keep the original checkpoint')
for (const [file, expected] of bindings) assert.equal(hash(file), expected)
const files = [
  ...bindings.map(([file]) => file),
  `${ticket}/geo910-n13-figure-author-source-inventory.md`,
  `${ticket}/retain-n13-math-checkpoint.mjs`,
  `${book}/lessons/geo910-c1-s1-n12/lesson.md`,
  `${book}/lessons/geo910-c1-s1-n9/lesson.md`,
  ...[24, ...Array.from({ length: 12 }, (_, index) => index + 42)]
    .map(number => `${book}/figures/fig-${number}.png`),
]
for (const file of files) assert(fs.statSync(file).isFile(), file)
const copied = []
for (const file of files) {
  const to = path.join(root, 'workspace', file)
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(file, to, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(file), hash(to))
  copied.push({ path: path.relative(root, to), sha256: hash(to) })
}
fs.writeFileSync(`${root}/retention.json`, JSON.stringify({
  status: 'Sole independent StageA/B and author mathematics retained; whole lesson BLOCKED',
  copied,
  passedScope: 'Complete author comparison: 43 objects covered; 107-117 and120 all requests pass within nondegenerate/source-role scope;118(1) and original maximum edge4 pass.',
  unresolved: [
    '118(2) literal square/a object remains unclear; both lengths2 force edge4, no arbitrary parameter answer or entity substitution approved.',
    '119 original cube+3:2:1 has no nondegenerate model. Two conditional correction branches are not original solutions or approved errata.',
    'Hexagon original center O/O1 and first rhombus/first image names remain mathematical defects, not corrected source text.',
  ],
  figureScope: '12 owned source PNGs42-53; fig24 is an actual body backreference, not a new owned/task figure. Source-only author inventory is not independent modern figure approval.',
  limits: 'No new source/math/figure gate, erratum registration, modern text/spec/render/finalize, formal answer, choice, complete count or production action.',
}, null, 2) + '\n')
console.log(`${copied.length} n13 original/math evidence files retained byte-identically`)
