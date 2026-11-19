import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import {spawnSync} from 'node:child_process'
const root='/Users/yong/.codex/worktrees/d9b1/lemmadeck'
const base='.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-author'
if(process.cwd()!==root) throw new Error('Wrong cwd')
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const canonical=file=>{
  const r=spawnSync('python3',['.agents/skills/ld-s10y-choice/scripts/prepare.py','digest',file],{cwd:root,encoding:'utf8'})
  if(r.status!==0) throw new Error(r.stderr)
  return r.stdout.trim()
}
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
  const name=path.join(dir,entry.name)
  if(entry.isSymbolicLink()) throw new Error('Unexpected symlink in owned artifacts')
  return entry.isDirectory()?walk(name):[name]
})
const files=walk(base).sort()
const receipts=files.filter(file=>file.startsWith(`${base}/receipts/`)&&file.endsWith('.json')).map(file=>({
  path:path.resolve(file),sha256:sha(file),...JSON.parse(fs.readFileSync(file,'utf8')),
}))
const primary=['seed.json','draft.json','view-only/view.json','source-solutions.md'].map(name=>{
  const file=`${base}/${name}`
  return {path:path.resolve(file),sha256:sha(file),canonical_sha256:name.endsWith('.json')?canonical(file):null}
})
const index={
  status:'author-only; mechanical checks passed; independent reviews pending',
  primary,
  manifest:{path:path.resolve(`${base}/package-manifest.json`),sha256:sha(`${base}/package-manifest.json`)},
  counts:JSON.parse(fs.readFileSync(`${base}/package-manifest.json`,'utf8')).counts,
  receipts,
  retained_first_failed_renders:files.filter(file=>/\/(?:spec|figure|preview|render)\.first\./.test(file)).map(file=>({path:path.resolve(file),sha256:sha(file)})),
  all_files:files.map(file=>({path:path.resolve(file),sha256:sha(file),bytes:fs.statSync(file).size})),
  semantic_review:'not performed; no review file or semantic self-approval',
}
const destination=`${base}/evidence-index.json`
fs.writeFileSync(destination,JSON.stringify(index,null,2)+'\n',{flag:'wx'})
console.log(JSON.stringify({
  evidence_index:{path:path.resolve(destination),sha256:sha(destination)},
  primary,counts:index.counts,
  receipts:receipts.length,
  exit_codes:receipts.reduce((result,r)=>({...result,[r.exit_code]:(result[r.exit_code]||0)+1}),{}),
  first_choice_validation:receipts.find(r=>r.path.endsWith('/structural-first.json')),
  first_projection_validation:receipts.find(r=>r.path.endsWith('/projection-first.json')),
},null,2))
