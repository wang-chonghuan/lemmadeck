import fs from 'node:fs'
import {spawnSync} from 'node:child_process'
const root='/Users/yong/.codex/worktrees/d9b1/lemmadeck'
const base='.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-author'
if(process.cwd()!==root) throw new Error('Wrong cwd')
const requests=JSON.parse(fs.readFileSync(`${base}/figure-requests.json`,'utf8'))
const failures=[]
for(const r of requests) {
  const commands=[
    ['validate','python3','.agents/skills/ld-s10y-image/scripts/validate_spec.py',r.spec_path,'--stage','draft','--json'],
    ['render','node','.agents/skills/ld-s10y-image/scripts/render_spec.mjs','--spec',r.spec_path,'--svg',r.svg_path,'--png',r.preview_path,'--report',r.render_path],
  ]
  for(const [phase,...command] of commands) {
    const result=spawnSync('python3',[`${base}/capture.py`,`${r.id}-${phase}-first`,...command],{cwd:root,encoding:'utf8'})
    console.log(result.stdout)
    if(result.stderr) console.error(result.stderr)
    if(result.status!==0) {failures.push({id:r.id,phase,exit_code:result.status});break}
  }
}
console.log(JSON.stringify({figures:requests.length,failures},null,2))
process.exitCode=failures.length?2:0
