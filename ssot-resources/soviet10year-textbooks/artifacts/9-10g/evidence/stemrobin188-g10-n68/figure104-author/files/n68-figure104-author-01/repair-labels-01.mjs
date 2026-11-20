import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from '../retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const root = path.join(tmp, 'n68-figure104-author-01')
const first = path.join(root, 'fig-g10-104.spec.json')
const failed = path.join(root, 'fig-g10-104.render.json')
assert.equal(read(failed).status, 'fail')
assert.deepEqual(read(failed).collisions.map(item => item.id),
  ['104-O-label', '104-A-label', '104-B-label', '104-x-label-label'])
const previous = read(first)
const spec = structuredClone(previous)
for (const id of ['104-O', '104-A', '104-B'])
  spec.objects.find(item => item.id === id).labelPlacement.gap = 34
spec.objects.find(item => item.id === '104-x-label').at = [610, 80]
const check = structuredClone(spec)
for (const id of ['104-O', '104-A', '104-B'])
  check.objects.find(item => item.id === id).labelPlacement.gap =
    previous.objects.find(item => item.id === id).labelPlacement.gap
check.objects.find(item => item.id === '104-x-label').at =
  previous.objects.find(item => item.id === '104-x-label').at
assert.deepEqual(check, previous)
for (const name of ['fig-g10-104.spec.json', 'fig-g10-104.render.json',
  'fig-g10-104.svg', 'render-FIRST.command.json', 'author.mjs'])
  fs.chmodSync(path.join(root, name), 0o444)
const candidate = path.join(root, 'fig-g10-104.repair01.spec.json')
save(candidate, spec)
save(path.join(root, 'repair01.json'), {
  firstSpec: bind(first), firstFailure: bind(failed), candidate: bind(candidate),
  changedFieldsOnly: ['O/A/B labelPlacement.gap', 'x-label.at'],
  geometryAssertionsAndSourceInventoryUnchanged: true,
  contentRepairsUsed: 1, parentImageLoads: 17, published: false,
})
const command = 'node'
const args = ['.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '--spec', candidate, '--svg', path.join(root, 'fig-g10-104.repair01.svg'),
  '--report', path.join(root, 'fig-g10-104.repair01.render.json')]
const result = spawnSync(command, args, { cwd: repo, encoding: 'utf8',
  maxBuffer: 16 * 1024 * 1024 })
save(path.join(root, 'render-repair01.command.json'), {
  command, args, cwd: repo, exitCode: result.status, stdout: result.stdout,
  stderr: result.stderr, error: result.error?.message, published: false,
})
assert.equal(result.status, 0, result.stderr || result.stdout)
assert.equal(read(path.join(root, 'fig-g10-104.repair01.render.json')).spec.sha256, hash(candidate))
console.log(result.stdout)
