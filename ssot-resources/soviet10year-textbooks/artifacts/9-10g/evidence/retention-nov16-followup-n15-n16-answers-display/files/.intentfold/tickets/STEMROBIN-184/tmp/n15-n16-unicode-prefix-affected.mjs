import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const T = '.intentfold/tickets/STEMROBIN-184/tmp'
const root = `${T}/n15-n16-unicode-prefix-repair`
const ids = ['geo910-c1-s2-n15', 'geo910-c1-s2-n16']
const render = id => `.tmp/ld-s10y-lesson/render/9-10g/modern-us-neutral/${id}`
const edition = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const record = file => ({ path: file, sha256: hash(file) })
const dump = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', { flag: 'wx' })
const [stage] = process.argv.slice(2)
if (stage === 'freeze') {
  assert(!fs.existsSync(root))
  fs.mkdirSync(root, { recursive: true })
  const protectedFiles = ids.flatMap(id => ['lesson.json', 'exercises.json', 'figures.json', 'audit.json']
    .map(name => `${edition}/lessons/${id}/${name}`)).filter(file => fs.existsSync(file)).map(record)
  for (const id of ids) {
    fs.mkdirSync(`${root}/${id}`, { recursive: true })
    for (const name of ['text.html', 'exercises.html']) {
      fs.copyFileSync(`${render(id)}/${name}`, `${root}/${id}/${name}`)
    }
    fs.cpSync(`${T}/offline/${id}`, `${root}/${id}/offline`, { recursive: true })
  }
  fs.copyFileSync('.claude/skills/ld-s10y-lesson/tools/render_lesson.js', `${root}/render_lesson.before.js`)
  dump(`${root}/before.json`, {
    status: 'DISPLAY_REVISE_UNICODE_CIRCLE_PREFIX',
    finding: 'Generic prefix consumes the circle but leaves its period and places a baseline circle after the number-column period; mobile wraps the circle.',
    protectedFiles, observedAt: new Date().toISOString(),
  })
} else if (stage === 'repair-display') {
  const before = JSON.parse(fs.readFileSync(`${root}/before.json`))
  const run = (name, executable, args, env = {}) => {
    assert(!fs.existsSync(`${root}/${name}.command.json`))
    const startedAt = new Date().toISOString()
    const result = spawnSync(executable, args, {
      encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
      env: { ...process.env, PWDEBUG: '', PLAYWRIGHT_HTML_OPEN: 'never', ...env },
    })
    fs.writeFileSync(`${root}/${name}.stdout.txt`, result.stdout || '', { flag: 'wx' })
    fs.writeFileSync(`${root}/${name}.stderr.txt`, result.stderr || '', { flag: 'wx' })
    dump(`${root}/${name}.command.json`, { executable, args, startedAt,
      finishedAt: new Date().toISOString(), exit: result.status })
    assert.equal(result.status, 0, `Preserve failure: ${name}`)
    console.log(`${name}: PASS`)
  }
  run('focused-prefix-check', 'node', [`${T}/unicode-circle-prefix-focused.cjs`])
  for (const id of ids) {
    run(`${id}-render`, '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
      '-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'render',
      '--book', '9-10g', '--edition', 'modern-us-neutral', '--lesson', id,
    ])
    assert.equal(hash(`${render(id)}/text.html`), hash(`${root}/${id}/text.html`))
    run(`${id}-affected-exercises-display`, 'node', [`${T}/offline-check.mjs`, '9-10g', id], {
      OFFLINE_KINDS: 'exercises', OFFLINE_REPORT: 'prefix-repaired-report.json',
    })
  }
  for (const file of before.protectedFiles) assert.equal(hash(file.path), file.sha256)
  dump(`${root}/result.json`, {
    status: 'MECHANICAL_AFFECTED_DISPLAY_PASS_VISUAL_PENDING',
    protectedFiles: before.protectedFiles,
    renderer: record('.claude/skills/ld-s10y-lesson/tools/render_lesson.js'),
    textHtmlUnchanged: true,
    limits: 'Only exercise-prefix rendering and affected exercise display checked; no semantic/source/full lesson gate repeated.',
  })
} else throw new Error('Expected freeze or repair-display')
