import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { root, lessonId, json, saveJson, fileReceipt } from './common.mjs'

const browser = json('browser-results.json')
const observations = json('native-observations.json')
const commands = json('command-receipts.json')
assert.equal(browser.status, 'PASS_BROWSER_PENDING_NATIVE_VISUAL')
assert.equal(browser.browserClosed, true)
assert.equal(commands.executions.length, 2)
assert(commands.executions.every((execution) => execution.exit === 0))
assert.equal(observations.entries.length, browser.chosenScreenshots.length)
assert(observations.entries.length > 0 && observations.entries.length <= 8)
for (const [index, entry] of observations.entries.entries()) {
  const planned = browser.chosenScreenshots[index]
  assert.equal(entry.path, planned.path)
  assert.equal(entry.sha256, planned.sha256)
  assert.equal(fileReceipt(entry.path).sha256, entry.sha256)
  assert.equal(entry.loads, 1)
  assert.equal(entry.detail, 'original')
  assert.equal(entry.status, 'PASS_NATIVE_VISUAL')
  assert(entry.observed.length > 0)
}
const ledger = saveJson('image-ledger.json', {
  status: 'COMPLETE_NATIVE_OBSERVATIONS', lessonId,
  imagePlan: fileReceipt(path.join(root, 'image-plan.md')),
  batchConsumed: observations.entries.length, lifetimeConsumed: observations.entries.length,
  batchMaximum: 8, lifetimeMaximum: 24, parentPermanentConsumed: 24,
  reopens: 0, resizes: 0, returnedImagePayloads: 0,
  entries: observations.entries,
})
const final = saveJson('final-report.json', {
  status: 'PASS_FIRST_INDEPENDENT_OFFLINE_BROWSER_AND_NATIVE_VISUAL', lessonId,
  completedAt: new Date().toISOString(),
  scope: 'OFFLINE ONLY. No fresh source-pixel or semantic review, DB/product/quiz/answer acceptance or promotion.',
  parentFactsNotRevalidated: observations.parentFactsNotRevalidated,
  inputSnapshot: fileReceipt(path.join(root, 'input-snapshot.json')),
  actualCheck: fileReceipt(path.join(root, 'browser-check.mjs')),
  rawBrowserResults: fileReceipt(path.join(root, 'browser-results.json')),
  originalCommandReceipts: fileReceipt(path.join(root, 'command-receipts.json')),
  nativeObservations: fileReceipt(path.join(root, 'native-observations.json')),
  imageLedger: ledger,
  results: browser.surfaces.map((surface) => ({
    id: surface.id, assertionStatus: surface.assertionStatus,
    paragraphs: surface.geometry.paragraphs.length, separators: surface.geometry.sections.length,
    sourceFigures: surface.geometry.sourceFigures, exercises: surface.geometry.exercises,
    controls: surface.geometry.controls.length, errors: surface.geometry.errorElements,
    pageWidth: surface.geometry.docWidth, documentHeight: surface.geometry.docHeight,
    overflowWrappers: surface.scrollChecks.length, screenshots: surface.screenshots,
    remoteRequests: surface.events.requests.filter((request) => /^https?:/.test(request.url)).length,
  })),
  browserClosed: browser.browserClosed, contextsClosed: browser.contextsClosed,
  nativeVisualStatus: 'PASS_NATIVE_VISUAL', limitations: observations.limitations,
  promotion: 'NOT_PERFORMED_PARENT_RETAINS_BEFORE_ANY_PROMOTION',
})
function inventory(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name)
    return entry.isDirectory() ? inventory(file) : [fileReceipt(file)]
  })
}
const manifest = saveJson('manifest.json', {
  schema: 'offline-first-review-evidence@1', lessonId, root,
  status: 'COMPLETE', finalReport: final, actualCheck: fileReceipt(path.join(root, 'browser-check.mjs')),
  entries: inventory(root).sort((a, b) => a.path.localeCompare(b.path)),
  selfExcluded: 'manifest.json cannot contain its own SHA; terminal receipt binds it.',
})
console.log(JSON.stringify({ status: 'COMPLETE', finalReport: final,
  actualCheck: fileReceipt(path.join(root, 'browser-check.mjs')), manifest, ledger }))
