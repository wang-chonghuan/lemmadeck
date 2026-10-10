import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const script = fileURLToPath(new URL('../tools/prose_flow.mjs', import.meta.url))

async function run(raw) {
  const child = spawn(process.execPath, [script, '--stdin'], { stdio: ['pipe', 'pipe', 'pipe'] })
  let stdout = '', stderr = ''
  child.stdout.setEncoding('utf8').on('data', chunk => { stdout += chunk })
  child.stderr.setEncoding('utf8').on('data', chunk => { stderr += chunk })
  const exited = new Promise((resolve, reject) => {
    child.on('error', reject)
    child.on('close', code => resolve(code))
  })
  for (let offset = 0; offset < raw.length; offset += 4096) {
    if (!child.stdin.write(raw.slice(offset, offset + 4096))) {
      await new Promise(resolve => child.stdin.once('drain', resolve))
    }
    await new Promise(resolve => setImmediate(resolve))
  }
  child.stdin.end()
  return { code: await exited, stdout, stderr }
}

test('stdin consumes the complete long lesson across pipe chunks', async () => {
  const text = 'A complete sentence. '.repeat(20000).trim()
  const result = await run(JSON.stringify({ prose: [{ kind: 'p', text }], section_breaks: [] }))
  assert.equal(result.code, 0, result.stderr)
  assert.equal(result.stderr, '')
  const report = JSON.parse(result.stdout)
  assert.equal(report.paragraphs.length, 1)
  assert.equal(report.paragraphs[0].text, text)
  assert.deepEqual(report.resolvedBreaks, [])
})

test('stdin still rejects invalid JSON instead of accepting a partial document', async () => {
  const result = await run('{"prose":')
  assert.equal(result.code, 2)
  assert.equal(result.stdout, '')
  assert.ok(result.stderr.length > 0)
})
