import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import { createRequire, stripTypeScriptTypes } from 'node:module'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const owner = path.dirname(fileURLToPath(import.meta.url))
assert.equal(process.cwd(), root)
assert.equal(owner, path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n68-answer-author'))
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const manifestPath = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n68-answer-author-inputs-01/manifest.json')
const manifestBytes = fs.readFileSync(manifestPath)
const manifest = JSON.parse(manifestBytes)
const inputsBefore = manifest.inputs.map((input) => {
  const bytes = fs.readFileSync(input.path)
  const actual = sha256(bytes)
  assert.equal(actual, input.sha256, input.path)
  return { path: input.path, sha256: actual, bytes: bytes.length }
})

const judgePath = path.join(root, 'app/src/lib/textbook-answer.ts')
const normalizePath = path.join(root, 'app/src/lib/answer-normalize.ts')
const judgeBytes = fs.readFileSync(judgePath)
const normalizeBytes = fs.readFileSync(normalizePath)
const judgeSource = judgeBytes.toString('utf8')
const start = judgeSource.indexOf('let enginePromise:')
const stop = judgeSource.indexOf('export async function recordTextbookSubmission')
assert.ok(start >= 0 && stop > start)
const pureJudgeSource = judgeSource.slice(start, stop)
assert.ok(!pureJudgeSource.includes('sql('))
assert.ok(!pureJudgeSource.includes('createServerFn'))
assert.ok(!pureJudgeSource.includes('process.env'))
const require = createRequire(path.join(root, 'app/package.json'))
const requireEntry = require.resolve('@cortex-js/compute-engine')
const packagePath = path.join(path.dirname(path.dirname(requireEntry)), 'package.json')
const enginePackage = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
const enginePath = path.resolve(path.dirname(packagePath), enginePackage.exports['.'].import)
const engineUrl = pathToFileURL(enginePath).href
assert.equal(pureJudgeSource.split("import('@cortex-js/compute-engine')").length, 2)
const moduleUrl = (source) => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`
const normalizeUrl = moduleUrl(stripTypeScriptTypes(normalizeBytes.toString('utf8')))
// Keep the production functions intact; only resolve their imports to offline files.
const executable = stripTypeScriptTypes(
  `import { exactMathAnswersMatch } from ${JSON.stringify(normalizeUrl)};\n` +
  pureJudgeSource.replace("import('@cortex-js/compute-engine')", `import(${JSON.stringify(engineUrl)})`),
)
const { judgeTextbookPart } = await import(moduleUrl(executable))

const probesPath = path.join(owner, 'offline-judge-cases.json')
const probesBytes = fs.readFileSync(probesPath)
const probes = JSON.parse(probesBytes)
assert.ok(probes.length > 0 && probes.length <= 40)
const results = []
for (const probe of probes) {
  try {
    const actual = await judgeTextbookPart(probe.part, probe.submitted)
    results.push({
      ...probe,
      actual,
      matchesMathematics: actual === probe.mathematicallyCorrect,
    })
  } catch (error) {
    results.push({
      ...probe,
      actual: null,
      matchesMathematics: false,
      error: String(error?.stack || error),
    })
  }
}
const inputsAfter = manifest.inputs.map((input) => {
  const bytes = fs.readFileSync(input.path)
  const actual = sha256(bytes)
  assert.equal(actual, input.sha256, input.path)
  return { path: input.path, sha256: actual, bytes: bytes.length }
})
assert.deepEqual(inputsAfter, inputsBefore)
assert.equal(sha256(fs.readFileSync(manifestPath)), sha256(manifestBytes))
assert.equal(sha256(fs.readFileSync(judgePath)), sha256(judgeBytes))
assert.equal(sha256(fs.readFileSync(normalizePath)), sha256(normalizeBytes))
const receipt = {
  scope: 'bounded offline actual production judgeTextbookPart; no DB imports or calls',
  extraction: {
    judgePath,
    judgeSha256: sha256(judgeBytes),
    normalizePath,
    normalizeSha256: sha256(normalizeBytes),
    productionFunctionBodiesChanged: false,
    adaptation: 'Node built-in TypeScript stripping; import resolution only',
    packagePath,
    packageVersion: enginePackage.version,
    importEntry: enginePackage.exports['.'].import,
    enginePath,
    engineSha256: sha256(fs.readFileSync(enginePath)),
    assumptionsAdded: false,
    casePath: probesPath,
    caseSha256: sha256(probesBytes),
  },
  inputsBefore,
  inputsAfter,
  inputsUnchanged: true,
  count: results.length,
  behaviorFailures: results.filter((result) => !result.matchesMathematics).length,
  executionFailures: results.filter((result) => result.error).length,
  results,
}
const output = path.join(owner, 'offline-judge-results-recovered.json')
fs.writeFileSync(output, `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ output, count: receipt.count, behaviorFailures: receipt.behaviorFailures, executionFailures: receipt.executionFailures }))
for (const result of results) {
  console.log(JSON.stringify({ id: result.id, actual: result.actual, mathematicallyCorrect: result.mathematicallyCorrect, matchesMathematics: result.matchesMathematics, error: result.error?.split('\n')[0] }))
}
