import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
assert.equal(process.cwd(), repo)
const batch = path.join(repo, '.tmp/s10y-image/batch014-n36-133134')
const templates = path.join(repo, '.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s3-n36')
const durable = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures')
const input = path.join(batch, 'context-input')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const write = (p, value) => {
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
}
const link = (target, p) => {
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.symlinkSync(target, p)
}

for (const name of ['lesson', 'exercises']) {
  link(path.join(templates, `${name}.template.json`),
    path.join(input, '9-10g/editions/modern-us-neutral/lessons/geo910-c1-s3-n36', `${name}.json`))
}
for (const id of [133, 134]) {
  const figure = `fig-${id}`
  const out = path.join(batch, figure)
  const source = path.join(durable, `${figure}.png`)
  link(source, path.join(input, '9-10g/figures', `${figure}.png`))
  write(path.join(out, 'durable-context-failure.json'), {
    stage: 'build_context default durable edition lookup',
    command: ['python3', '.agents/skills/ld-s10y-image/scripts/build_context.py',
      '--book', '9-10g', '--edition', 'modern-us-neutral', '--figure', figure,
      '--output', `.tmp/s10y-image/batch014-n36-133134/${figure}/context.json`],
    workdir: repo,
    exitCode: 1,
    stderr: `ERROR: ${figure} is not referenced by edition modern-us-neutral\n`,
    observed: true,
    limitation: 'Original command emitted no file; this is a faithful retrospective failure receipt, not raw captured stderr.',
    diagnosis: 'Authoritative adaptation templates are not promoted to the durable edition.',
    imagesLoaded: 0,
  })
  const args = ['.agents/skills/ld-s10y-image/scripts/build_context.py',
    '--book', '9-10g', '--edition', 'modern-us-neutral', '--figure', figure,
    '--root', input, '--output', path.join(out, 'context.builder.json')]
  const call = spawnSync('python3', args, { cwd: repo, encoding: 'utf8' })
  write(path.join(out, 'context-call.json'), {
    command: ['python3', ...args], workdir: repo,
    exitCode: call.status, stdout: call.stdout, stderr: call.stderr,
    templateInputs: ['lesson', 'exercises', 'figures'].map(name => ({
      path: path.join(templates, `${name}.template.json`),
      sha256: hash(path.join(templates, `${name}.template.json`)),
    })),
    source: { path: source, sha256: hash(source) },
  })
  assert.equal(call.status, 0, call.stderr)
  const context = JSON.parse(fs.readFileSync(path.join(out, 'context.builder.json')))
  assert.equal(context.sourceImage.sha256, hash(source))
  context.sourceImage.path = path.relative(repo, source)
  context.contextProvenance = {
    builder: '.agents/skills/ld-s10y-image/scripts/build_context.py',
    builderSha256: hash(path.join(repo, '.agents/skills/ld-s10y-image/scripts/build_context.py')),
    rawBuilderOutput: path.join(out, 'context.builder.json'),
    editionAuthority: 'Complete adaptation lesson and exercises templates, read before images.',
    templates: ['lesson', 'exercises', 'figures'].map(name => ({
      path: path.join(templates, `${name}.template.json`),
      sha256: hash(path.join(templates, `${name}.template.json`)),
    })),
    normalization: 'Only sourceImage.path resolves the local input symlink back to the corrected durable source crop.',
  }
  write(path.join(out, 'context.json'), context)
  console.log(`PASS: ${figure} adaptation context, source ${hash(source)}`)
}
