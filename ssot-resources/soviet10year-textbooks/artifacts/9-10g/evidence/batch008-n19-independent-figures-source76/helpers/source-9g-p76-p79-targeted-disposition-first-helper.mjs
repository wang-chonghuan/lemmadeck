import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const source = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g'
const root = `${ticket}/source-9g-p76-p79-targeted-disposition`
const sha = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const records = [76, 77, 78, 79].flatMap(number => {
  const page = String(number).padStart(4, '0')
  return ['page.md', 'page.json'].map(name => ({
    path: `${source}/pages/${page}/${name}`, sha256: sha(`${source}/pages/${page}/${name}`),
  }))
})
const protectedFiles = [`${source}/book.json`, '.claude/skills/ld-s10y-lesson/tools/layout.py',
  ...[76, 77, 78, 79].map(number => `.tmp/ld-s10y-lesson/9-10g/pages/${String(number).padStart(4, '0')}/page.png`)]

if (process.argv[2] === 'before') {
  assert(!fs.existsSync(root))
  fs.mkdirSync(root)
  fs.mkdirSync(`${root}/before`)
  for (const item of records) {
    const relative = item.path.slice(`${source}/pages/`.length)
    fs.mkdirSync(`${root}/before/${relative.split('/')[0]}`, { recursive: true })
    fs.copyFileSync(item.path, `${root}/before/${relative}`, fs.constants.COPYFILE_EXCL)
  }
  write(`${root}/before.json`, { records, protected: protectedFiles.map(path => ({ path, sha256: sha(path) })) })
  console.log(`Retained ${records.length} source files before targeted disposition; no finalize`)
} else {
  assert.equal(process.argv[2], 'after')
  const before = JSON.parse(fs.readFileSync(`${root}/before.json`))
  assert.deepEqual(protectedFiles.map(path => ({ path, sha256: sha(path) })), before.protected)
  for (const page of [76, 77, 78, 79]) {
    const id = String(page).padStart(4, '0')
    const file = `${source}/pages/${id}/page.md`
    const old = fs.readFileSync(`${root}/before/${id}/page.md`, 'utf8')
    const current = fs.readFileSync(file, 'utf8')
    const body = text => text.slice(text.indexOf('\n<!-- '))
    let expected = body(old)
    if (page === 76) {
      expected = expected.replace('$\\vec{c}↵=x\\vec{a}+y\\vec{b}$，和', '$\\vec{c}↵=x\\vec{a}+y\\vec{b}$. 和')
        .replace('\\overrightarrow{OA_4}-\\overrightarrow{OA_6}', '\\overrightarrow{OA_4}+\\overrightarrow{OA_6}')
    }
    if (page === 77) expected = expected.replace('是否共面：1)', '是否共面？1)')
    assert.equal(body(current), expected, `Unexpected source body change on ${page}`)
    assert.equal(sha(`${source}/pages/${id}/page.json`), before.records.find(item => item.path.endsWith(`${id}/page.json`)).sha256)
  }
  write(`${root}/disposition.json`, {
    status: 'SUPPORTED_SOURCE_SUBSET_APPLIED_RESIDUAL_HOLDS',
    records, protected: before.protected,
    changedBody: ['76 H1 plus before OA6', '76 H2 full stop before conjunction', '77 H3a question mark'],
    unchangedBodyPages: [78, 79],
    inventoryOnly: '76-79 additive uncertainty/provenance notes; no figure geometry or count exclusion changed',
    residual: ['77 H3b tiny speck intent', '77 H3c delimiter class', '78 H5 merged-head ownership', '79 H6 independent OS head'],
    firstFinalizeRuns: 0, affectedFinalizeRuns: 0, sourceBookWrites: 0,
    qualifier: 'page.json remains the historical author parse until an authorized finalize. No source/lesson gate or completion claimed.',
  })
  console.log('Three supported body corrections only; source pixels, book, counter and all page.json bytes unchanged')
}
