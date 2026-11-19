import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), R)
const own = path.dirname(new URL(import.meta.url).pathname)
const base = path.join(R, '.intentfold/tickets/STEMROBIN-181/tmp/d793-reviews-consume-source230')
const prepared = path.join(base, 'work/adapt/10p/modern-us-neutral/lessons/phy10-c2-s3-n86')
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const save = (file, data) => {
  assert(file.startsWith(`${own}/`))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
}
const preparation = read(path.join(base, 'n86-preparation.json'))
for (const name of ['frozenRequirements', 'rawLesson', 'rawExercises']) {
  assert.equal(sha(path.join(R, preparation[name].path)), preparation[name].sha256)
}
const lesson = read(path.join(prepared, 'lesson.template.json'))
const exercises = read(path.join(prepared, 'exercises.template.json'))
assert.deepEqual(lesson.source.data, read(path.join(R, preparation.rawLesson.path)))
assert.deepEqual(exercises.source.data, read(path.join(R, preparation.rawExercises.path)))
assert.equal(exercises.count, 0)
assert.deepEqual(exercises.exercises, [])
const input = read(path.join(own, 'author-input.json'))
const requirements = read(path.join(base, 'n86-preauthor-source-requirements.json'))
const inputFiles = [
  path.join(base, 'n86-preparation.json'),
  path.join(base, 'n86-preauthor-source-requirements.json'),
  path.join(R, preparation.rawLesson.path), path.join(R, preparation.rawExercises.path),
  path.join(prepared, 'lesson.template.json'), path.join(prepared, 'exercises.template.json'),
  path.join(R, 'AGENTS.md'), path.join(R, '.intentfold/readme.md'),
  path.join(R, '.intentfold/charter/product.md'),
  path.join(R, '.intentfold/charter/engineering.md'),
  path.join(R, '.intentfold/charter/operations.md'),
  path.join(R, '.claude/skills/ld-s10y-lesson/SKILL.md'),
  path.join(R, '.claude/skills/ld-s10y-lesson/references/production-resume.md'),
  path.join(R, '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md'),
  path.join(R, '.claude/skills/ld-s10y-lesson/tools/edition.py'),
  path.join(R, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'),
  path.join(R, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'),
  path.join(R, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'),
  '/Users/yong/.agents/skills/ips-content-design/SKILL.md',
  '/Users/yong/.agents/skills/ips-content-design/references/copy.md',
  path.join(own, 'author-input.json'),
  path.join(own, 'build-candidates.mjs'),
  path.join(own, 'native-text-once.py'),
  path.join(own, 'flow-and-freeze.mjs'),
]
save(path.join(own, 'inputs-before.json'), inputFiles.map(file => ({ path: file, sha256: sha(file) })))
const mappings = []
for (const locale of ['zh', 'en']) {
  const candidate = structuredClone(lesson)
  candidate.locale = locale
  for (const block of candidate.prose) {
    const key = block.source_refs[0]
    if (block.kind === 'p') {
      assert.equal(typeof input[locale][key], 'string')
      block.text = input[locale][key]
      block.changes = ['pedagogy', 'layout']
      if (locale === 'en') block.changes.unshift('translation')
    } else if (block.kind === 'cap' && locale === 'en') {
      block.text = 'Figure 200'
      block.changes = ['translation']
    }
    block.numeric_changes = []
    block.historical_entities = []
    mappings.push({
      locale, kind: block.kind, source_refs: block.source_refs,
      target: `candidate/${locale}/lesson.template.json`,
      sourceTextSha256: crypto.createHash('sha256').update(block.source_text).digest('hex'),
    })
  }
  save(path.join(own, `first/${locale}/lesson.template.json`), candidate)
  save(path.join(own, `candidate/${locale}/lesson.template.json`), candidate)
  save(path.join(own, `candidate/${locale}/exercises.template.json`), exercises)
}
save(path.join(own, 'source-mapping.json'), {
  card: lesson.id, sourceQuestions: 0, mappings,
  footnote: {
    source_ref: 'p0228#10',
    frozenSource: {
      path: path.join(base, 'n86-preauthor-source-requirements.json'),
      sha256: sha(path.join(base, 'n86-preauthor-source-requirements.json')),
    },
    lines: requirements.blocks.find(block => block.ref === 'p0228#10').lines,
    assemblyObservation: 'The frozen raw lesson/template does not contain this footnote object. No source_text/source_refs were amended. Its propagation-versus-reflection meaning is explained in the existing p0228#9 block without duplicating or introducing math tokens. Parent decides any raw-source follow-up.',
  },
  plateV: {
    source_ref: 'p0229#3', literal: '彩图 V',
    citationPreservedInBothLocales: true,
    physicalSourcePixels: 'PENDING-EXTERNAL',
    romanPlateOwnership: 'PENDING-EXTERNAL',
    spectralColorApproval: 'PENDING-EXTERNAL',
    inventedFigureId: false, imageOpenedOrCreated: false,
  },
  scientificAuthorNotes: [
    'Air-gap wavelength is approximately vacuum wavelength in the source calculation; the liquid-gap formula uses in-medium wavelength.',
    'Reflection phase is represented as equivalent path difference, not extra physical travel. Shrinking-ring statements retain the required reflection-phase condition.',
    'Source red/violet values are attributed to the book rather than asserted as exact modern color boundaries.',
    'The animal black-white claim is retained as a source claim and explicitly identified as an inaccurate generalization, without species examples or extra numerical data.',
    'Exact Chinese descriptive labels inside the red/violet math tokens remain unchanged in English by the strict token-conservation instruction.',
    'No declaration needs a cultural exception; historical_entities stays empty, with no invented aliases.',
  ],
  scope: 'Author provenance only, not independent SCI/ZHEN review or finalization.',
})
save(path.join(own, 'exploration-failures.json'), {
  cwd: R,
  failures: [
    {
      exitCode: 2, tool: 'rg',
      command: "rg -n 'child|儿童|孩子|阅读|normalize_prose_layout|math.*conserv|numeric' .claude/skills/ld-s10y-lesson/references .claude/skills/ld-s10y-lesson/tools/modern.py .intentfold/tickets/STEMROBIN-181/tmp/d793-reviews-consume-source230",
      stderr: 'rg: .claude/skills/ld-s10y-lesson/tools/modern.py: No such file or directory (os error 2)',
      repair: 'Read the discovered existing tools/edition.py; no file creation or native retry.',
    },
    {
      exitCode: 2, tool: 'rg',
      command: "rg -n 'reading|child|儿童|短句|易读|孩子|现代' .intentfold/tickets/STEMROBIN-181/ac.md .intentfold/tickets/STEMROBIN-181/draft.md .intentfold/tickets/STEMROBIN-181/ticket.json .claude/skills/ld-s10y-lesson/README.md .agents/skills/ld-s10y-image/references/*.md",
      stderr: 'rg: .intentfold/tickets/STEMROBIN-181/draft.md: No such file or directory (os error 2)\nrg: .claude/skills/ld-s10y-lesson/README.md: No such file or directory (os error 2)',
      repair: 'Read the existing plan, product child-reader contract, lesson skill and ips-content-design copy guidance.',
    },
    {
      exitCode: 1, tool: 'ls',
      command: 'ls -ld .intentfold/tickets/STEMROBIN-181/tmp/d798-n86-first-bilingual-text-author .claude/skills/ld-s10y-lesson/.venv/bin/python',
      stderr: 'ls: .intentfold/tickets/STEMROBIN-181/tmp/d798-n86-first-bilingual-text-author: No such file or directory',
      repair: 'New authorized output directory created by apply_patch; the existing Python runtime was found successfully.',
    },
  ],
  truncatedDiscovery: [
    'Two broad successful rg discovery calls returned oversized, truncated results; subsequent reads were narrowed to exact relevant paths. These were not native/content checks.',
  ],
})
console.log(JSON.stringify({ status: 'FIRST-CANDIDATES-WRITTEN', sourceQuestions: 0, images: 0, paid: 0 }))
