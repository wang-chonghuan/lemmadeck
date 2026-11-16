import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const root=path.dirname(fileURLToPath(import.meta.url));
const rel=path.relative(process.cwd(),root);
if(fs.existsSync(path.join(root,'validation-result.json')))throw new Error('Structural already recorded; do not rerun');
const args=['.agents/skills/ld-s10y-choice/scripts/validate.py','--repo','.','--seed',`${rel}/seed.json`,'--draft',`${rel}/draft.json`];
const result=spawnSync('python3',args,{encoding:'utf8'});
fs.writeFileSync(path.join(root,'validation-result.json'),JSON.stringify({
  command:['python3',...args],execution_count:1,exit_code:result.status,stdout:result.stdout,stderr:result.stderr,
  structural_only:true,canonical_review_run:false,timestamp:new Date().toISOString(),
},null,2)+'\n');
if(result.status!==0)throw new Error(`Structural exit ${result.status}; evidence retained`);
const draft=JSON.parse(fs.readFileSync(path.join(root,'draft.json'),'utf8'));
const source=JSON.parse(fs.readFileSync(path.join(root,'source-solutions.json'),'utf8'));
fs.writeFileSync(path.join(root,'view.json'),JSON.stringify({
  questions:draft.questions.map(({id,source_numbers,view})=>({id,source_numbers,view})),
},null,2)+'\n');
const files={};
for(const name of ['seed.json','draft.json','view.json','source-solutions.json','validation-result.json','asset-capture.json']){
  const filename=path.join(root,name);
  const digest=spawnSync('python3',['.agents/skills/ld-s10y-choice/scripts/prepare.py','digest',filename],{encoding:'utf8'});
  if(digest.status!==0)throw new Error('Digest failed');
  files[name]={path:`${rel}/${name}`,canonical_sha256:digest.stdout.trim(),byte_sha256:createHash('sha256').update(fs.readFileSync(filename)).digest('hex')};
}
const ready={
  lesson:source.lesson,stage:'authored-frozen-awaiting-independent-pure-view-review',approved:false,
  source_count:source.sources.length,question_count:draft.questions.length,option_count:draft.questions.reduce((n,q)=>n+q.view.options.length,0),
  source_stage_complete_before_options:true,source_blockers:source.source_blockers,notices:source.notices,
  structural_execution_count:1,structural_exit:0,canonical_review_count:0,
  actual_assets_opened:source.figure_observations,pure_view_shape:'{questions:[{id,source_numbers,view}]}',
  files,model:null,usage:null,browser_in_flight:false,user_ui_used:false,
};
fs.writeFileSync(path.join(root,'ready.json'),JSON.stringify(ready,null,2)+'\n');
console.log(JSON.stringify(ready,null,2));
