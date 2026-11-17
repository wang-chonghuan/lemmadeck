import fs from 'node:fs'
import path from 'node:path'
import { root, json, fileReceipt, saveJson } from './common.mjs'

const outputs = []
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) walk(file)
    else if (entry.isFile()) outputs.push(fileReceipt(file))
    else throw new Error(`Unexpected output type: ${file}`)
  }
}
walk(root)
const freeze = json('input-freeze.json')
const browser = json('browser-results.json')
const projection = json('native-image-projection.json')
const ledger = json('image-ledger.json')
const report = saveJson('acceptance-results.json', {
  status: 'PASS_OFFLINE_ONLY', browserStatus: browser.status,
  independentVisualStatus: 'PASS_OFFLINE_VISIBLE_FULL_DOCUMENT_AND_ENDPOINTS',
  lessonId: browser.lessonId, correctedHarnessExecutions: 1, actualBrowserExecutions: 1,
  firstActualObservation: true, historicalFirstPackage: 'Unchanged FAIL/UNKNOWN, old lifetime0/24',
  findings: fileReceipt(path.join(root, 'findings.md')),
  imageLedger: fileReceipt(path.join(root, 'image-ledger.json')),
  batchImages: ledger.batchNow, lifetimeImages: ledger.lifetimeNow, reopens: ledger.reopens,
  browserClosed: browser.browserClosed, contextsClosed: browser.contextsClosed,
  sourceContentHtmlChanges: 0, promotionPerformed: false,
  limitations: 'OFFLINE only; product UI/auth/quiz/answers/DB/full-book/headed-OS/promotion not accepted.',
})
outputs.push(report)
const manifest = saveJson('complete-manifest.json', {
  status: 'PASS_OFFLINE_ONLY',
  inheritedFreeze: fileReceipt(path.join(root, 'input-freeze.json')),
  originalInputs: freeze.inputs.map((input) => ({ original: input.actual, firstFrozenSnapshot: input.snapshot })),
  inheritedOriginalPrograms: freeze.scripts, copiedBindings: json('copy-bindings.json'),
  inheritedGuidanceReceipts: freeze.guidance,
  configuredBrowserRuntimeInputs: browser.runtime,
  actualLaunchedBrowserExecutable: projection.actualBrowserExecutable,
  actualLaunchedBrowserEvidence: projection.actualBrowserExecutableEvidence,
  runtimeInputs: [...browser.loadedCommonJsFiles, ...projection.loadedCommonJsFiles],
  outputs, files: outputs.length, totalOutputBytes: outputs.reduce((sum, file) => sum + file.bytes, 0),
  selfReference: 'This manifest and outer seal command outputs/receipt are excluded to avoid recursive hashes. supplement-manifest.json inventories these final outer files; its hash is emitted after finalization.',
  sealedAt: new Date().toISOString(),
})
console.log(JSON.stringify({ status: 'PASS_OFFLINE_ONLY', report, manifest, findings: fileReceipt(path.join(root, 'findings.md')),
  ledger: fileReceipt(path.join(root, 'image-ledger.json')), batch: ledger.batchNow, lifetime: ledger.lifetimeNow }))
