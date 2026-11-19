import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const out = path.dirname(new URL(import.meta.url).pathname)
const card = 'phy10-c2-s3-n87'
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'))
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
const bind = f => ({ path: path.relative(repo, f), sha256: sha(f) })
const save = (f, value) => {
  fs.mkdirSync(path.dirname(f), { recursive: true })
  fs.writeFileSync(f, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
  return bind(f)
}
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(sha(from), sha(to))
  return { input: bind(from), output: bind(to) }
}
const textReview = path.join(tmp, 'd873-n87-text-affected-review/report.json')
assert.equal(sha(textReview), '7d837a66d0084537b61d67ee735cda28bf71be526733cb773f468da298a02fd2')
assert.equal(read(textReview).status, 'AFFECTED-SCI-ZHEN-REVIEW-FROZEN-PASS')
const inputs = []
const outputs = []
const concepts = [1, 6, 11, 12, 14, 16, 17, 20, 21]
for (const locale of ['zh', 'en']) {
  const sourceRepo = path.join(out, locale, 'source')
  const base = path.join(sourceRepo, 'ssot-resources/soviet10year-textbooks/artifacts/10p')
  const target = path.join(base, 'editions/modern-us-neutral/lessons', card)
  inputs.push(copy(path.join(tmp, 'd836-source233-consume-n87-prepare/root/10p/book.json'), path.join(base, 'book.json')))
  for (const name of ['lesson', 'exercises'])
    inputs.push(copy(path.join(tmp, 'd858-n87-text-first-repair/candidate', locale, name + '.template.json'), path.join(target, name + '.json')))
  inputs.push(copy(path.join(tmp, 'd836-source233-consume-n87-prepare/work/adapt/10p/modern-us-neutral/lessons', card, 'figures.template.json'), path.join(target, 'figures.json')))
  const command = [
    '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.agents/skills/ld-s10y-choice/scripts/prepare.py', 'prepare',
    '--repo', sourceRepo, '--book', '10p', '--lesson', card,
    ...['1', '2', '3', '4', '5', '6'].flatMap(n => ['--exercise', n]),
    ...concepts.flatMap(n => ['--concept-block', String(n)]),
    '--out', path.join(sourceRepo, '.intentfold/tickets/STEMROBIN-181/tmp/seed.json'),
  ]
  const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
  const receipt = save(path.join(out, locale, 'prepare-FIRST.receipt.json'), {
    command, cwd: repo, exit: result.status, stdout: result.stdout, stderr: result.stderr,
  })
  assert.equal(result.status, 0, result.stdout + result.stderr)
  const seedFile = path.join(sourceRepo, '.intentfold/tickets/STEMROBIN-181/tmp/seed.json')
  const seed = read(seedFile)
  assert.equal(seed.exercises.length, 6)
  assert.equal(seed.figures.length, 0)
  outputs.push({ locale, sourceRepo, seed: bind(seedFile), receipt })
}
const report = save(path.join(out, 'report.json'), {
  ticket: 'STEMROBIN-181', card, status: 'FIRST-CHOICE-SEEDS-PREPARED-TEXT-ONLY-NOT-NATIVE-FINALIZED',
  textReview: bind(textReview), inputs, outputs, concepts,
  sourceTasks: ['1', '2', '3', '4', '5', '6'], selectedFigureIds: [],
  projection: 'Exact approved modern lesson/exercise templates plus actual original book and prepared figure manifest. Original draft schema/status retained; this projection is not native finalization or figure approval.',
  authorAllowedInputs: 'Only projected modern lesson/exercises, selected concepts and seed. No answers, independent solutions, old choice sets or interaction specifications supplied.',
  nativeFinalizationPending: true, figuresPendingSeparateReview: true,
  imagesOpened: 0, paidCalls: 0, newCompleteCards: 0,
})
console.log(JSON.stringify({ report, outputs }))
