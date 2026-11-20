import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

export const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
export const owned = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n44-fig0809-author')
export const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
export const write = (p, data) => {
  if (!path.resolve(p).startsWith(`${owned}/`)) throw new Error(`Out-of-scope write: ${p}`)
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
}
export const receipt = (p, data) => {
  fs.appendFileSync(p, `${JSON.stringify(data)}\n`)
}
const [action, ...args] = process.argv.slice(2)
if (action === 'prepare') {
  const input = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/g10-n44/work/adapt/9-10g/modern-us-neutral/lessons/geo910-c2-s1-n44')
  const lesson = path.join(owned, 'context-root/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s1-n44')
  const inputs = []
  for (const name of ['lesson', 'exercises']) {
    const source = path.join(input, `${name}.template.json`)
    const target = path.join(lesson, `${name}.json`)
    fs.mkdirSync(lesson, { recursive: true })
    fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL)
    inputs.push({ source, sha256: sha(source), snapshot: target, snapshotSha256: sha(target) })
  }
  const figures = path.join(owned, 'context-root/9-10g/figures')
  fs.mkdirSync(figures, { recursive: true })
  for (const id of ['fig-g10-08', 'fig-g10-09']) {
    const source = path.join(repo, `ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/${id}.png`)
    const target = path.join(figures, `${id}.png`)
    fs.symlinkSync(source, target)
    inputs.push({ source, sha256: sha(source), symlink: target })
  }
  const manifest = path.join(input, 'figures.template.json')
  inputs.push({ source: manifest, sha256: sha(manifest), usage: 'Binding only; no old SVG opened' })
  write(path.join(owned, 'inputs.json'), inputs)
  write(path.join(owned, 'scope.json'), {
    ticket: 'STEMROBIN-188', assignment: 'SAME188-6', role: 'OFFLINE modern figure AUTHOR ONLY',
    figures: ['fig-g10-08', 'fig-g10-09'], writesOnly: owned,
    independentReview: false, promotion: false, contentRepairBudgetPerFigure: 1,
    imagePlan: ['original08', 'original09', 'first480-08', 'first480-09', 'first300-composition'],
    batchLimit: 8, contextLimit: 24,
    prerequisites: 'Human-reported source157-159 review PASS closed, isolated N44 only7ex4fig PASS, sourcevectorize PASS; not modern approval'
  })
} else if (action === 'image') {
  const [file, status, purpose] = args
  receipt(path.join(owned, 'actual-image-ledger.jsonl'), {
    index: fs.existsSync(path.join(owned, 'actual-image-ledger.jsonl'))
      ? fs.readFileSync(path.join(owned, 'actual-image-ledger.jsonl'), 'utf8').trim().split('\n').length + 1 : 1,
    path: path.resolve(file), sha256: fs.existsSync(file) ? sha(file) : null,
    status, purpose, tool: 'functions.view_image', timestamp: new Date().toISOString()
  })
} else if (action === 'run') {
  const [name, executable, ...commandArgs] = args
  const result = spawnSync(executable, commandArgs, { cwd: repo, encoding: 'utf8' })
  write(path.join(owned, 'commands', `${name}.json`), {
    command: [executable, ...commandArgs], cwd: repo, exit: result.status,
    signal: result.signal, stdout: result.stdout, stderr: result.stderr,
    error: result.error?.message ?? null, timestamp: new Date().toISOString()
  })
  console.log(result.stdout)
  if (result.stderr) console.error(result.stderr)
  process.exitCode = result.status ?? 1
}
