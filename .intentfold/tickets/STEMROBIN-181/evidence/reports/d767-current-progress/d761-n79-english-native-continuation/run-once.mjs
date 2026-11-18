import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const out = path.join(tmp, 'd761-n79-english-native-continuation')
const native = path.join(tmp, 'd756-n79-bilingual-native')
const card = 'phy10-c2-s2-n79'
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = (file) => ({ path: path.relative(repo, file), sha256: sha(file) })
const write = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const failedAudit = path.join(native, 'en/root/10p/editions/modern-us-neutral/lessons', card, 'adaptation.audit.json')
assert.equal(read(failedAudit).status, 'fail')
fs.mkdirSync(out, { recursive: true })
fs.copyFileSync(failedAudit, path.join(out, 'first-en-identity-fail.audit.json'), fs.constants.COPYFILE_EXCL)
const zhAudit = path.join(native, 'zh/root/10p/editions/modern-us-neutral/lessons', card, 'adaptation.audit.json')
assert.equal(read(zhAudit).status, 'pass')
const zhFiles = ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json'].map((name) =>
  bind(path.join(path.dirname(zhAudit), name)))
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
function run(name, command) {
  const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
  write(path.join(out, `${name}.receipt.json`), { command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr })
  assert.equal(result.status, 0, result.stdout + result.stderr)
}
run('six-focused-identity-tests', [
  python, '-B', '.claude/skills/ld-s10y-lesson/tests/test_english_edition_identity.py',
])
for (const verb of ['adapt-finalize', 'render']) {
  run(`en-${verb}`, [
    python, '-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', verb,
    '--book', '10p', '--edition', 'modern-us-neutral', '--lesson', card,
    '--root', path.join(native, 'en/root'), '--work', path.join(native, 'en/work'),
  ])
}
for (const item of zhFiles) assert.equal(sha(path.resolve(repo, item.path)), item.sha256)
const report = {
  ...read(path.join(native, 'started.json')),
  status: 'BILINGUAL-NATIVE-FINALIZE-RENDER-PASS-FIRST-DISPLAY-PENDING',
  firstEnglishFAIL: bind(path.join(out, 'first-en-identity-fail.audit.json')),
  originalFailedReceipt: bind(path.join(native, 'en-adapt-finalize.receipt.json')),
  cause: 'Native identity validator did not support already reviewed English title and exact Figure N label translation.',
  ordinaryToolRepair: {
    titleLocalizationRequiresEnglishLocale: true,
    printedTitleAndSourceSnapshotRemainImmutable: true,
    labelLocalizationPreservesExactFigureNumber: true,
    englishRendererUsesModernTitleAndEnglishNavigation: true,
    files: [
      bind(path.join(repo, '.claude/skills/ld-s10y-lesson/tools/edition.py')),
      bind(path.join(repo, '.claude/skills/ld-s10y-lesson/tools/render_lesson.js')),
      bind(path.join(repo, '.claude/skills/ld-s10y-lesson/tests/test_english_edition_identity.py')),
    ],
  },
  passedChineseNativeOrHTMLReplayed: false,
  figureRendererOrRecordReviewReplayed: false,
  outputs: [],
}
for (const locale of ['zh', 'en']) {
  const root = path.join(native, locale, 'root')
  const work = path.join(native, locale, 'work')
  const edition = path.join(root, '10p/editions/modern-us-neutral')
  const final = path.join(edition, 'lessons', card)
  assert.equal(read(path.join(final, 'adaptation.audit.json')).status, 'pass')
  assert.equal(read(path.join(final, 'exercises.json')).count, 0)
  report.outputs.push({
    locale, root, work,
    nativeFiles: ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json'].map((name) => bind(path.join(final, name))),
    html: ['text.html', 'exercises.html'].map((name) => bind(path.join(work, 'render/10p/modern-us-neutral', card, name))),
    figures: [184, 185, 186, 187].map((number) => ({
      id: `fig-${number}`,
      files: ['spec.json', 'svg', 'render.json', 'review.json'].map((suffix) => bind(path.join(edition, 'figures', `fig-${number}.${suffix}`))),
    })),
  })
}
write(path.join(out, 'report.json'), report)
console.log(JSON.stringify({ status: report.status, report: bind(path.join(out, 'report.json')), zhNativeReplayed: false }))
