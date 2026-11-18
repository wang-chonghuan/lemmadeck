import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const prior = path.join(tmp, 'd703-n80-first-bilingual-text-author')
const out = path.join(tmp, 'd725-n80-readability-repair')
const card = 'phy10-c2-s2-n80'
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const replacements = {
  zh: {
    10: [
      ['代入说明中的符号衔接仍需核定，不能把未定义的符号当作已经说明的新角度，也不能悄悄替换它。',
        '这里还不能确定那个未定义的符号指哪个角，所以先读懂上面的计算，不把它当作另一种已经说明的角。'],
    ],
  },
  en: {
    2: [
      ['It compares the angles spread across at the eye, so the unaided viewing distance must also be specified for the comparison to be meaningful.',
        'It compares the angle between the directions from the eye to the object\'s edges with and without the instrument, so the unaided viewing distance must also be specified.'],
    ],
    8: [
      ['This describes the angle spread across at the eye, not perfect agreement between every real lens and the thin-lens model.',
        'The formula gives an approximate angle at the eye; it does not describe every real lens exactly.'],
    ],
    10: [
      ['The symbol linkage in the substitution instruction still needs adjudication, rather than treating an undefined symbol as an established new angle or silently replacing it.',
        'Because the second symbol is not defined here, we cannot yet tell which angle it means, but we can follow the calculation above without treating it as another already explained angle.'],
    ],
  },
}
const report = {
  ticket: 'STEMROBIN-181', card,
  status: 'TWO-READABILITY-FINDINGS-REPAIRED-NATIVE-PENDING',
  replacements, native: [], candidates: [],
  firstFAILPreserved: true, task2DATAHOLDPreserved: true,
  phi2MeaningResolved: false, errataRegistered: false,
  imagesOpened: 0, canonicalWrites: false, databaseWrites: false,
}
fs.writeFileSync(path.join(out, 'started.json'), JSON.stringify({ startedAt: new Date().toISOString() }), { flag: 'wx' })
function call(name, executable, args, input) {
  const result = spawnSync(executable, args, { cwd: repo, input, encoding: 'utf8', timeout: 120000 })
  const receipt = path.join(out, `${name}.receipt.json`)
  fs.writeFileSync(receipt, `${JSON.stringify({ executable, args, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }, null, 2)}\n`, { flag: 'wx' })
  report.native.push({ name, path: path.relative(repo, receipt), sha256: sha(receipt), exitCode: result.status })
  assert.equal(result.status, 0, result.stdout + result.stderr)
  return JSON.parse(result.stdout)
}
for (const locale of ['zh', 'en']) {
  const folder = path.join(out, 'candidates', locale, card)
  fs.mkdirSync(folder, { recursive: true })
  const original = path.join(prior, 'candidates', locale, card, 'lesson.template.json')
  const document = read(original)
  const originalAnchors = document.section_breaks
  const oldFlow = read(path.join(prior, 'reports', `prose-flow-${locale}.stdout.json`))
  const changes = Object.entries(replacements[locale]).map(([index, pairs]) => {
    const block = document.prose[Number(index)]
    let text = block.text
    for (const [before, after] of pairs) {
      assert.equal(text.split(before).length, 2, before)
      text = text.replace(before, after)
    }
    return { key: `prose/${index}`, sentences: text.split('\n').filter(Boolean), source_text: block.source_text }
  })
  const normalized = call(`normalize-${locale}`,
    path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python'),
    ['-B', path.join(prior, 'normalize-text.py')],
    JSON.stringify({ prose: changes, exercises: [] }))
  for (const block of normalized.prose) document.prose[Number(block.key.split('/')[1])].text = block.text
  document.section_breaks = []
  const flow = call(`prose-flow-${locale}`, process.execPath,
    [path.join(repo, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'), '--stdin'],
    JSON.stringify(document))
  document.section_breaks = originalAnchors.map((anchor) => {
    const oldAfter = oldFlow.paragraphs.find((paragraph) => paragraph.text === anchor.after)
    assert.ok(oldAfter)
    const current = flow.paragraphs.find((paragraph) =>
      paragraph.blockIndex === oldAfter.blockIndex && paragraph.paragraphInBlock === oldAfter.paragraphInBlock)
    assert.ok(current && current.index > 0)
    return { before: flow.paragraphs[current.index - 1].text, after: current.text }
  })
  const file = path.join(folder, 'lesson.template.json')
  fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`, { flag: 'wx' })
  report.candidates.push({ locale, path: path.relative(repo, file), sha256: sha(file), original: { path: path.relative(repo, original), sha256: sha(original) } })
  fs.writeFileSync(path.join(out, `${locale}-tool-outline.json`), `${JSON.stringify(flow, null, 2)}\n`, { flag: 'wx' })
  for (const name of ['exercises.template.json', 'figures.template.json']) {
    fs.copyFileSync(path.join(prior, 'candidates', locale, card, name), path.join(folder, name), fs.constants.COPYFILE_EXCL)
  }
}
report.status = 'TWO-READABILITY-FINDINGS-REPAIRED-NATIVE-PASS-AFFECTED-REVIEW-PENDING'
fs.writeFileSync(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ status: report.status, candidates: report.candidates, native: report.native }))
