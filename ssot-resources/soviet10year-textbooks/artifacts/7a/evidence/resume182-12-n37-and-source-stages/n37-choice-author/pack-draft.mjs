import fs from 'node:fs'
import crypto from 'node:crypto'
import {spawnSync} from 'node:child_process'
const root='/Users/yong/.codex/worktrees/d9b1/lemmadeck'
const base='.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-author'
if(process.cwd()!==root) throw new Error('Wrong cwd')
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'))
const write=(file,value)=>fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n',{flag:'wx'})
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const canonicalHash=file=>{
  const p=spawnSync('python3',['.agents/skills/ld-s10y-choice/scripts/prepare.py','digest',file],{cwd:root,encoding:'utf8'})
  if(p.status!==0) throw new Error(p.stderr)
  return p.stdout.trim()
}
const seed=read(`${base}/seed.json`)
const authored=read(`${base}/authored-questions.json`)
const freeze=read(`${base}/source-solutions.freeze.json`)
if(hash(`${base}/source-solutions.md`)!==freeze.sha256) throw new Error('Frozen solutions changed')
const sections=new Map()
let number=null
for(const line of fs.readFileSync(`${base}/source-solutions.md`,'utf8').split('\n')) {
  const heading=/^## (\d+)$/.exec(line)
  if(heading) {number=heading[1];sections.set(number,[])}
  else if(number) sections.get(number).push(line)
}
const requests=read(`${base}/figure-requests.repair1.json`)
const observations=read(`${base}/image-observations.authored.json`)
const imageLog=observations.map((o,index)=>{
  const r=requests.find(r=>r.id===o.figure_id)
  const report=read(r.render_path)
  if(report.status!=='pass' || report.spec.sha256!==hash(r.spec_path) || report.output.svg.sha256!==hash(r.svg_path)) throw new Error(`Unbound figure ${r.id}`)
  return {open_index:index+1,batch:1,figure_id:r.id,asset_opened:r.preview_path,asset_sha256:hash(r.preview_path),registered_svg:r.svg_path,registered_svg_sha256:hash(r.svg_path),observation:o.observation}
})
const questions=authored.map(q=>({
  id:q.id,source_numbers:[q.source],
  view:{mode:q.mode,stem:q.stem,figure_ids:[],options:q.options.map(o=>({id:o.id,text:o.text,figure_ids:o.figures||[]}))},
  intent:{task:q.task,source_solution:sections.get(q.source).join('\n').trim(),unit_reason:q.unit,concept_blocks:q.concepts,limitations:q.limitations,figure_observations:q.options.flatMap(o=>(o.figures||[]).map(id=>({figure_id:id,observation:observations.find(v=>v.figure_id===id).observation})))},
  key:{correct:q.options.filter(o=>o.truth==='correct').map(o=>o.id),rationales:q.options.map(o=>({option_id:o.id,truth:o.truth,derivation:o.derivation,misconception:o.misconception}))},
}))
const taskCoverage=seed.exercises.map(e=>{
  const letters=[...e.text.matchAll(/^([a-i])\)/gm)].map(m=>m[1])
  const expected=letters.length?letters:['proof']
  const qs=authored.filter(q=>q.source===e.number)
  const actual=qs.flatMap(q=>q.subparts)
  if(actual.length!==expected.length || new Set(actual).size!==actual.length || expected.some(t=>!actual.includes(t))) throw new Error(`Incomplete or repeated source tasks ${e.number}`)
  return {
    source_number:e.number,
    printed_number:e.text.match(/^(\d+)\./)?.[1],
    tasks:expected.map(task=>({task,question_ids:qs.filter(q=>q.subparts.includes(task)).map(q=>q.id)})),
    production_losses:[...new Set(qs.flatMap(q=>q.limitations))],
    deferred_mathematical_tasks:[],
    special_note:e.number==='790'?'Original illustrative format examples remain in source_text, but are not requested tasks. No answer key or squares table was read; six actual tasks are represented by scaled-square derivation recognition.':null,
  }
})
const coverage=taskCoverage.map(row=>({
  source_number:row.source_number,
  question_ids:questions.filter(q=>q.source_numbers.includes(row.source_number)).map(q=>q.id),
  omitted_tasks:row.production_losses,
  reason:`All ${row.tasks.length} original mathematical tasks are represented. ${authored.filter(q=>q.source===row.source_number).map(q=>`${q.id}: ${q.unit}`).join(' ')} Losses listed are production/lookup limitations, not silent omission of computations or graphs; independent fidelity review is pending.`,
}))
const draft={
  schema:'s10y-choice-draft-v1',seed_sha256:canonicalHash(`${base}/seed.json`),
  new_figures:requests.map(r=>({id:r.id,path:r.svg_path,sha256:hash(r.svg_path),basis:r.basis})),
  questions,coverage,
}
write(`${base}/draft.json`,draft)
write(`${base}/task-coverage.json`,taskCoverage)
write(`${base}/image-opens.json`,{initial_context_images:0,image_opens:8,batch_count:1,batch_limit:8,context_limit:24,other_image_opens:0,independent_review:false,opens:imageLog})
fs.mkdirSync(`${base}/view-only/public-figures`,{recursive:true})
const publicFigures=requests.map(r=>{
  const publicPath=`${base}/view-only/public-figures/${r.id}.svg`
  fs.copyFileSync(r.svg_path,publicPath,fs.constants.COPYFILE_EXCL)
  return {id:r.id,path:publicPath,sha256:hash(publicPath)}
})
write(`${base}/view-only/view.json`,{questions:questions.map(({id,view})=>({id,view})),figures:publicFigures})
const keys={A:0,B:0,C:0,D:0}
for(const q of questions) for(const k of q.key.correct) keys[k]++
const files=['seed.json','draft.json','view-only/view.json','source-solutions.md','source-solutions.freeze.json','authored-questions.initial.json','authored-questions.json','author-repairs.md','task-coverage.json','image-opens.json']
const packageManifest={
  stage:'author-only offline handoff; independent reviews pending',
  cwd:root,owned_directory:base,book:'7a',lesson:'alg7-c4-s2-n37',
  counts:{source_exercises:seed.exercises.length,original_subparts:taskCoverage.reduce((n,r)=>n+r.tasks.filter(t=>t.task!=='proof').length,0),unlettered_proof_tasks:taskCoverage.reduce((n,r)=>n+r.tasks.filter(t=>t.task==='proof').length,0),original_tasks:taskCoverage.reduce((n,r)=>n+r.tasks.length,0),questions:questions.length,single:questions.filter(q=>q.view.mode==='single').length,multiple:questions.filter(q=>q.view.mode==='multiple').length,options:questions.reduce((n,q)=>n+q.view.options.length,0),concept_blocks:seed.concepts.map(c=>c.block),source_figures:seed.figures.length,new_figures:requests.length,image_opens:8,key_position_totals:keys},
  files:files.map(name=>({path:`${base}/${name}`,sha256:hash(`${base}/${name}`),canonical_sha256:name.endsWith('.json')?canonicalHash(`${base}/${name}`):null})),
  new_figures:requests.map(r=>({id:r.id,question_id:r.question_id,option_id:r.option_id,basis:r.basis,spec:{path:r.spec_path,sha256:hash(r.spec_path)},render:{path:r.render_path,sha256:hash(r.render_path),status:read(r.render_path).status},asset:{path:r.svg_path,sha256:hash(r.svg_path)},preview:{path:r.preview_path,sha256:hash(r.preview_path)},public_asset:publicFigures.find(f=>f.id===r.id),independent_review:'not run; pending parent-assigned independent reviewer'})),
  boundaries:{git_writes:0,db:0,network:0,model_services:0,app_changes:0,dependency_changes:0,promotion:0,semantic_self_approval:false,independent_reviews_dispatched:0},
}
write(`${base}/package-manifest.json`,packageManifest)
console.log(JSON.stringify({counts:packageManifest.counts,files:packageManifest.files},null,2))
