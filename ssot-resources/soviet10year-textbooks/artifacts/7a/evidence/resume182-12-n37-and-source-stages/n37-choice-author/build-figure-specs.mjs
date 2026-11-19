import fs from 'node:fs'
const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck'
const base = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-author'
if (process.cwd() !== root) throw new Error('Wrong cwd')
const seed = JSON.parse(fs.readFileSync(`${base}/seed.json`, 'utf8'))
const plans = [
  {id:'cubic-A', source:'794', question:'q27', option:'A', basis:'Deliberate exchange: the panel labelled y=x^3 draws -x^3, and the panel labelled y=-x^3 draws x^3. Each odd cubic has origin (0,0), x unit 72 canvas units, y unit 40 canvas units; sampled x in [-1.5,1.5].', panels:[['y = x^3',3,-1,1],['y = -x^3',3,1,1]]},
  {id:'cubic-B', source:'794', question:'q27', option:'B', basis:'Independently derived cubic pair: y=x^3 is increasing through (-1,-1),(0,0),(1,1); y=-x^3 is its x-axis reflection. x unit 72 and y unit 40 canvas units. Finite window x in [-1.5,1.5], not a domain restriction.', panels:[['y = x^3',3,1,1],['y = -x^3',3,-1,1]]},
  {id:'cubic-C', source:'794', question:'q27', option:'C', basis:'Deliberate linear substitutes y=x and y=-x under the cubic formula headings. Origins and (+/-1,+/-1) agree but the curvature, growth at +/-1.5 and tangent at zero differ. x unit 72 and y unit 40 canvas units.', panels:[['y = x^3',1,1,1],['y = -x^3',1,-1,1]]},
  {id:'cubic-D', source:'794', question:'q27', option:'D', basis:'Deliberate even-power substitutes y=x^2 and y=-x^2 under cubic formula headings. They turn at zero and have equal values at opposite x, unlike the source cubics. x unit 72 and y unit 40 canvas units.', panels:[['y = x^3',2,1,1],['y = -x^3',2,-1,1]]},
  {id:'quadratic-A', source:'795', question:'q28', option:'A', basis:'Deliberately reflected numeric pair: y=1.73x^2 heading draws -1.73x^2, and y=-14.8x^2 heading draws +14.8x^2. Actual y axes have ticks +/-1.73 and +/-14.8. Independent panel vertical units are 40/1.73 and 40/14.8 canvas units per y unit. x unit 72. Thus wrong coefficient signs, not hidden changed scales, produce the wrong orientations.', panels:[['y = 1.73x^2',2,-1,1.73],['y = -14.8x^2',2,1,14.8]]},
  {id:'quadratic-B', source:'795', question:'q28', option:'B', basis:'Parameter pair normalized by the visibly labelled y/|a| axis. For a>0 draw +x^2; for a<0 draw -x^2, both at origin. No fixed value of a is introduced. x unit 72 and normalized vertical unit 40 canvas units. Values at +/-1 are +/-1 and at +/-1.5 are +/-2.25 in normalized units.', panels:[['y = ax^2, a > 0',2,1,1,'y/|a|'],['y = ax^2, a < 0',2,-1,1,'y/|a|']]},
  {id:'quadratic-C', source:'795', question:'q28', option:'C', basis:'Deliberate negative normalized parabola under both parameter headings. The a>0 panel is wrong (draws y/|a|=-x^2); the a<0 panel retains its correct -x^2. Normalized y/|a| axes visibly prevent inventing a fixed parameter. Both origins are zero, x unit 72 and normalized vertical unit 40.', panels:[['y = ax^2, a > 0',2,-1,1,'y/|a|'],['y = ax^2, a < 0',2,-1,1,'y/|a|']]},
  {id:'quadratic-D', source:'795', question:'q28', option:'D', basis:'Independent numeric pair y=1.73x^2 and y=-14.8x^2, vertex (0,0), values at +/-1 are 1.73 and -14.8. Actual y axis ticks +/-1.73 and +/-14.8, respectively; panel vertical units 40/1.73 and 40/14.8. Both x units are 72 canvas units. Finite x window [-1.5,1.5].', panels:[['y = 1.73x^2',2,1,1.73],['y = -14.8x^2',2,-1,14.8]]},
]
const requests = []
for (const plan of plans) {
  const id = `fig-choice-n37-${plan.id}`
  const dir = `${base}/figures/${id}`
  fs.mkdirSync(dir, {recursive:true})
  const objects = []
  const assertions = []
  const inventory = []
  const text = (id, at, content, fontSize=18) => ({id,type:'text',at,text:content,fontSize,fontWeight:500,labelPlacement:{position:'CENTER',offset:[0,0]}})
  plan.panels.forEach(([heading,power,sign,yMagnitude,verticalLabel='y'],index) => {
    const p = `panel-${index+1}`
    const ox = 160 + 320*index
    const oy = 210
    const sx = 72
    const sy = 40
    const panelObjects = [
      text(`${p}-heading`,[ox,395],heading,22),
      {id:`${p}-x-axis`,type:'arrow',from:[ox-125,oy],to:[ox+125,oy],stroke:'muted',strokeWidth:1.5},
      {id:`${p}-y-axis`,type:'arrow',from:[ox,60],to:[ox,355],stroke:'muted',strokeWidth:1.5},
      text(`${p}-x-title`,[ox+137,oy],'x'),
      text(`${p}-y-title`,[ox,370],verticalLabel,18),
      text(`${p}-zero`,[ox-20,oy-15],'0',16),
    ]
    const panelAssertions = [
      {id:`${p}-axis-perpendicular`,type:'perpendicular',a:[ox-125,oy],b:[ox+125,oy],c:[ox,60],d:[ox,355]},
      {id:`${p}-x-axis-connects`,type:'connects',arrow:`${p}-x-axis`,from:[ox-125,oy],to:[ox+125,oy]},
      {id:`${p}-y-axis-connects`,type:'connects',arrow:`${p}-y-axis`,from:[ox,60],to:[ox,355]},
    ]
    for (const t of [-1,1]) {
      const label = t === -1 ? 'minus' : 'plus'
      panelObjects.push(
        {id:`${p}-x-tick-${label}`,type:'segment',from:[ox+sx*t,oy-4],to:[ox+sx*t,oy+4],stroke:'muted',strokeWidth:1.5},
        text(`${p}-x-value-${label}`,[ox+sx*t,oy-25],String(t),18),
        {id:`${p}-y-tick-${label}`,type:'segment',from:[ox-4,oy+sy*t],to:[ox+4,oy+sy*t],stroke:'muted',strokeWidth:1.5},
        text(`${p}-y-value-${label}`,[ox-44,oy+sy*t],String(t*yMagnitude),18),
      )
      panelAssertions.push(
        {id:`${p}-x-unit-${label}`,type:'displacement',from:[ox,oy],to:[ox+sx*t,oy],dx:sx*t,dy:0},
        {id:`${p}-y-unit-${label}`,type:'displacement',from:[ox,oy],to:[ox,oy+sy*t],dx:0,dy:sy*t},
      )
    }
    // Sampling is deterministic geometry, not question/option generation.
    for (let n=0;n<64;n++) {
      const t0=-1.5+3*n/64
      const t1=-1.5+3*(n+1)/64
      const from=[ox+sx*t0,oy+sy*sign*t0**power]
      const to=[ox+sx*t1,oy+sy*sign*t1**power]
      const segmentId=`${p}-curve-${n}`
      panelObjects.push({id:segmentId,type:'segment',from,to,stroke:'ink',strokeWidth:3})
      panelAssertions.push(
        {id:`${segmentId}-connects`,type:'connects',arrow:segmentId,from,to},
        {id:`${segmentId}-start-value`,type:'displacement',from:[ox,oy],to:from,dx:sx*t0,dy:sy*sign*t0**power},
        {id:`${segmentId}-end-value`,type:'displacement',from:[ox,oy],to,dx:sx*t1,dy:sy*sign*t1**power},
      )
    }
    objects.push(...panelObjects)
    assertions.push(...panelAssertions)
    inventory.push({id:p,description:`Authored ${heading}: actual drawn vertical coordinate ${sign}*x^${power}${verticalLabel==='y/|a|' ? ' in y/|a| normalization' : ` scaled by ${yMagnitude}`}. Visible headings are task labels, not assertions that distractor curves satisfy them. Every finite segment and axis is mapped to exact endpoint assertions.`,objects:panelObjects.map(o=>o.id),assertions:panelAssertions.map(a=>a.id)})
  })
  const spec = {
    schema:'ld-s10y-image/figure-spec@2',id,mode:'deterministic',
    description:`Completed two-function candidate for ${plan.question} option ${plan.option}.`,
    source:{authoredBasis:plan.basis,authoritativeText:[{lesson:'alg7-c4-s2-n37',exercise:plan.source,text:seed.exercises.find(e=>e.number===plan.source).text}],inventory},
    canvas:{width:640,height:420,boundingBox:[0,420,640,0],background:'paper',keepAspectRatio:true},
    display:{layout:'scroll',purpose:'instructional',minTextPx:16,widths:[640]},
    objects,assertions,
  }
  fs.writeFileSync(`${dir}/spec.json`,JSON.stringify(spec,null,2)+'\n',{flag:'wx'})
  requests.push({id,question_id:plan.question,option_id:plan.option,source_number:plan.source,basis:plan.basis,spec_path:`${dir}/spec.json`,svg_path:`${dir}/figure.svg`,preview_path:`${dir}/preview.png`,render_path:`${dir}/render.json`,independent_review:'pending; parent assigns review of rendered bytes against authoredBasis and deliberate alternatives'})
}
fs.writeFileSync(`${base}/figure-requests.json`,JSON.stringify(requests,null,2)+'\n',{flag:'wx'})
console.log(`Wrote ${requests.length} deterministic authoredBasis specs; no source image fabricated and no choices generated.`)
