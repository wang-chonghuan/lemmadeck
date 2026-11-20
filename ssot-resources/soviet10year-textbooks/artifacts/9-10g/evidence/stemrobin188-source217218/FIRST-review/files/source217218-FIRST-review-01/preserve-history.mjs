import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const root = path.dirname(new URL(import.meta.url).pathname)
const tmp = path.resolve(root, '..')
const read = relative => {
  const file = path.join(tmp, relative)
  const bytes = fs.readFileSync(file)
  return { file, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), data: JSON.parse(bytes) }
}
const r214 = read('source213214-FIRST-review-01/report.json')
const r215 = read('source215216-FIRST-review-01/report.json')
const a213 = read('source213215-author/next-source-author.json')
const a216 = read('source216218-author/next-source-author.json')
const i214 = read('source213214-FIRST-review-01/image-ledger.json')
const preserved = {
  schema: 'stemrobin188-historical-FIRST-FAIL-HOLD-counter-preservation@1',
  noHistoricalFileRewritten: true,
  currentReviewerTechnicalFailures: [],
  historical214: {
    provenance: { path: r214.file, sha256: r214.sha256 },
    FIRSTSeals: r214.data.blindnessAndSeals,
    FAIL: r214.data.definiteFAIL,
    HOLD: r214.data.HOLD,
    imageLedger: i214.data,
    technicalFailures: r214.data.technicalAndReadAccounting,
    actions: r214.data.actions,
  },
  historical215216: {
    provenance: { path: r215.file, sha256: r215.sha256 },
    FIRSTSeals: r215.data.FIRSTSeals,
    FAIL: r215.data.FAIL,
    HOLD: r215.data.HOLD,
    counts: r215.data.counts,
    technicalFailureLedger: r215.data.technicalFailureLedger,
    currentAdjudicationDoesNotEraseHistoricalF215HeadingFinding: true,
  },
  author213215: {
    provenance: { path: a213.file, sha256: a213.sha256 },
    holds: a213.data.holds,
    counts: a213.data.cumulative_counts,
    originalNativeFacts: a213.data.source_native_facts_status,
  },
  author216218: {
    provenance: { path: a216.file, sha256: a216.sha256 },
    FIRSTOrder: a216.data.FIRSTOrder,
    FIRSTsSealedBeforeNative: a216.data.allOwnFIRSTsSealedBeforeNative,
    allHolds: a216.data.allHolds,
    nativeTotals: a216.data.nativeTotals,
    closedImageBatch: Object.fromEntries(Object.entries(a216.data.closedImageBatch)
      .filter(([key]) => key !== 'observations')),
  },
  inheritedRepairs: { source212: 1, source214: 1, source214Limit: 1,
    source215: 0, source216: 0, source217: 0, source218: 0, currentReviewer: 0 },
  historicalProceduralFailureCountPreserved: 1,
  historical211212CountersDeclaredByBound215216Review: r215.data.counts.historical211212FindingsRetained,
  noUnboundEarlierRootRead: true,
  scopeQualification: 'Preservation is not a new review of any out-of-scope source/math/figure.',
}
const output = path.join(root, 'preserved-history.json')
fs.writeFileSync(output, JSON.stringify(preserved, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ output, historical214FAIL: preserved.historical214.FAIL.length,
  historical214HOLD: preserved.historical214.HOLD.length,
  historical215216FAIL: preserved.historical215216.FAIL.length,
  historical215216HOLD: preserved.historical215216.HOLD.length,
  author213215Holds: preserved.author213215.holds.length,
  author216218Holds: preserved.author216218.allHolds.length,
  currentReviewerTechnicalFailures: 0 }))
