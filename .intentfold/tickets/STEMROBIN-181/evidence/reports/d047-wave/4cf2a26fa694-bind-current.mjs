import fs from 'node:fs'
import path from 'node:path'
import { A, T, W, card, read, write, hash, command } from './prepare.mjs'

const repairRoot=path.join(T,'tmp/d046-n44-text-repair')
const repairFreeze=path.join(repairRoot,'repair-freeze.json')
if(hash(repairFreeze)!=='3dac48e44d85268eef06e8d8476dc47644fc137e2f3537884dc0e55663921472')throw new Error('Text repair freeze mismatch')
write('inputs/current/repair-freeze.json',fs.readFileSync(repairFreeze))
const freeze=read(repairFreeze),bindings=[]
for(const language of ['zh','en']) {
  const output=freeze.outputs.find(o=>o.language===language)
  for(const name of ['prose.md','lesson.template.json','exercises.template.json','figures.template.json']) {
    const original=path.join(repairRoot,'frozen',language,name)
    const expected=name==='prose.md'?output.prose.sha256:name==='lesson.template.json'?output.frozen.sha256:
      output.fullTemplates.find(o=>o.path.endsWith(name)).sha256
    if(hash(original)!==expected)throw new Error(`Current input mismatch ${original}`)
    const snapshot=write(`inputs/current/${language}/${name}`,fs.readFileSync(original))
    bindings.push({original,snapshot,sha256:hash(original)})
  }
}
const initialSpec=path.join(A,'candidates/repair/fig-83.spec.json')
const spec=read(initialSpec)
const unchangedProjection=s=>JSON.stringify({
  objects:s.objects,assertions:s.assertions,canvas:s.canvas,assets:s.assets,
  sourceImage:s.source.image,sourceInventory:s.source.inventory,layout:s.layout,
})
const oldProjection=unchangedProjection(spec)
spec.source.authoritativeText=['en','zh'].map(language=>({
  language,lesson:card,text:fs.readFileSync(path.join(A,`inputs/current/${language}/prose.md`),'utf8'),
}))
spec.display.widths=[640,346,480,358,342,331]
const currentSpec=write('frozen/fig-83.spec.json',spec)
if(oldProjection!==unchangedProjection(spec))throw new Error('Geometry, assets or source changed during rebind')
for(const name of ['fig-83.svg','fig-83.artwork.png'])write(`frozen/${name}`,fs.readFileSync(path.join(A,'candidates/repair',name)))
const nativeReport=path.join(A,'candidates/repair/fig-83.render.json')
const report=read(nativeReport)
if(report.status!=='pass'||report.spec.sha256!==hash(initialSpec))throw new Error('Native report binding invalid')
if(report.labels!==0)throw new Error('Display context reuse requires no figure labels')
const projectionSha=cryptoHash(oldProjection)
const contextReceipt={
  schema:'ld-s10y-image/author-context-rebind@1',status:'PASS',
  repairFreeze:{path:repairFreeze,snapshot:path.join(A,'inputs/current/repair-freeze.json'),sha256:hash(repairFreeze)},
  bindings,previousSpec:{path:initialSpec,sha256:hash(initialSpec)},
  currentSpec:{path:currentSpec,sha256:hash(currentSpec)},
  unchanged:['objects','assertions','canvas','assets','source.image','source.inventory','layout'],
  projectionSha256:projectionSha,
  measuredWidths:{desktop:640,mobile:346,viewports:[[1440,960],[390,844]]},
  metadataOnlyChanges:['source.authoritativeText','display.widths'],
  geometryRenderReplay:false,geometryRepair:false,sourceVectorReplay:false,
  generationReplay:false,sourceNativeReplay:false,textRepairAuthoredHere:false,
  originalNativeReport:{path:nativeReport,sha256:hash(nativeReport)},
  provenance:'Derived context-bound receipt, not a new renderer execution. Original native report and outputs remain unchanged.',
  generationContext:'Original material-only generation prompt is historical and unchanged. Current full text is bound here; apparatus setup is unchanged, and generation owns no science, apparatus or labels.',
  independentSCI:'PENDING parent affected review',independentZHEN:'PENDING parent affected review',
}
const contextReceiptPath=write('receipts/current-context-binding.json',contextReceipt)
const rebound=structuredClone(report)
rebound.spec={path:currentSpec,sha256:hash(currentSpec)}
rebound.output.svg.path=path.join(A,'frozen/fig-83.svg')
rebound.output.artwork.path=path.join(A,'frozen/fig-83.artwork.png')
rebound.displayChecks.push({
  width:346,minTextPx:16,measuredMinPx:null,failures:[],status:'pass',
  method:'No visible figure text. Actual 346px live-product probe and headed local product-fit inspection; not a renderer replay.',
})
rebound.contextRebind={
  schema:'ld-s10y-image/author-context-rebind@1',receipt:{path:contextReceiptPath,sha256:hash(contextReceiptPath)},
  originalNativeReport:{path:nativeReport,sha256:hash(nativeReport)},
  originalSpec:{path:initialSpec,sha256:hash(initialSpec)},
  unchangedProjectionSha256:projectionSha,rendererExecutedForRebind:false,
  authorDerivedMetadata:true,
}
write('frozen/fig-83.render.json',rebound)
command('native-spec-current','python3',[
  path.join(W,'.agents/skills/ld-s10y-image/scripts/validate_spec.py'),currentSpec,'--stage','rendered','--json',
])
for(const language of ['zh','en']) {
  const root=`context/current-${language}/root/10p`
  write(`${root}/figures/fig-83.png`,fs.readFileSync(path.join(A,'inputs/source/fig-83.png')))
  write(`${root}/editions/modern-us-neutral/lessons/${card}/lesson.json`,read(path.join(A,`inputs/current/${language}/lesson.template.json`)))
  write(`${root}/editions/modern-us-neutral/lessons/${card}/exercises.json`,read(path.join(A,`inputs/current/${language}/exercises.template.json`)))
  for(const file of ['fig-83.spec.json','fig-83.svg','fig-83.artwork.png','fig-83.render.json'])
    write(`${root}/editions/modern-us-neutral/figures/${file}`,fs.readFileSync(path.join(A,'frozen',file)))
  command(`native-context-current-${language}`,'python3',[
    path.join(W,'.agents/skills/ld-s10y-image/scripts/build_context.py'),
    '--book','10p','--edition','modern-us-neutral','--figure','fig-83',
    '--root',path.join(A,`context/current-${language}/root`),
    '--output',path.join(A,`context/current-${language}/native-context.json`),
  ])
  command(`offline-current-${language}`,'node',[
    path.join(W,'.claude/skills/ld-s10y-lesson/tools/render_lesson.js'),
    path.join(A,root),'--edition','modern-us-neutral','--lesson',card,
    '--out',path.join(A,`previews/current-native-${language}`),
  ])
}
function cryptoHash(value) {
  return createHash('sha256').update(value).digest('hex')
}
import { createHash } from 'node:crypto'
