import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file) })
const check = binding => assert.equal(hash(binding.path), binding.sha256, binding.path)
const save = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const indexPath = path.join(tmp, 'source191192-author/output-index.json')
assert.equal(hash(indexPath), 'e934ad451c89cb247400c23ec05a8009936d460de895b2fde97758a011f38ac8')
const index = read(indexPath)
index.files.forEach(check)
const pages = [191, 192].map(page => {
  const pageId = String(page).padStart(4, '0')
  const root = path.join(tmp, 'source191192-author')
  const current = path.join(root, 'artifacts/9-10g/pages', pageId)
  const work = path.join(root, 'work/9-10g/pages', pageId)
  const audit = read(path.join(current, 'audit.json'))
  assert.deepEqual(audit.errors, [])
  assert.equal(audit.lines_printed, audit.lines_md)
  return {
    page, original: bind(path.join(work, 'page.png')),
    candidateMD: bind(path.join(current, 'page.md')),
    candidateJSON: bind(path.join(current, 'page.json')), audit: bind(path.join(current, 'audit.json')),
    figures: audit.figures.map(item => ({
      id: item.id, exactBox: item.box, crop: bind(path.join(work, 'figures', `${item.id}.png`)),
    })),
  }
})
assert.deepEqual(pages.flatMap(page => page.figures.map(item => item.id)), ['fig-g10-48'])
const firstReviewPath = path.join(tmp, 'n48-fig26-source185186-review-01/source-review.json')
const firstReview = read(firstReviewPath)
const page185 = firstReview.pages.find(page => page.page === 185)
const repairRoot = path.join(tmp, 'source186-wording-repair-01')
const repairPath = path.join(repairRoot, 'result.json')
assert.equal(read(repairPath).status, 'native-pass-affected-source-review-pending')
assert.equal(read(repairPath).cumulativeSourceContentRepairs, 1)
const affected = {
  source185: {
    scope: 'p0185#9 opening only; resolve FIRST bottom-word ambiguity, not whole-page re-review',
    original: page185.original, candidateMD: page185.candidateMD, candidateJSON: page185.candidateJSON,
    firstIndependentInventory: page185.sourceInventory,
    previousIndependentReview: bind(firstReviewPath),
    unknownIsNotGuessedOrAutomaticallyRepaired: true,
  },
  source186: {
    scope: 'p0186#11 restored omitted character only; other PASS and HOLD scopes inherited',
    result: bind(repairPath), previousIndependentReview: bind(firstReviewPath),
    original: read(repairPath).original, repaired: read(repairPath).repaired,
    pageJson: read(repairPath).pageJson, audit: read(repairPath).audit,
    nativeReceipt: bind(path.join(repairRoot, 'finalize-once/command.json')),
    cumulativeSourceContentRepairs: 1, newImageReviewNeeded: false,
  },
}
const predecessorPath = path.join(tmp, 'source189190-author/next-source-author.json')
const tailPath = path.join(tmp, 'source191192-author/next-source-author.json')
const images = [
  ...pages.flatMap(page => [
    { ...page.original, scope: `source${page.page}-original-FIRST` },
    ...page.figures.map(item => ({ ...item.crop, scope: `${item.id}-native-source-crop-FIRST` })),
  ]),
  { ...page185.original, scope: 'source185-ex85-opening-wording-affected-only' },
]
assert.equal(images.length, 4)
const bindings = [...new Map([
  indexPath, ...index.files.map(item => item.path), firstReviewPath, repairPath,
  ...Object.values(affected.source185).filter(item => item && typeof item === 'object').map(item => item.path),
  ...Object.values(affected.source186).filter(item => item && typeof item === 'object').map(item => item.path),
  predecessorPath, tailPath,
  ...pages.flatMap(page => [
    page.original.path, page.candidateMD.path, page.candidateJSON.path, page.audit.path,
    ...page.figures.map(item => item.crop.path),
  ]),
  path.join(tmp, 'prepare-source191192-185186-affected-review-01.mjs'),
].map(file => [file, bind(file)])).values()]
bindings.forEach(check)
const output = path.join(tmp, 'source191192-185186-affected-review-inputs-01')
assert.ok(!fs.existsSync(output))
fs.mkdirSync(output)
save(path.join(output, 'manifest.json'), {
  status: 'pending-independent-source191192-first-and-185186-affected-only-review',
  ticket: 'STEMROBIN-188', assignment: 'SAME188-6', book: '9-10g', pages, affected,
  predecessorTextOnly: bind(predecessorPath), actual192Tail: bind(tailPath),
  bindings, images, imageOpensPlanned: 4, hardImageLimit: 8,
  inherited189MissingNativeReceiptHoldPreserved: true,
  source193Native9over7And195Native26over25HoldsPreserved: true,
  original185186IndependentFailureAndHoldsPreserved: true,
  noPassedFigureOrModernOrSourceScopesRepeated: true,
  allInkHoldsPreserved: true, nativeSourceFinalizerRepeated: false,
  wholeLessonApproved: false, parentImageLoads: 0, published: false,
})
console.log(JSON.stringify({ output, bindings: bindings.length, images: images.length }))
