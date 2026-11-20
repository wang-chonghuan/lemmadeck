import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), cwd)
const output = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d183-n21-text-author')
const work = path.join(cwd, '.tmp/STEMROBIN-181/d1816-d183/work/adapt/10p')
const editions = ['modern-us-neutral', 'modern-us-neutral-en']
const source = path.join(cwd, 'ssot-resources/soviet10year-textbooks/artifacts/10p/lessons/phy10-c1-s3-n21/lesson.json')
const flowTool = path.join(cwd, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs')
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const binding = (file) => {
  const bytes = fs.readFileSync(file)
  return { path: file, sha256: hash(bytes), bytes: bytes.length }
}
const template = (edition, name = 'lesson.template.json') =>
  path.join(work, edition, 'lessons/phy10-c1-s3-n21', name)
const createJSON = (file, value) => {
  assert.ok(file.startsWith(`${output}/`))
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}

if (process.argv[2] === 'capture') {
  const preparedPath = path.join(output, 'prepared.json')
  const prepared = read(preparedPath)
  const inheritedImages = prepared.reused.filter((entry) => /\.(png|svg)$/.test(entry.path))
  const inputs = [
    preparedPath,
    ...prepared.reused.filter((entry) => !/\.(png|svg)$/.test(entry.path)).map((entry) => path.join(cwd, entry.path)),
    flowTool,
    path.join(cwd, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'),
    path.join(cwd, '.claude/skills/ld-s10y-lesson/SKILL.md'),
    path.join(cwd, '.claude/skills/ld-s10y-lesson/references/production-resume.md'),
    ...editions.flatMap((edition) => [
      template(edition),
      template(edition, 'exercises.template.json'),
      template(edition, 'figures.template.json'),
    ]),
  ]
  const bindings = [...new Set(inputs)].map(binding)
  for (const entry of prepared.reused.filter((entry) => !/\.(png|svg)$/.test(entry.path))) {
    const current = bindings.find((item) => item.path === path.join(cwd, entry.path))
    assert.equal(current.sha256, entry.sha256)
    assert.equal(current.bytes, entry.bytes)
  }
  createJSON(path.join(output, 'input-bindings.json'), {
    schema: 'STEMROBIN-181/D183-original-input-bindings@1',
    cwd,
    bindings,
    inheritedSourceImageBindingsNotOpenedOrRehashed: inheritedImages.map((entry) => ({
      ...entry, path: path.join(cwd, entry.path), verification: 'INHERITED_FROM_PREPARED_ONLY',
    })),
    originalWorkingLessons: Object.fromEntries(editions.map((edition) => [edition, read(template(edition))])),
    imagesOpened: 0,
    imageBytesRead: 0,
  })
  console.log(JSON.stringify({ status: 'ORIGINAL_INPUTS_CAPTURED', binding: binding(path.join(output, 'input-bindings.json')) }, null, 2))
} else if (process.argv[2] === 'flow') {
  const edition = process.argv[3]
  assert.ok(editions.includes(edition))
  const input = template(edition)
  const result = spawnSync(process.execPath, [flowTool, input], { cwd, encoding: 'utf8' })
  const receipt = {
    schema: 'STEMROBIN-181/D183-prose-flow-authoring-receipt@1',
    cwd,
    command: [process.execPath, flowTool, input],
    tool: binding(flowTool),
    input: binding(input),
    exitCode: result.status,
    signal: result.signal,
    error: result.error ? String(result.error) : null,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    interpretation: 'AUTHORING_OUTLINE_ONLY_NOT_FINALIZER_RENDER_OR_INDEPENDENT_REVIEW',
  }
  const file = path.join(output, `prose-flow-${edition}.json`)
  createJSON(file, receipt)
  console.log(receipt.stdout)
  if (result.status !== 0 || result.error) {
    console.error(JSON.stringify({ preservedFailure: file, ...receipt }, null, 2))
    process.exitCode = 1
  }
} else {
  throw new Error('Expected capture or flow')
}
