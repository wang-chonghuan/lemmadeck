import path from 'node:path'
import { A, hash, read, write } from './prepare.mjs'

const specPath = process.argv[2] || path.join(A, 'candidates/repair/fig-83.spec.json')
const reportName = process.argv[3] || 'receipts/source-geometry-author.json'
const spec = read(specPath)
const eps = 1e-7
const same = (a,b) => JSON.stringify(a) === JSON.stringify(b)
const distance = (a,b) => Math.hypot(a[0]-b[0],a[1]-b[1])
const average = points => points[0].map((_,i) => points.reduce((sum,p) => sum+p[i],0)/points.length)
const inside = (p,vertices) => {
  let result = false
  for (let i=0,j=vertices.length-1;i<vertices.length;j=i++) {
    const a=vertices[i],b=vertices[j]
    if ((a[1]>p[1]) !== (b[1]>p[1]) &&
      p[0] < (b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0]) result=!result
  }
  return result
}
function inspect(s) {
  const map = new Map(s.objects.map(o=>[o.id,o]))
  const rows=[]
  const check=(id,fact,fn)=>{
    let pass=false
    try { pass=Boolean(fn()) } catch {}
    rows.push({id,sourceRequirement:fact,status:pass?'PASS':'FAIL'})
  }
  check('source-binding','Original 457x305 PNG and independent SOURCE/RAW pass are hash-bound.',
    ()=>s.source.image.sha256===hash(s.source.image.path) &&
      read(path.join(A,'inputs/source-review.json')).status==='PASS')
  check('exact-two-forks','Two visible U forks, each with exactly two arms, one curved join, one stem and mount.',
    ()=>['left','right'].every(n=>['inner-arm','outer-arm','u-join','stem','mount'].every(p=>map.has(`${n}-fork-${p}`))) &&
      [...map.keys()].filter(id=>id.includes('-fork-')).length===10)
  for (const n of ['left','right']) {
    const arm1=()=>map.get(`${n}-fork-inner-arm`),arm2=()=>map.get(`${n}-fork-outer-arm`)
    const join=()=>map.get(`${n}-fork-u-join`),stem=()=>map.get(`${n}-fork-stem`)
    check(`${n}-u-connected`,'Both arm bottoms meet the U join; the stem starts at its lowest point.',
      ()=>[arm1(),arm2()].every(arm=>Math.abs(distance(arm.to,join().center)-18)<eps &&
        Math.abs(arm.to[1]-join().center[1])<eps) &&
        distance(stem().from,[join().center[0],join().center[1]-18])<eps)
    check(`${n}-mount-on-box`,'Fork stem and foot terminate on their own visible box top, not floating.',
      ()=>distance(stem().to,map.get(`${n}-fork-mount`).center)<eps &&
        inside(stem().to,map.get(`${n}-box-top`).points))
    check(`${n}-opening-contained`,'Text-bound inward opening remains entirely within the inward end face.',
      ()=>map.get(`${n}-box-opening`).points.every(p=>inside(p,map.get(`${n}-box-inward-end`).points)))
    check(`${n}-opening-at-inward-end`,'Opening is at the end facing the other box, not on the long front or outer end.',
      ()=>{
        const front=map.get(`${n}-box-front`).points,end=map.get(`${n}-box-inward-end`).points
        const opening=average(map.get(`${n}-box-opening`).points),cx=average(front)[0]
        return n==='left' ? opening[0]>cx && Math.min(...end.map(p=>p[0]))===Math.max(...front.map(p=>p[0]))
          : opening[0]<cx && Math.max(...end.map(p=>p[0]))===Math.min(...front.map(p=>p[0]))
      })
  }
  check('identical-fork-shape','Congruent fork arms, join, stem and mounting geometry, not only equal object counts.',
    ()=>['inner-arm','outer-arm'].every(p=>{
      const l=map.get(`left-fork-${p}`),r=map.get(`right-fork-${p}`)
      return Math.abs(distance(l.from,l.to)-distance(r.from,r.to))<eps
    }) && ['u-join','mount'].every(p=>{
      const l=map.get(`left-fork-${p}`),r=map.get(`right-fork-${p}`)
      return distance([l.center[0]+420,l.center[1]],r.center)<eps && l.radius===r.radius
    }) && distance([map.get('left-fork-stem').from[0]+420,map.get('left-fork-stem').from[1]],map.get('right-fork-stem').from)<eps)
  check('mirror-boxes','Comparable boxes; top, inward ends and openings are mirrored deterministic views.',
    ()=>['top','inward-end','opening'].every(p=>{
      const lp=map.get(`left-box-${p}`).points.map(q=>[760-q[0],q[1]])
      const rp=map.get(`right-box-${p}`).points
      return lp.every(q=>rp.some(r=>distance(q,r)<eps))
    }))
  check('separate-air-gap','The assemblies remain separated, with a clear air gap and no shared box.',
    ()=>Math.max(...map.get('left-box-top').points.map(p=>p[0])) <
      Math.min(...map.get('right-box-top').points.map(p=>p[0])))
  check('hammer-identity','Exactly one transverse hammer head and one connected diagonal handle, no hand.',
    ()=>map.get('hammer-head').type==='polygon' && map.get('hammer-handle').type==='segment' &&
      inside(map.get('hammer-handle').from,map.get('hammer-head').points))
  check('hammer-at-one-arm','Head is beside the right fork outer arm, with a visible gap, not between the assemblies.',
    ()=>{
      const p=average(map.get('hammer-head').points),arm=map.get('right-fork-outer-arm')
      const headWidth=Math.max(...map.get('hammer-head').points.map(p=>p[0]))-Math.min(...map.get('hammer-head').points.map(p=>p[0]))
      return p[0]>arm.from[0] && p[1]<arm.from[1] && p[1]>arm.to[1] &&
        p[0]-arm.from[0]<headWidth*1.5 &&
        Math.min(...map.get('hammer-head').points.map(p=>p[0]))-arm.from[0]>9/2
    })
  check('no-extra-experiment','No later clip, hand, connector, sound-wave effect, arrow, label, value, scale or answer annotation.',
    ()=>s.objects.every(o=>!['arrow','text','measure','grid','axis','point'].includes(o.type) &&
      !o.label && !o.text && !/(?:^|-)(?:clip|hand|wave|connector|frequency)(?:-|$)/.test(o.id)))
  check('artwork-limited-to-material','Four contained aspect-preserving wood panels; generated pixels own no apparatus geometry.',
    ()=>s.objects.filter(o=>o.type==='image').length===4 &&
      s.objects.filter(o=>o.type==='image').every(o=>{
        const n=o.id.split('-')[0],box=map.get(`${n}-box-front`).points
        return o.asset==='wood-material' && Math.abs(o.size[0]/o.size[1]-1.5)<eps &&
          [o.at,[o.at[0]+o.size[0],o.at[1]+o.size[1]]].every(p=>
            p[0]>=Math.min(...box.map(p=>p[0])) && p[0]<=Math.max(...box.map(p=>p[0])) &&
            p[1]>=Math.min(...box.map(p=>p[1])) && p[1]<=Math.max(...box.map(p=>p[1])))
      }))
  check('complete-two-box-faces','Two complete box front/top/inward end/opening constructions, no solid blank replacement.',
    ()=>['left','right'].every(n=>['front','top','inward-end','opening'].every(p=>map.get(`${n}-box-${p}`).type==='polygon')))
  return rows
}
const tests=inspect(spec)
const negativeControls=[]
for (const [name,mutate] of [
  ['missing-left-arm',s=>{s.objects=s.objects.filter(o=>o.id!=='left-fork-inner-arm')}],
  ['mismatched-fork',s=>{s.objects.find(o=>o.id==='right-fork-outer-arm').to[1]+=20}],
  ['outward-aperture',s=>{s.objects.find(o=>o.id==='right-box-opening').points.forEach(p=>p[0]+=190)}],
  ['hammer-in-gap',s=>{s.objects.find(o=>o.id==='hammer-head').points.forEach(p=>p[0]-=260)}],
  ['invented-clip',s=>{s.objects.push({id:'metal-clip',type:'polygon',points:[[1,1],[2,1],[1,2]]})}],
]) {
  const altered=structuredClone(spec)
  mutate(altered)
  const failures=inspect(altered).filter(r=>r.status==='FAIL')
  negativeControls.push({name,rejected:failures.length>0,failedAssertions:failures.map(r=>r.id),mutatedImageWritten:false})
}
write(reportName,{
  schema:'ld-s10y-image/source-geometry-author-check@1',independentReview:false,
  source:spec.source.image,spec:{path:specPath,sha256:hash(specPath)},
  inventory:{path:path.join(A,'source-inventory.json'),sha256:hash(path.join(A,'source-inventory.json'))},
  tests,negativeControls,status:tests.every(r=>r.status==='PASS') && negativeControls.every(r=>r.rejected)?'PASS':'FAIL',
  rationale:'Assertions derive the source apparatus parts and qualitative relationships, and use the complete edition text for obscured inward openings. Canvas lengths and thresholds are author composition choices, not invented physical measurements.',
  geometryReplay:false,
})
console.log(JSON.stringify({tests:tests.length,status:tests.every(r=>r.status==='PASS')?'PASS':'FAIL',failures:tests.filter(r=>r.status==='FAIL')}))
