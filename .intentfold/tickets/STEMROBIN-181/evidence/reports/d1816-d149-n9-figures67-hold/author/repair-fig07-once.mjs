import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const home = path.join(repo,'.intentfold/tickets/STEMROBIN-181/tmp/d1816-d149-n9-figures-author');
const original = path.join(repo,'.tmp/STEMROBIN-181/d1816-d149/figures/fig-07/candidate-1/spec.json');
const spec = JSON.parse(fs.readFileSync(original,'utf8'));
const dir = path.join(repo,'.tmp/STEMROBIN-181/d1816-d149/figures/fig-07/candidate-2');
assert(!fs.existsSync(dir), 'Sole content repair already used');
const particlesBefore = JSON.stringify(spec.objects.filter(o=>o.type==='point'));
const objects = new Map(spec.objects.map(o=>[o.id,o]));
objects.get('after-gas-space').points[2][1] = 147;
objects.get('after-gas-space').points[3][1] = 147;
objects.get('after-piston').points.forEach((p,i)=>{p[1]=i<2?147:177;});
objects.get('after-rod').points[0][1] = 177;
objects.get('after-rod').points[1][1] = 177;
const horizontal = spec.assertions.find(a=>a.id==='after-horizontal-piston');
horizontal.a[1] = 147;
horizontal.b[1] = 147;
assert.equal(JSON.stringify(spec.objects.filter(o=>o.type==='point')),particlesBefore);
fs.mkdirSync(dir,{recursive:true});
const output = path.join(dir,'spec.json');
fs.writeFileSync(output,`${JSON.stringify(spec,null,2)}\n`,{flag:'wx'});
const digest = p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
fs.writeFileSync(path.join(home,'fig-07.content-repair-1.json'),`${JSON.stringify({
  figure:'fig-07',contentRepair:1,maximumContentRepairs:1,
  cause:'First validation: top-row particle anchors collided with the too-low modern piston underside; after-particle-04 was outside the declared gas region.',
  change:'Raise the after-piston underside from 139 to 147 and its top from 169 to 177; shorten its rod accordingly. The original source piston underside mapped with the particle transform is about 151.3, so the correction moves toward source apparatus proportions while keeping ample molecular clearance.',
  unchanged:'All 32 particle centers/radii/fills, both frames, before apparatus, all text, source inventory, complete bilingual text, no arrows, no calibration.',
  firstFailure:{path:path.join(home,'native/d149-fig07-validate-first/stdout.txt'),sha256:digest(path.join(home,'native/d149-fig07-validate-first/stdout.txt'))},
  firstCandidate:{path:original,sha256:digest(original)},
  repairedCandidate:{path:output,sha256:digest(output)},
  independentApproval:false,
},null,2)}\n`,{flag:'wx'});
console.log(JSON.stringify({status:'SOLE_CONTENT_REPAIR_AUTHORED',figure:'fig-07',output}));
