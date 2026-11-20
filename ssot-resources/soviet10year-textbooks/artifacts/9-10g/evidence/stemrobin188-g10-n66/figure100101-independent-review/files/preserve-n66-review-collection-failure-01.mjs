import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const collector = path.join(tmp, 'collect-n61-n64-01.mjs')
const first = path.join(tmp, 'collect-n66-figure100101-FIRSTFAIL.mjs')
fs.copyFileSync(collector, first, fs.constants.COPYFILE_EXCL)
fs.chmodSync(first, 0o444)
save(path.join(tmp, 'n66-figure100101-review-01-collection-FIRSTFAIL.json'), {
  status: 'collector-exit1-before-output-collection',
  command: 'node .intentfold/tickets/STEMROBIN-188/tmp/collect-n61-n64-01.mjs n66-figure100101-review-01 43e0ae76c62dc830781fc6fca9abd4a15af083cf872a92ab63f49fc0db0f2b05',
  exitCode: 1, firstCollector: bind(first),
  actualError: "AssertionError: actual 'n66-figure100101-review-01', expected 'source237238-author' at collector:55:35",
  cause: 'same188-6/output-index@1 in this report has path, not the earlier absolute_path variant',
  outputIndex: bind(path.join(tmp, 'n66-figure100101-review-01/output-index.json')),
  reviewOrProducerReruns: 0, contentApproval: false,
})
