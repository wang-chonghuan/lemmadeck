import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(),repo);
const home = path.join(repo,'.intentfold/tickets/STEMROBIN-181/tmp/d1816-d149-n9-figures-author');
const original = path.join(repo,'.tmp/STEMROBIN-181/d1816-d149/figures/fig-06/candidate-1/spec.json');
const spec = JSON.parse(fs.readFileSync(original,'utf8'));
const dir = path.join(repo,'.tmp/STEMROBIN-181/d1816-d149/figures/fig-06/candidate-2');
assert(!fs.existsSync(dir),'Sole content repair already used');
const objects = new Map(spec.objects.map(o=>[o.id,o]));
const leg = 'left-middle-free-motion-leg-2';
const trail = objects.get(`${leg}-trail`);
const direction = objects.get(`${leg}-direction`);
direction.from = [...trail.from];
direction.to = [...trail.to];
const connects = spec.assertions.find(a=>a.id===`${leg}-directed`);
connects.from = [...direction.from];
connects.to = [...direction.to];
const aligned = spec.assertions.find(a=>a.id===`${leg}-aligned`);
aligned.b = [...direction.to];
fs.mkdirSync(dir,{recursive:true});
const output = path.join(dir,'spec.json');
fs.writeFileSync(output,`${JSON.stringify(spec,null,2)}\n`,{flag:'wx'});
const digest = p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
fs.writeFileSync(path.join(home,'fig-06.content-repair-1.json'),`${JSON.stringify({
  figure:'fig-06',contentRepair:1,maximumContentRepairs:1,
  cause:'First renderer threw Unsupported arrow marker aspect ratio on the source short outgoing upper-right leg at particle 8. Its centered arrow shaft was only about 5.9 px.',
  change:'Use the full approximately 19.6 px source leg for that one arrow shaft. The original direction, line endpoints, count, particle geometry and all other arrows remain unchanged.',
  firstCandidate:{path:original,sha256:digest(original)},
  firstFailure:{path:path.join(home,'native/d149-fig06-render-first/stderr.txt'),sha256:digest(path.join(home,'native/d149-fig06-render-first/stderr.txt'))},
  repairedCandidate:{path:output,sha256:digest(output)},
  checkerEdited:false,svgHandEdited:false,independentApproval:false,
},null,2)}\n`,{flag:'wx'});
console.log(JSON.stringify({status:'SOLE_CONTENT_REPAIR_AUTHORED',figure:'fig-06',output}));
