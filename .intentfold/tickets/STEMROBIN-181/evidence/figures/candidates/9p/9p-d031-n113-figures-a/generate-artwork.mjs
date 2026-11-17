import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const output = path.join(own, 'fig-229/artwork/burner-opaque.png')
const command = [
  path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python'),
  '/Users/yong/.agents/skills/n-azure/scripts/generate_image.py',
  '--prompt-file', path.join(own, 'fig-229/artwork/prompt.txt'),
  '--reference-image', path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9p/figures/fig-229.png'),
  '--output', output, '--size', '1024x1024', '--quality', 'medium',
  '--background', 'opaque', '--retries', '0',
]
assert.ok(!fs.existsSync(output))
fs.writeFileSync(path.join(own, 'fig-229/artwork/generation-started.json'), JSON.stringify({
  command, generatedImagesRequested: 1, maximumGeneratedImagesForFigure: 2,
  retryPolicy: 'No automatic retry. At most one targeted semantic repair; retain initial output and evidence.',
  contextualImageOpensBeforeGeneration: 2, sourceReferenceAlreadyOpened: true,
}, null, 2) + '\n', { flag: 'wx' })
const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 320000 })
fs.writeFileSync(path.join(own, 'fig-229/artwork/generation-command.json'), JSON.stringify({
  command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  error: result.error?.message || null, generatedImagesRequested: 1,
  modelContextImageOpens: 0,
}, null, 2) + '\n', { flag: 'wx' })
console.log(result.stdout)
if (result.stderr) console.error(result.stderr)
process.exitCode = result.status === 0 ? 0 : 2
