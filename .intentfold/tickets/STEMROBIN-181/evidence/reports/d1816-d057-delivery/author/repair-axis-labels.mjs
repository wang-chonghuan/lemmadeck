import fs from 'node:fs'
import path from 'node:path'
import { A, F, editions, id, load, save } from './receipt.mjs'
for (const name of editions) {
  const p = path.join(F, name, 'lessons', id, 'figures/fig-35.spec.json')
  const before = path.join(A, 'first-label-failure', name, 'fig-35.spec.json')
  fs.mkdirSync(path.dirname(before), { recursive: true })
  fs.copyFileSync(p, before, fs.constants.COPYFILE_EXCL)
  const spec = load(p)
  const current = spec.objects.find(o => o.id === 'axis-current-label')
  const voltage = spec.objects.find(o => o.id === 'axis-voltage-label')
  if (JSON.stringify(current.at) !== '[31,333]' ||
      JSON.stringify(voltage.at) !== '[133,333]') throw new Error('Unexpected label target')
  current.at = [45, 317]
  voltage.at = [133, 317]
  fs.writeFileSync(p, JSON.stringify(spec, null, 2) + '\n')
}
const firstSvg = path.join(F, editions[0], 'lessons', id, 'figures/fig-35.svg')
fs.copyFileSync(firstSvg, path.join(A, 'first-label-failure/fig-35.svg'), fs.constants.COPYFILE_EXCL)
save(path.join(A, 'label-repair.json'), {
  schema: 'STEMROBIN-181/localized-native-label-repair@1',
  role: 'author', status: 'independent-review-pending',
  firstReceipt: 'receipts/render-fig35-context-final.json',
  firstNativeReport: path.join(F, 'native/fig-35.context-final.render.json'),
  firstPreview: path.join(F, 'previews/fig-35-full-final.png'),
  imageLoadForSpecificFinding: 1,
  finding: 'Native report rejects i_R and u_R near top/left canvas bounds.',
  localizedRepair: 'Move only i_R anchor from [31,333] to [45,317] and u_R from [133,333] to [133,317]. No curve, leader, axis, phase, stroke, scale or source-text change.',
  visualCompositionRepairCount: 1,
  priorSpecContractRepairCount: 1,
  paidCalls: 0,
})
