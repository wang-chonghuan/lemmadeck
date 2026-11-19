import fs from 'node:fs'
import {spawnSync} from 'node:child_process'
const root='/Users/yong/.codex/worktrees/d9b1/lemmadeck'
const base='.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-author'
if(process.cwd()!==root) throw new Error('Wrong cwd')
const requests=JSON.parse(fs.readFileSync(`${base}/figure-requests.json`,'utf8'))
const failures=[]
for(const r of requests) {
  const dir=r.spec_path.slice(0,r.spec_path.lastIndexOf('/'))
  for(const [name,first] of [['spec.json','spec.first.json'],['figure.svg','figure.first.svg'],['preview.png','preview.first.png'],['render.json','render.first.json']]) {
    if(fs.existsSync(`${dir}/${name}`)) fs.copyFileSync(`${dir}/${name}`,`${dir}/${first}`,fs.constants.COPYFILE_EXCL)
  }
  const spec=JSON.parse(fs.readFileSync(r.spec_path,'utf8'))
  for(let panel=1;panel<=2;panel++) {
    const prefix=`panel-${panel}`
    const ox=160+320*(panel-1)
    const o=id=>spec.objects.find(v=>v.id===`${prefix}-${id}`)
    o('heading').at=[ox,400]
    o('heading').fontSize=20
    o('y-title').at=[ox,360]
    o('y-axis').to=[ox,335]
    o('zero').at=[ox,25]
    o('zero').text='Origin (0,0)'
    o('zero').fontSize=18
    for(const [label,t] of [['minus',-1],['plus',1]]) {
      const tick=o(`x-tick-${label}`)
      tick.from=[ox+108*t,206]
      tick.to=[ox+108*t,214]
      o(`x-value-${label}`).at=[ox+108*t,185]
      o(`x-value-${label}`).text=String(1.5*t)
      const ytick=o(`y-tick-${label}`)
      ytick.from=[ox-4,210+120*t]
      ytick.to=[ox+4,210+120*t]
      const value=o(`y-value-${label}`)
      value.at=[ox-44,210+120*t]
      value.text=String(Number((Number(value.text)*3).toFixed(2)))
    }
    for(const a of spec.assertions.filter(v=>v.id.startsWith(prefix))) {
      if(a.id===`${prefix}-axis-perpendicular`) a.d=[ox,335]
      if(a.id===`${prefix}-y-axis-connects`) a.to=[ox,335]
      if(a.id.includes('-x-unit-')) {const t=a.id.endsWith('minus')?-1:1;a.to=[ox+108*t,210];a.dx=108*t}
      if(a.id.includes('-y-unit-')) {const t=a.id.endsWith('minus')?-1:1;a.to=[ox,210+120*t];a.dy=120*t}
    }
  }
  spec.source.authoredBasis=spec.source.authoredBasis
    .replace('ticks +/-1.73 and +/-14.8','ticks +/-5.19 and +/-44.4')
    .replace('axis ticks +/-1.73 and +/-14.8','axis ticks +/-5.19 and +/-44.4')
    + ' Layout repair only: x tick labels are +/-1.5, y ticks are +/-3 vertical base units (numeric +/-5.19 or +/-44.4; normalized +/-3); Origin (0,0) is captioned below. All curve segment coordinates are unchanged.'
  r.basis=spec.source.authoredBasis
  fs.writeFileSync(r.spec_path,JSON.stringify(spec,null,2)+'\n')
  const commands=[
    ['validate','python3','.agents/skills/ld-s10y-image/scripts/validate_spec.py',r.spec_path,'--stage','draft','--json'],
    ['render','node','.agents/skills/ld-s10y-image/scripts/render_spec.mjs','--spec',r.spec_path,'--svg',r.svg_path,'--png',r.preview_path,'--report',r.render_path],
  ]
  for(const [phase,...command] of commands) {
    const result=spawnSync('python3',[`${base}/capture.py`,`${r.id}-${phase}-repair1`,...command],{cwd:root,encoding:'utf8'})
    console.log(result.stdout)
    if(result.stderr) console.error(result.stderr)
    if(result.status!==0) {failures.push({id:r.id,phase,exit_code:result.status});break}
  }
}
fs.writeFileSync(`${base}/figure-requests.repair1.json`,JSON.stringify(requests,null,2)+'\n',{flag:'wx'})
console.log(JSON.stringify({figures:requests.length,failures},null,2))
process.exitCode=failures.length?2:0
