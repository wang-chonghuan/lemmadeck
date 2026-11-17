import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const root = path.resolve('.intentfold/tickets/STEMROBIN-184/tmp/production-counter-offset-rule-repair')
const tools = path.resolve('.claude/skills/ld-s10y-lesson/tools')
const python = path.resolve('.claude/skills/ld-s10y-lesson/.venv/bin/python')
const preserved = path.resolve('.intentfold/tickets/STEMROBIN-184/tmp/production-counter110-121')
const parent = path.resolve('.intentfold/tickets/STEMROBIN-184/tmp/production-counter-detached-fraction')
const protectedFiles = [
  `${preserved}/layout.after.py`,
  `${preserved}/test_layout_carrier_rows.after.py`,
  ...['command.json', 'stdout.txt', 'stderr.txt'].map(name => `${preserved}/commands/focused-final/${name}`),
  `${parent}/run.mjs`,
  ...['layout.py', 'test_layout_carrier_rows.py', 'command.json', 'stdout.txt', 'stderr.txt']
    .map(name => `${parent}/first-affected-check/${name}`),
  `${tools}/test_layout_carrier_rows.py`,
]
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const writeJson = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const copy = (source, destination) => fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL)
const hashList = files => files.map(file => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size }))

function command(name, executable, args, cwd = process.cwd()) {
  const output = `${root}/commands/${name}`
  assert(!fs.existsSync(output), `Refuse to overwrite ${output}`)
  fs.mkdirSync(output, { recursive: true })
  const started = new Date().toISOString()
  const result = spawnSync(executable, args, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  writeJson(`${output}/command.json`, {
    command: [executable, ...args], cwd,
    env: { PYTHONDONTWRITEBYTECODE: '1' }, started,
    finished: new Date().toISOString(), exitCode: result.status,
    signal: result.signal, error: result.error?.message ?? null,
  })
  fs.writeFileSync(`${output}/stdout.txt`, result.stdout ?? '', { flag: 'wx' })
  fs.writeFileSync(`${output}/stderr.txt`, result.stderr ?? '', { flag: 'wx' })
  process.stdout.write(`${name}: exit ${result.status}\n${result.stdout ?? ''}`)
  process.stderr.write(result.stderr ?? '')
  return result
}

const offsetArgs = ['-B', '-v', 'CarrierRows.test_offset_rule_between_text_rows_is_not_a_fraction']
const mode = process.argv[2]
if (mode === 'diagnose-before') {
  assert(!fs.existsSync(`${root}/before`), 'Preserve first invocation')
  fs.mkdirSync(`${root}/before`)
  fs.mkdirSync(`${root}/baseline`)
  copy(`${tools}/layout.py`, `${root}/before/layout.py`)
  copy(`${tools}/test_layout_carrier_rows.py`, `${root}/before/test_layout_carrier_rows.py`)
  copy(`${preserved}/layout.after.py`, `${root}/baseline/layout.py`)
  copy(`${tools}/test_layout_carrier_rows.py`, `${root}/baseline/test_layout_carrier_rows.py`)
  writeJson(`${root}/before-hashes.json`, {
    owned: hashList([`${tools}/layout.py`, `${tools}/test_layout_carrier_rows.py`]),
    protected: hashList(protectedFiles),
  })
  for (const version of ['baseline', 'before']) {
    command(`${version}-offset-only`, python, [
      '-B', `${root}/${version}/test_layout_carrier_rows.py`, ...offsetArgs.slice(1),
    ])
    command(`${version}-synthetic-diagnosis`, python, [
      '-B', `${root}/diagnose.py`, `${root}/${version}/layout.py`,
    ])
  }
} else if (mode === 'verify') {
  const newTests = `${tools}/test_layout_offset_rules.py`
  assert(!fs.existsSync(`${root}/after`), 'Preserve first verification')
  fs.mkdirSync(`${root}/after`)
  copy(`${tools}/layout.py`, `${root}/after/layout.py`)
  copy(`${tools}/test_layout_carrier_rows.py`, `${root}/after/test_layout_carrier_rows.py`)
  copy(newTests, `${root}/after/test_layout_offset_rules.py`)
  const results = [
    command('after-offset-and-new-guards', python, [
      '-B', '-m', 'unittest', '-v',
      'test_layout_carrier_rows.CarrierRows.test_offset_rule_between_text_rows_is_not_a_fraction',
      'test_layout_offset_rules',
    ], tools),
    command('after-synthetic-diagnosis', python, ['-B', `${root}/diagnose.py`, `${tools}/layout.py`]),
    command('owned-diff-check', 'git', ['diff', '--check', '--', `${tools}/layout.py`, newTests]),
    command('repair-diff', 'diff', ['-u', `${root}/before/layout.py`, `${tools}/layout.py`]),
    command('preserved-baseline-diff', 'diff', ['-u', `${preserved}/layout.after.py`, `${tools}/layout.py`]),
  ]
  const before = JSON.parse(fs.readFileSync(`${root}/before-hashes.json`, 'utf8'))
  const protectedAfter = hashList(protectedFiles)
  const unchanged = before.protected.every((item, index) => item.sha256 === protectedAfter[index].sha256)
  writeJson(`${root}/after-hashes.json`, {
    owned: hashList([`${tools}/layout.py`, newTests, `${tools}/test_layout_carrier_rows.py`]),
    protected: protectedAfter, protectedUnchanged: unchanged,
  })
  assert(unchanged, 'A protected input changed')
  assert(results.slice(0, 3).every(result => result.status === 0), 'Verification failed; preserve full command records')
} else if (mode === 'evidence') {
  const result = command('new-additive-tests-diff', 'diff', ['-u', '/dev/null', `${tools}/test_layout_offset_rules.py`])
  assert(result.status === 1, 'Expected an additive test diff')
  const before = JSON.parse(fs.readFileSync(`${root}/before-hashes.json`, 'utf8'))
  const after = JSON.parse(fs.readFileSync(`${root}/after-hashes.json`, 'utf8'))
  for (const item of [...before.protected, ...after.owned]) {
    assert.equal(hash(item.path), item.sha256, `Input drift: ${item.path}`)
  }
  function filesUnder(directory) {
    return fs.readdirSync(directory, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name))
      .flatMap(entry => entry.isDirectory()
        ? filesUnder(path.join(directory, entry.name))
        : [path.join(directory, entry.name)])
  }
  writeJson(`${root}/evidence-index.json`, {
    protectedUnchanged: true, verifiedOwnedUnchanged: true,
    files: hashList([...after.owned.map(item => item.path), ...filesUnder(root)]),
  })
} else {
  throw new Error('Use diagnose-before, verify, or evidence')
}
