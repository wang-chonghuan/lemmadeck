import fs from 'node:fs'
import crypto from 'node:crypto'
const root='/Users/yong/.codex/worktrees/d9b1/lemmadeck'
const base='.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-author'
if(process.cwd()!==root) throw new Error('Wrong cwd')
const file=`${base}/package-manifest.json`
fs.copyFileSync(file,`${base}/package-manifest.first.json`,fs.constants.COPYFILE_EXCL)
const manifest=JSON.parse(fs.readFileSync(file,'utf8'))
const coverage=JSON.parse(fs.readFileSync(`${base}/task-coverage.json`,'utf8'))
manifest.counts.original_subparts=coverage.reduce((sum,row)=>sum+row.tasks.filter(t=>t.task!=='proof').length,0)
manifest.counts.unlettered_proof_tasks=coverage.reduce((sum,row)=>sum+row.tasks.filter(t=>t.task==='proof').length,0)
manifest.counts.original_tasks=manifest.counts.original_subparts+manifest.counts.unlettered_proof_tasks
manifest.counts.count_note='100 lettered subparts plus the unlettered proof of source 798; frozen introductory shorthand is clarified without changing solutions.'
const note=`${base}/count-reconciliation.md`
manifest.files.push({path:note,sha256:crypto.createHash('sha256').update(fs.readFileSync(note)).digest('hex'),canonical_sha256:null})
fs.writeFileSync(file,JSON.stringify(manifest,null,2)+'\n')
console.log(JSON.stringify(manifest.counts,null,2))
