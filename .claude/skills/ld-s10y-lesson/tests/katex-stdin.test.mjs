import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import { PassThrough } from 'node:stream'
import { createRequire } from 'node:module'

const script = new URL('../tools/katex_check.js', import.meta.url)
const source = fs.readFileSync(script, 'utf8')
const require = createRequire(script)
const katex = require('katex')

async function run(chunks, code = source) {
  const stdin = new PassThrough()
  const rendered = []
  const output = []
  vm.runInNewContext(code, {
    process: { stdin },
    require(name) {
      assert.equal(name, 'katex')
      return {
        renderToString(tex, options) {
          rendered.push(tex)
          return katex.renderToString(tex, options)
        },
      }
    },
    console: { log(value) { output.push(value) } },
  })
  const ended = new Promise(resolve => stdin.once('end', resolve))
  for (const chunk of chunks) stdin.write(chunk)
  stdin.end()
  await ended
  assert.equal(output.length, 1)
  return { rendered, results: JSON.parse(output[0]) }
}

const items = [{
  id: 'source-array', field: 'text', display: false,
  tex: '\\text{已知：}\\rho=2500\\ \\text{千克}/\\text{米}^3',
}]
const bytes = Buffer.from(JSON.stringify(items))

test('UTF-8 formulas survive byte-sized stdin chunks without replacement glyphs', async () => {
  const chunks = Array.from(bytes, byte => Buffer.from([byte]))
  const actual = await run(chunks)
  assert.deepEqual(actual.rendered, items.map(item => item.tex))
  assert.equal(actual.results[0].ok, true)
  assert.deepEqual(actual.results[0].warnings, [])
})

test('whole-buffer stdin retains the same formula and result contract', async () => {
  const actual = await run([bytes])
  assert.deepEqual(actual.rendered, items.map(item => item.tex))
  assert.deepEqual(actual.results, [{
    id: 'source-array', field: 'text', ok: true, warnings: [],
  }])
})

test('malformed JSON still produces an explicit fatal result', async () => {
  const actual = await run([Buffer.from('[{"tex":')])
  assert.deepEqual(actual.rendered, [])
  assert.equal(actual.results.length, 1)
  assert.match(actual.results[0].fatal, /stdin .* JSON/)
})

test('forced split reproduces the unpatched decoder corruption', async () => {
  const before = source.replace('process.stdin.setEncoding("utf8");\n', '')
  assert.notEqual(before, source)
  const chunks = Array.from(bytes, byte => Buffer.from([byte]))
  const actual = await run(chunks, before)
  assert.notDeepEqual(actual.rendered, items.map(item => item.tex))
  assert.match(actual.rendered[0], /\uFFFD/)
  assert(actual.results[0].warnings.some(warning => warning.includes('unknownSymbol')))
})
