import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const output = path.join(tmp, 'g10-n46')
const root = path.join(output, 'artifacts')
const work = path.join(output, 'work')
const core = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts')
const lesson = 'geo910-c2-s1-n46'
const tool = path.join(repo, '.claude/skills/ld-s10y-lesson/tools/p2c.py')
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const save = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const sourceBindings = () => json(path.join(output,
  fs.existsSync(path.join(output, 'source-current-bindings.json'))
    ? 'source-current-bindings.json' : 'source-bindings.json'))
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(from), hash(to))
}
const action = process.argv[2]
if (action === 'seed') {
  const admissionPath = process.argv[3]
  const admission = json(admissionPath)
  assert.equal(admission.status, 'pass-for-readable-n46-source-only')
  assert.equal(admission.lesson, lesson)
  assert.equal(admission.localHoldsPreserved, true)
  assert.deepEqual(admission.pages.map(item => item.physical), [163, 164, 165, 166])
  for (const binding of admission.bindings) assert.equal(hash(binding.path), binding.sha256)
  assert.ok(!fs.existsSync(output))
  fs.mkdirSync(output)
  copy(admissionPath, path.join(output, 'source-admission.json'))
  const bindings = admission.bindings.map(item => ({ from: item.path, sha256: item.sha256 }))
  for (const page of admission.pages) {
    const relative = `9-10g/pages/${String(page.physical).padStart(4, '0')}`
    assert.deepEqual(json(path.join(page.artifactDirectory, 'audit.json')).errors, [])
    assert.equal(json(path.join(page.artifactDirectory, 'page.json')).meta.numbering_scope, 'g10')
    const files = [
      ...['page.md', 'page.json', 'audit.json'].map(name => ({
        from: path.join(page.artifactDirectory, name), to: path.join(root, relative, name),
      })),
      ...['page.png', 'layout.json'].map(name => ({
        from: path.join(page.workDirectory, name), to: path.join(work, relative, name),
      })),
      ...page.crops.map(binding => ({
        from: binding.path, to: path.join(work, relative, 'figures', path.basename(binding.path)),
      })),
    ]
    for (const file of files) {
      assert.ok(admission.bindings.some(item => item.path === file.from), file.from)
      copy(file.from, file.to)
      bindings.push({ ...file, sha256: hash(file.from) })
    }
  }
  save(path.join(output, 'source-bindings.json'), bindings)
  console.log(JSON.stringify({ action, bindings: bindings.length, chapterReviewApproved: false }))
} else if (action === 'apply-reviewed-identity-repair') {
  const admissionPath = process.argv[3]
  const admission = json(admissionPath)
  assert.equal(admission.status, 'pass-for-readable-n46-source-only')
  assert.equal(admission.lesson, lesson)
  assert.equal(admission.localHoldsPreserved, true)
  for (const binding of admission.bindings)
    assert.equal(hash(binding.path), binding.sha256, binding.path)
  const current = path.join(root, '9-10g/pages/0165')
  const replacement = admission.pages.find(page => page.physical === 165)
  assert.ok(replacement)
  const before = json(path.join(current, 'page.json'))
  const expected = structuredClone(before)
  assert.equal(expected.blocks[7].label, '36*')
  expected.blocks[7].label = '36'
  assert.deepEqual(json(path.join(replacement.artifactDirectory, 'page.json')), expected)
  assert.equal(fs.readFileSync(path.join(replacement.artifactDirectory, 'page.md'), 'utf8'),
    fs.readFileSync(path.join(current, 'page.md'), 'utf8')
      .replace('<!-- ex 36* -->', '<!-- ex 36 -->'))
  const receipt = path.join(output, 'apply-reviewed-identity-repair-01')
  assert.ok(!fs.existsSync(receipt))
  fs.mkdirSync(receipt)
  const bindings = [...json(path.join(output, 'source-bindings.json')),
    ...admission.bindings.map(item => ({ from: item.path, sha256: item.sha256 }))]
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const to = path.join(current, name)
    copy(to, path.join(receipt, 'before', name))
    const from = path.join(replacement.artifactDirectory, name)
    if (hash(from) !== hash(to)) {
      fs.copyFileSync(from, to)
      assert.equal(hash(from), hash(to))
    }
    bindings.push({ from, to, sha256: hash(from), role: 'reviewed-number36-identity' })
  }
  copy(admissionPath, path.join(output, 'source-current-admission.json'))
  save(path.join(output, 'source-current-bindings.json'), bindings)
  save(path.join(receipt, 'transition.json'), {
    status: 'pass', field: '/blocks/7/label', before: '36*', after: '36',
    sourceBodyChanged: false, printedStarRetained: true,
    originalAdmissionPreserved: true, originalFailedAssemblyPreserved: true,
    cumulativeRepairCounts: admission.cumulativeRepairCounts,
  })
  console.log(JSON.stringify({ action, changedField: '/blocks/7/label', sourceBodyChanged: false }))
} else if (action === 'import-source') {
  for (const binding of sourceBindings())
    assert.equal(hash(binding.from), binding.sha256)
  const firstAssembly = fs.existsSync(path.join(output, 'assemble-source-recovery-01/command.json'))
    ? 'assemble-source-recovery-01' : 'assemble-source-01'
  for (const stage of [firstAssembly, 'vectorize-source-01', 'assemble-source-02'])
    assert.equal(json(path.join(output, stage, 'command.json')).exitCode, 0)
  const index = json(path.join(root, '9-10g/book.json'))
  assert.deepEqual(index.audit.errors, [])
  assert.deepEqual(index.lessons.map(item => item.id), [lesson])
  assert.equal(index.lessons[0].exercises, 6)
  assert.equal(index.lessons[0].figures, 3)
  const files = [
    ...[163, 164, 165, 166].flatMap(page => ['page.md', 'page.json', 'audit.json']
      .map(name => `pages/${String(page).padStart(4, '0')}/${name}`)),
    ...['12', '13', '14'].flatMap(id => ['png', 'svg'].map(ext => `figures/fig-g10-${id}.${ext}`)),
    ...['lesson.md', 'lesson.json', 'exercises.json'].map(name => `lessons/${lesson}/${name}`),
  ]
  for (const file of files) {
    const from = path.join(root, '9-10g', file)
    const to = path.join(core, '9-10g', file)
    assert.ok(fs.existsSync(from))
    if (fs.existsSync(to)) assert.equal(hash(from), hash(to), `Different existing source: ${to}`)
  }
  const receipt = path.join(output, 'import-source-01')
  fs.mkdirSync(receipt)
  const bindings = files.map(file => {
    const from = path.join(root, '9-10g', file)
    const to = path.join(core, '9-10g', file)
    const reused = fs.existsSync(to)
    if (!reused) copy(from, to)
    return { from, to, sha256: hash(from), reused }
  })
  save(path.join(receipt, 'bindings.json'), bindings)
  console.log(JSON.stringify({ action, files: bindings.length, chapterReviewApproved: false }))
} else {
  for (const binding of sourceBindings())
    assert.equal(hash(binding.from), binding.sha256)
  const toc = path.join(repo, 'ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json')
  const common = ['--book', '9-10g', '--root', root, '--work', work]
  const actions = {
    'assemble-source-01': [path.join(tmp, 'assemble-n46.py')],
    'assemble-source-recovery-01': [path.join(tmp, 'assemble-n46.py')],
    'vectorize-source-01': [tool, 'vectorize', ...common],
    'assemble-source-02': [path.join(tmp, 'assemble-n46.py')],
    'adapt-prepare-isolated-01': [tool, 'adapt-prepare', ...common,
      '--edition', 'modern-us-neutral', '--lesson', lesson],
    'reindex-core-01': [tool, 'reindex', '--book', '9-10g', '--root', core, '--work', work, '--toc', toc],
    'adapt-finalize-n46-01': [tool, 'adapt-finalize', '--book', '9-10g', '--root', core,
      '--work', work, '--edition', 'modern-us-neutral', '--lesson', lesson],
    'render-n46-01': [tool, 'render', '--book', '9-10g', '--root', core,
      '--work', work, '--edition', 'modern-us-neutral', '--lesson', lesson],
  }
  assert.ok(actions[action], action)
  const receipt = path.join(output, action)
  assert.ok(!fs.existsSync(receipt))
  fs.mkdirSync(receipt)
  const run = spawnSync(python, actions[action], { cwd: repo, encoding: 'utf8' })
  save(path.join(receipt, 'command.json'), {
    cwd: repo, command: python, args: actions[action], exitCode: run.status,
    error: run.error?.message, offline: true, chapterReviewApproved: false, published: false,
  })
  fs.writeFileSync(path.join(receipt, 'stdout.txt'), run.stdout || '', { flag: 'wx' })
  fs.writeFileSync(path.join(receipt, 'stderr.txt'), run.stderr || '', { flag: 'wx' })
  console.log(run.stdout)
  if (run.stderr) console.error(run.stderr)
  process.exitCode = run.status ?? 1
}
