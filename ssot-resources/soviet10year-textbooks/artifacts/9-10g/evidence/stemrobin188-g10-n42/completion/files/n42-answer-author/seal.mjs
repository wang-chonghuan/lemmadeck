import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import {owned, workLesson, bind, sha, readJson, jsonNew, writeNew} from './run.mjs'

const report = readJson(path.join(owned, 'report.json'))
assert.equal(sha(report.candidate.path), report.candidate.sha256)
assert.equal(sha(report.firstCandidate.path), report.firstCandidate.sha256)
assert.equal(sha(report.preparedOriginal.path), report.preparedOriginal.sha256)
assert.equal(readJson(path.join(owned, 'receipts/build-report.json')).exitCode, 0)
const files = []
function collect(directory) {
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) collect(file)
    else if (entry.isFile()) files.push(file)
  }
}
collect(owned)
const bindings = files.sort().map(bind)
jsonNew('artifact-hashes.json', {
  schema: 'stemrobin188/author-artifact-seal@1', generatedAt: new Date().toISOString(),
  candidateUnchangedSinceFirstSnapshot: true, reportGenerationReceiptBound: true,
  bindings, excludesSelfAndOwnStdout: true,
})
const reportPaths = ['report.json', 'report.md', 'artifact-hashes.json'].map(name => path.join(owned, name))
writeNew('delivery.sha256.txt', [
  ...reportPaths.map(file => `${sha(file)}  ${file}`),
  `${sha(report.candidate.path)}  ${report.candidate.path}`,
  `${sha(report.firstCandidate.path)}  ${report.firstCandidate.path}`,
  '',
].join('\n'))
for (const file of [...files, ...reportPaths, path.join(owned, 'delivery.sha256.txt')]) fs.chmodSync(file, 0o444)
console.log(JSON.stringify({
  status: report.status, candidate: bind(report.candidate.path), reports: reportPaths.map(bind),
  seal: bind(path.join(owned, 'delivery.sha256.txt')), artifactsBound: bindings.length,
  authorSupportOnly: true, finalizeRun: false, independentSemanticPASSClaim: false,
}, null, 2))
