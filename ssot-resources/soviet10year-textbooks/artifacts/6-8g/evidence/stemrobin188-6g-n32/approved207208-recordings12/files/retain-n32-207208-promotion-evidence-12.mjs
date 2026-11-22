import path from 'node:path'
import { tmp, read, bind } from './retain-scoped-evidence-02.mjs'
import { core6g, retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const promotionFile = path.join(core6g,
  'evidence/stemrobin188-6g-n32/approved207208-assets12/promotion.json')
const promotion = read(promotionFile)
const references = [bind(promotionFile),
  bind(path.join(tmp, 'retain-n32-approved207208-assets-12.mjs')),
  bind(path.join(tmp, 'retain-n32-207208-promotion-evidence-12.mjs')),
  promotion.proposedTemplate]
for (const figure of promotion.results) {
  references.push(figure.receipt)
  const receipt = read(figure.receipt.path)
  references.push(...Object.values(receipt.streams))
  references.push(...figure.outputs.map(item => ({
    path: path.join(core6g, item.path), sha256: item.sha256,
  })))
}
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-n32/approved207208-recordings12', references,
  ['evidence/stemrobin188-6g-n32/independent-nineanswers-text-207208-review12/retention.json'],
  { status: promotion.status, promotion: bind(promotionFile),
    noSourceSpecSvgTextOrDisplayChanges: true, noProducerReplays: true,
    modernFigure207208RecordingsRetained: true, parentImageLoads: 0 },
)))
