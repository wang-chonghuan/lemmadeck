import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const [figure, attempt = 'first'] = process.argv.slice(2)
if (!['fig-164', 'fig-165'].includes(figure) || !['first', 'repair'].includes(attempt)) throw Error('Bounded figure / attempt required')
const root = process.cwd()
const owned = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d577-n75-fig164165-first-modern-author')
const directory = path.join(owned, figure, attempt)
const spec = path.join(directory, 'spec.json')
const hash = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const save = (p, value) => fs.writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const source = JSON.parse(fs.readFileSync(spec, 'utf8')).source.image
if (fs.existsSync(path.join(directory, 'commands.json'))) throw Error('Do not repeat an unchanged native attempt')
const records = []
const run = (name, executable, args) => {
  const result = spawnSync(executable, args, {
    cwd: root, encoding: 'utf8', timeout: 180000,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  fs.writeFileSync(path.join(directory, `${name}.stdout.txt`), result.stdout || '', { flag: 'wx' })
  fs.writeFileSync(path.join(directory, `${name}.stderr.txt`), result.stderr || '', { flag: 'wx' })
  records.push({
    name, command: [executable, ...args], cwd: root, exitCode: result.status,
    signal: result.signal, error: result.error?.message || null,
    stdout: { path: path.join(directory, `${name}.stdout.txt`), sha256: hash(path.join(directory, `${name}.stdout.txt`)) },
    stderr: { path: path.join(directory, `${name}.stderr.txt`), sha256: hash(path.join(directory, `${name}.stderr.txt`)) },
  })
  return result.status === 0
}
const validated = run('native-validate', 'python3', [
  '.agents/skills/ld-s10y-image/scripts/validate_spec.py', spec, '--stage', 'draft', '--json',
])
let rendered = false
if (validated) rendered = run('native-render', 'node', [
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '--spec', spec,
  '--svg', path.join(directory, `${figure}.svg`),
  '--png', path.join(directory, 'native.full.png'),
  '--report', path.join(directory, 'native.render.json'),
])
const outputs = ['spec.json', `${figure}.svg`, 'native.full.png', 'native.render.json']
  .filter((file) => fs.existsSync(path.join(directory, file)))
  .map((file) => ({ path: path.join(directory, file), sha256: hash(path.join(directory, file)) }))
const report = {
  schema: 'd577-native-attempt@1', figure, attempt, nativeValidation: validated ? 'PASS' : 'FAIL',
  nativeRender: !validated ? 'NOT-RUN' : rendered ? 'PASS' : 'FAIL',
  source: { ...source, actualSha256: hash(source.path) }, spec: { path: spec, sha256: hash(spec) },
  nativeRendererRevalidatesInternally: true, explicitValidateInvocations: 1, renderInvocations: validated ? 1 : 0,
  commands: records, outputs, independentFigurePass: false, independentDisplayPass: false,
}
save(path.join(directory, 'commands.json'), report)
for (const file of fs.readdirSync(directory)) fs.chmodSync(path.join(directory, file), 0o444)
console.log(JSON.stringify(report, null, 2))
if (!validated || !rendered) process.exitCode = 2
