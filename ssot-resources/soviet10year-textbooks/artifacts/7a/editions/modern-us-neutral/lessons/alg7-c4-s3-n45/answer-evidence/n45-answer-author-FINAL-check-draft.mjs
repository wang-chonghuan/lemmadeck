import assert from "node:assert/strict";
import { readFileSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const working = dirname(fileURLToPath(import.meta.url));
const owner = dirname(working);
const repo = resolve(owner, "../../../../../..");
assert.equal(repo, "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
assert.equal(relative(repo, owner), ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n45-answer-author");
const base = resolve(owner, "..");
const sourceBook = join(base, "n45-source-stage/artifacts/7a");
const lessonDir = join(sourceBook, "editions/modern-us-neutral/lessons/alg7-c4-s3-n45");
const durableBook = join(repo, "ssot-resources/soviet10year-textbooks/artifacts/7a");
const durableFigures = join(durableBook, "editions/modern-us-neutral/figures");
const templatePath = join(base, "n45-adapt-work/7a/modern-us-neutral/lessons/alg7-c4-s3-n45/answer-keys.template.json");
const prepReceiptPath = join(base, "stages/n45-answer-prepare-FIRST.receipt.json");
const json = (p) => JSON.parse(readFileSync(p, "utf8"));
const sha = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");
const output = (name, value) => {
  const p = join(working, name);
  assert.ok(p.startsWith(`${owner}/`));
  writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`);
};
const near = (actual, expected, label, tolerance = 1e-9) => {
  assert.ok(Number.isFinite(actual) && Number.isFinite(expected), `${label}: nonfinite`);
  assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(actual), Math.abs(expected)),
    `${label}: ${actual} != ${expected}`);
};

const exercises = json(join(lessonDir, "exercises.json"));
const template = json(templatePath);
const solutions = json(join(working, "source-solutions.json"));
const draftPath = join(working, "answer-keys.json");
const draft = json(draftPath);
const ids = exercises.exercises.map((e) => e.number);
assert.equal(exercises.count, 19);
assert.deepEqual(ids, Array.from({ length: 19 }, (_, i) => String(873 + i)));
assert.deepEqual(template.answers.map((a) => a.exercise), ids);
assert.deepEqual(solutions.solutions.map((s) => s.exercise), ids);
assert.deepEqual(draft.answers.map((a) => a.exercise), ids);
assert.deepEqual(solutions.answerSourcesRead, []);
assert.equal(draft.status, "draft");

const taskRows = exercises.exercises.map((e) => {
  const labels = [...e.text.matchAll(/^([a-j])\) /gm)].map((m) => m[1]);
  const solved = solutions.solutions.find((s) => s.exercise === e.number);
  assert.deepEqual(solved.tasks.map((t) => t.label), labels.length ? labels : ["whole"]);
  const display = draft.answers.find((a) => a.exercise === e.number).displayAnswer;
  for (const label of labels) assert.ok(display.includes(`${label})`), `${e.number}/${label} display absent`);
  return { exercise: e.number, sourceNumber: e.source_number, groupId: e.group_id, labels, figureRefs: e.figure_refs };
});
assert.equal(taskRows.reduce((n, r) => n + r.labels.length, 0), 44);
assert.deepEqual(taskRows.filter((r) => !r.labels.length).map((r) => r.exercise), ["889", "890", "891"]);

// Each residual below is independently transcribed from the modern prose.
// The clearing multiplier checks the polynomial at nonroot points as well.
const cases = [];
const add = (id, coefficients, factors, roots, domain, residual, clear) =>
  cases.push({ id, coefficients, factors, roots, domain, residual, clear });
const root = (text, value, admissible = true) => ({ text, value, admissible });
add("873/a", [1,6,-187], [[1,-11],[1,17]], [root("11",11),root("-17",-17,false)],
  (n) => Number.isInteger(n) && n >= 0, (n) => n*(n+6)-187, () => 1);
add("873/b", [1,2,-120], [[1,-10],[1,12]], [root("10",10),root("-12",-12)],
  () => true, (n) => n*(n+2)-120, () => 1);
add("874/a", [1,4,-60], [[1,-6],[1,10]], [root("6",6),root("-10",-10,false)],
  (w) => w>0, (w) => w*(w+4)-60, () => 1);
add("874/b", [1,-31,210], [[1,-10],[1,-21]], [root("10",10),root("21",21)],
  (u) => u>0 && u<31, (u) => u*(31-u)-210, () => -1);
add("875/a", [1,-1,-110], [[1,-11],[1,10]], [root("11",11),root("-10",-10,false)],
  (n) => Number.isInteger(n) && n>=0, (n) => n*(n+1)-(2*n+1)-109, () => 1);
add("875/b", [1,1,-56], [[1,-7],[1,8]], [root("7",7),root("-8",-8,false)],
  (n) => Number.isInteger(n) && n>=0, (n) => (2*n+1)**2-n**2-(n+1)**2-112, () => 1/2);
add("876/a", [289,0,-46.24], [[17,-6.8],[17,6.8]], [root("0.4",0.4),root("-0.4",-0.4,false)],
  (k) => k>0, (k) => (8*k)**2+(15*k)**2-6.8**2, () => 1);
add("876/b", [25,0,-225], [[5,-15],[5,15]], [root("3",3),root("-3",-3,false)],
  (k) => k>0, (k) => (13*k)**2-(12*k)**2-15**2, () => 1);
add("877/a", [1,-2,-3], [[1,-3],[1,1]], [root("-1",-1),root("3",3)],
  () => true, (x) => (x*x+1)/2-x-2, () => 2);
add("877/b", [1,-11,-12], [[1,-12],[1,1]], [root("-1",-1),root("12",12)],
  () => true, (x) => x*(x+1)/6-2*x-2, () => 6);
add("877/c", [1,6,8], [[1,2],[1,4]], [root("-4",-4),root("-2",-2)],
  () => true, (x) => 3-x*(x+2)/4-x-5, () => -4);
add("877/d", [1,-10,-24], [[1,-12],[1,2]], [root("-2",-2),root("12",12)],
  () => true, (x) => (3*x+4)/5-(x*x-4*x-6)/10+1, () => -10);
add("877/e", [1,-1,-20], [[1,-5],[1,4]], [root("-4",-4),root("5",5)],
  () => true, (y) => (y+1)**2/12-(7-y)/4-y/2, () => 12);
add("877/f", [5,-2,-24], [[5,-12],[1,2]], [root("-2",-2),root("12/5",12/5)],
  () => true, (y) => (3-y)/5-(y-2)/4-(y-2)**2/8, () => -40);
add("878/a", [2,-7,6], [[2,-3],[1,-2]], [root("3/2",3/2),root("2",2,false)],
  (x) => x!==2, (x) => 2*x*x/(x-2)-(7*x-6)/(x-2), (x) => x-2);
add("878/b", [1,-6,-5], null, [root("3-sqrt(14)",3-Math.sqrt(14)),root("3+sqrt(14)",3+Math.sqrt(14))],
  (x) => x!==5, (x) => (x*x-6*x)/(x-5)-5/(x-5), (x) => x-5);
add("878/c", [1,28,27], [[1,1],[1,27]], [root("-27",-27),root("-1",-1)],
  (x) => x!==-7 && x!==1, (x) => (2*x-1)/(x+7)-(3*x+4)/(x-1), (x) => -(x+7)*(x-1));
add("878/d", [4,-2,-2], [[4,2],[1,-1]], [root("-1/2",-1/2),root("1",1)],
  (y) => y!==-1 && y!==0, (y) => (5*y+1)/(y+1)-(y+2)/y, (y) => y*(y+1));
add("878/e", [1,7,-18], [[1,9],[1,-2]], [root("-9",-9),root("2",2,false)],
  (x) => x!==-2 && x!==2, (x) => x/(x-2)+5/(x+2)-8/(x*x-4), (x) => x*x-4);
add("878/f", [1,-6,4], null, [root("3-sqrt(5)",3-Math.sqrt(5)),root("3+sqrt(5)",3+Math.sqrt(5))],
  (x) => x!==-2 && x!==2, (x) => (3*x+1)/(x+2)-(x-1)/(x-2)-1, (x) => x*x-4);
add("878/g", [3,-11,8], [[3,-8],[1,-1]], [root("1",1),root("8/3",8/3)],
  (y) => y!==-1/3 && y!==1/3, (y) => 4/(9*y*y-1)-4/(3*y+1)-y/(1-3*y), (y) => 9*y*y-1);
add("878/h", [1,8,-9], [[1,9],[1,-1]], [root("-9",-9),root("1",1)],
  (x) => x!==-3 && x!==3, (x) => 4/(x+3)-5/(3-x)-1/(x-3)+1, (x) => x*x-9);
add("878/i", [16,-16,4], [[4,-2],[4,-2]], [root("1/2",1/2,false)],
  (x) => x!==-1/2 && x!==1/2,
  (x) => (2*x+1)/(2*x-1)-3*(2*x-1)/(7*(2*x+1))-8*x/(4*x*x-1), (x) => 7*(4*x*x-1));
add("878/j", [2,-3,-9], [[2,3],[1,-3]], [root("-3/2",-3/2),root("3",3,false)],
  (y) => y!==0 && y!==-3 && y!==3,
  (y) => (2*y-5)/(y*y-3*y)-(y+2)/(y*y+3*y)+(y-5)/(y*y-9), (y) => y*(y*y-9));
add("879/a", [1,6,-55], [[1,11],[1,-5]], [root("-11",-11),root("5",5,false)],
  (y) => y!==-5 && y!==5,
  (y) => (y+1)/(y-5)+10/(y+5)-10*(y+1)/((y-5)*(y+5)), (y) => y*y-25);
add("879/b", [1,-4,-12], [[1,-6],[1,2]], [root("6",6),root("-2",-2,false)],
  (a) => a!==4 && a!==-2,
  (a) => 6/(a-4)-a/(a+2)-6*a/((a-4)*(a+2)), (a) => -(a-4)*(a+2));
add("880/a", [1,3,-18], [[1,-3],[1,6]], [root("3",3),root("-6",-6)],
  (n) => n!==0 && n!==-18, (n) => (n+4)/(n+18)-(n+1)/n+1, (n) => n*(n+18));
add("880/b", [1,-19,60], [[1,-15],[1,-4]], [root("15",15),root("4",4)],
  (n) => n!==0 && n!==-5, (n) => (n-7)/(n+5)-(n-4)/n+1/3, (n) => 3*n*(n+5));
add("881/a", [4,-59,-80], [[1,-16],[4,5]], [root("16",16),root("-5/4",-5/4,false)],
  (v) => v>0, (v) => 40/v+27/(v+2)-4, (v) => -v*(v+2));
add("881/b", [1,-58,480], [[1,-10],[1,-48]], [root("10",10),root("48",48)],
  (v) => v>0, (v) => 30/(v+2)-24/v-1/10, (v) => -10*v*(v+2));
add("882/a", [1,10,-7200], [[1,-80],[1,90]], [root("80",80),root("-90",-90,false)],
  (v) => v>0, (v) => 720/v-720/(v+10)-1, (v) => -v*(v+10));
add("882/b", [1,4,-165], [[1,-11],[1,15]], [root("11",11),root("-15",-15,false)],
  (v) => v>0, (v) => 33/v-33/(v+4)-4/5, (v) => -5/4*v*(v+4));
add("883/a", [1,-26,-27], [[1,-27],[1,1]], [root("27",27),root("-1",-1,false)],
  (v) => v>0, (v) => 9/v+20/(v+3)-1, (v) => -v*(v+3));
add("883/b", [1,-11,30], [[1,-5],[1,-6]], [root("5",5),root("6",6)],
  (v) => v>2, (v) => 15/v-6/(v-2)-1, (v) => -v*(v-2));
add("884/a", [5,-47,-88], [[1,-11],[5,8]], [root("11",11),root("-8/5",-8/5,false)],
  (u) => u>0, (u) => 45/(u+4)+22/u-5, (u) => -u*(u+4));
add("884/b", [3,14,-40], [[3,20],[1,-2]], [root("2",2),root("-20/3",-20/3,false)],
  (c) => c>=0 && c<20, (c) => 36/(20-c)+22/(20+c)-3, (c) => 400-c*c);
add("885/a", [1,-28,96], [[1,-24],[1,-4]], [root("24",24),root("4",4,false)],
  (t) => t>8, (t) => 12/t+8/(t-8)-1, (t) => -t*(t-8));
add("885/b", [6,-25,-14], [[3,-14],[2,1]], [root("14/3",14/3),root("-1/2",-1/2,false)],
  (t) => t>0, (t) => 2/t+(10/3)/(t+7/6)-1, (t) => -6*t*(t+7/6));
assert.equal(cases.length, 38);

const numerical = [];
const sampleValues = [-12.25,-7.25,-3.25,-0.75,0.25,1.25,2.25,4.25,9.25,21.25,55.25];
for (const c of cases) {
  const [a,b,d] = c.coefficients;
  const polynomial = (x) => a*x*x+b*x+d;
  if (c.factors) {
    const [[u,v],[w,z]] = c.factors;
    [u*w,u*z+v*w,v*z].forEach((value, i) => near(value,c.coefficients[i],`${c.id} factor coefficient ${i}`));
  }
  const discriminant = b*b-4*a*d;
  assert.ok(discriminant>=0);
  assert.equal(c.roots.length, discriminant===0 ? 1 : 2, `${c.id}: incomplete candidate roots`);
  c.roots.forEach((r) => {
    near(polynomial(r.value),0,`${c.id} polynomial root ${r.text}`);
    assert.equal(c.domain(r.value),r.admissible,`${c.id}: wrong admissibility for ${r.text}`);
    if (r.admissible) near(c.residual(r.value),0,`${c.id} original equation ${r.text}`);
  });
  // Vieta's relations additionally verify the exact radical-root branches.
  if (c.roots.length===2) {
    near(c.roots[0].value+c.roots[1].value,-b/a,`${c.id} root sum`);
    near(c.roots[0].value*c.roots[1].value,d/a,`${c.id} root product`);
  }
  let clearedIdentitySamples = 0;
  for (const x of sampleValues) {
    if (!Number.isFinite(c.residual(x)) || c.clear(x)===0) continue;
    near(c.residual(x)*c.clear(x),polynomial(x),`${c.id} cleared identity at ${x}`);
    clearedIdentitySamples++;
  }
  assert.ok(clearedIdentitySamples>=8);
  const [exercise,label] = c.id.split("/");
  const task = solutions.solutions.find((s) => s.exercise===exercise).tasks.find((t) => t.label===label);
  assert.deepEqual(task.candidates,c.roots.map((r) => r.text),`${c.id}: source-solution candidate mismatch`);
  numerical.push({
    task:c.id, status:"pass", coefficients:c.coefficients, factors:c.factors,
    discriminant, candidates:c.roots.map(({text,admissible}) => ({value:text,admissibleInLiteralOrPhysicalDomain:admissible})),
    clearedIdentitySamples,
    method:"Coefficient expansion, candidate cardinality, Vieta, original-equation substitution, original/physical domain checks and nonroot clearing-identity samples. Float checks use relative tolerance 1e-9; algebraic derivations remain in source-solutions.json.",
  });
}

const identities = [];
const identity = (task, actual, expected, exactReason) => {
  near(actual,expected,task);
  identities.push({task,status:"pass",actual,expected,exactReason});
};
identity("886/a",1/(11+2*Math.sqrt(30))+1/(11-2*Math.sqrt(30)),22,"Conjugate denominator product 121-120=1; numerator 22.");
identity("886/b",(Math.sqrt(5)+2)/(Math.sqrt(5)-2)+(Math.sqrt(5)-2)/(Math.sqrt(5)+2),18,"Conjugate denominator product 5-4=1; squared numerator sum 2*(5+4)=18.");
const x1=5+2*Math.sqrt(6), y1=5-2*Math.sqrt(6);
identity("887/a",x1*y1/(x1+y1),1/10,"xy=25-24=1 and x+y=10.");
const x2=Math.sqrt(11)+Math.sqrt(3), y2=Math.sqrt(11)-Math.sqrt(3);
identity("887/b",(x2*x2+y2*y2)/(x2*y2),7/2,"xy=11-3=8 and x^2+y^2=2*(11+3)=28.");
for (const t of sampleValues) {
  near(2*(t/2-5)+3,t-7,`888/a t=${t}`);
  near((t*Math.sqrt(2)-1)*(t*Math.sqrt(2)+1),2*t*t-1,`888/b t=${t}`);
}
identities.push({task:"888/a",status:"pass",samples:sampleValues.length,exactReason:"2*(t/2-5)+3=t-10+3=t-7."});
identities.push({task:"888/b",status:"pass",samples:sampleValues.length,exactReason:"(t*sqrt(2)-1)(t*sqrt(2)+1)=2t^2-1."});
assert.equal(numerical.length+identities.length,44);

const extras = [];
const checkExtra = (name, actual, expected) => {
  near(actual,expected,name);
  extras.push({name,status:"pass",actual,expected});
};
checkExtra("874/a perimeter cm",2*(6+10),32);
checkExtra("874/b perimeter m",2*(10+21),62);
checkExtra("874/b area m^2",10*21,210);
checkExtra("876/a area m^2",3.2*6/2,9.6);
checkExtra("876/b perimeter cm",15+36+39,90);
checkExtra("881/a final time h",27/18,3/2);
checkExtra("881/b return speed branch 1 km/h",10+2,12);
checkExtra("881/b return speed branch 2 km/h",48+2,50);
checkExtra("882/b slower time h",33/11,3);
checkExtra("882/b faster time h",33/15,11/5);
checkExtra("885/b second solo time h",14/3+7/6,35/6);
checkExtra("885/b work",2/(14/3)+(10/3)/(35/6),1);
checkExtra("880/a positive branch decrease",4/3-7/21,1);
checkExtra("880/a signed branch decrease",(-5)/(-6)-(-2)/12,1);
checkExtra("880/b positive branch decrease",11/15-8/20,1/3);
checkExtra("880/b zero branch decrease",0/4-(-3)/9,1/3);

const figureBindings = [];
const imageEntries = [];
for (const [order,id,kind,path] of [
  [1,"fig-60","original",join(sourceBook,"figures/fig-60.png")],
  [2,"fig-61","original",join(sourceBook,"figures/fig-61.png")],
  [3,"fig-60","current-preview",join(base,"n45-modern-figure-author/FINAL/fig-60/fig-60.preview.png")],
  [4,"fig-61","current-preview",join(base,"n45-modern-figure-author/FINAL/fig-61/fig-61.preview.png")],
]) {
  const bytes=readFileSync(path);
  assert.equal(bytes.subarray(1,4).toString(),"PNG");
  imageEntries.push({order,figure:id,kind,path:relative(repo,path),sha256:sha(path),width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20),viewCount:1});
}
for (const id of ["fig-60","fig-61"]) {
  const specPath=join(durableFigures,`${id}.spec.json`);
  const spec=json(specPath);
  const original=join(sourceBook,`figures/${id}.png`);
  const stageFigures=join(sourceBook,"editions/modern-us-neutral/figures");
  const authored=join(base,`n45-modern-figure-author/FINAL/${id}`);
  assert.equal(spec.source.image.sha256,sha(original));
  assert.equal(sha(original),sha(join(durableBook,`figures/${id}.png`)));
  assert.equal(sha(specPath),sha(join(stageFigures,`${id}.spec.json`)));
  const authoredSpec=json(join(authored,`${id}.spec.json`));
  assert.equal(authoredSpec.source.image.path,original);
  assert.equal(spec.source.image.path,relative(repo,join(durableBook,`figures/${id}.png`)));
  authoredSpec.source.image.path=spec.source.image.path;
  assert.deepEqual(authoredSpec,spec,`${id}: only the explicit source.image.path retention mapping may differ`);
  assert.equal(sha(join(durableFigures,`${id}.svg`)),sha(join(stageFigures,`${id}.svg`)));
  assert.equal(sha(join(durableFigures,`${id}.svg`)),sha(join(authored,`${id}.svg`)));
  const exercise=id==="fig-60" ? "889" : "891";
  assert.equal(spec.source.authoritativeText[0].text,exercises.exercises.find((e)=>e.number===exercise).text);
  figureBindings.push({
    figure:id,exercise,status:"pass",sourcePngSha256:sha(original),
    durableSpecSha256:sha(specPath),authorSpecSha256:sha(join(authored,`${id}.spec.json`)),
    durableSvgSha256:sha(join(durableFigures,`${id}.svg`)),
    sourceStageSpecBytesMatchDurable:true,sourceStageAndCurrentAuthorSvgBytesMatchDurable:true,
    authorSpecMatchesDurableAfterOnlySourceImagePathMapping:true,
    sourceImagePathMapping:{from:original,to:spec.source.image.path},
  });
}
const f60=json(join(durableFigures,"fig-60.spec.json"));
const points60=new Map(f60.objects.filter((o)=>o.type==="point").map((o)=>[o.id,o.at]));
assert.deepEqual(points60.get("f60-cross-0"),[0,3]);
assert.deepEqual(points60.get("f60-cross-4"),[4,3]);
assert.deepEqual(points60.get("f60-left-end"),[-1.5,3.5]);
assert.deepEqual(points60.get("f60-right-end"),[6,4]);
const whole889=solutions.solutions.find((s)=>s.exercise==="889").tasks[0];
assert.equal(whole889.requests.length,3);
assert.deepEqual(whole889.requests.map((r)=>r.answer),["{0,4}","[-1.5,0) union (4,6]","(0,4)"]);
const whole890=solutions.solutions.find((s)=>s.exercise==="890").tasks[0];
assert.equal(whole890.positiveNaturalPoints.length,20);
assert.equal(new Set(whole890.positiveNaturalPoints.map(([n])=>n)).size,20);
whole890.positiveNaturalPoints.forEach(([n,r],i)=>{
  assert.equal(n,i+1); assert.equal(r,n%6);
  assert.ok(draft.answers.find((a)=>a.exercise==="890").displayAnswer.includes(`(${n},${r})`));
});
assert.deepEqual(whole890.zeroInclusiveAdditionalPoints,[[0,0]]);
const panels=solutions.solutions.find((s)=>s.exercise==="891").tasks[0].panels;
assert.equal(panels.length,2);
assert.equal(panels.flatMap((p)=>p.requestedPoints).length,8);
for (const p of panels) assert.deepEqual(p.requestedPoints.map((r)=>r.coordinate),["1","-x","1/x","sqrt(x)"]);
for (const x of [1.001,1.5,2,10]) {
  const values=[-x,0,1/x,1,Math.sqrt(x),x,x*x];
  assert.ok(values.every((v,i)=>i===0 || values[i-1]<v));
}
for (const x of [0.01,0.2,0.5,0.999]) {
  const values=[-x,0,x*x,x,Math.sqrt(x),1,1/x];
  assert.ok(values.every((v,i)=>i===0 || values[i-1]<v));
}
const f61=json(join(durableFigures,"fig-61.spec.json"));
const points61=new Map(f61.objects.filter((o)=>o.type==="point").map((o)=>[o.id,o.at]));
assert.ok(points61.get("f61-a-origin")[0]<points61.get("f61-a-A")[0]);
assert.ok(points61.get("f61-a-A")[0]<points61.get("f61-a-B")[0]);
assert.ok(points61.get("f61-b-origin")[0]<points61.get("f61-b-B")[0]);
assert.ok(points61.get("f61-b-B")[0]<points61.get("f61-b-A")[0]);

for (const answer of draft.answers) {
  const e=exercises.exercises.find((x)=>x.number===answer.exercise);
  assert.equal(answer.prompt,e.text);
  assert.equal(answer.source,"derived");
  assert.equal(answer.grading,"ungraded");
  assert.deepEqual(answer.parts,[]);
  assert.ok(answer.displayAnswer.trim());
  assert.ok(!Object.hasOwn(answer,"bookRaw"));
  assert.ok(!Object.hasOwn(answer,"interaction"));
  // Remove transient preparation paths from the eventual parent finalizer input.
  answer.figureEvidence=answer.figureEvidence.map((f)=>({
    id:f.id,
    originalPng:`ssot-resources/soviet10year-textbooks/artifacts/7a/figures/${f.id}.png`,
    editionAsset:`ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/figures/${f.id}.svg`,
    figureSpec:`ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/figures/${f.id}.spec.json`,
  }));
}
draft.count=19;
output("answer-keys.json",draft);
output("task-count.json",{
  schema:"stemrobin-182/task-count@1",status:"pass",exerciseCount:19,letteredSubpartCount:44,
  unsplitExerciseCount:3,unsplitExercises:["889","890","891"],solutionTaskRecords:47,
  graphEquationAndInequalityRequests:3,remainderGraphPositiveNaturalPoints:20,zeroInclusiveAdditionalPoints:1,
  numberLinePanels:2,numberLineRequestedPointCount:8,rows:taskRows,
  clarification:"44 is the count of explicit a)-j) subparts. The three unsplit exercises are additionally covered, not dropped.",
});
output("mathematical-checks.json",{
  schema:"stemrobin-182/mathematical-checks@1",status:"pass",quadraticCases:38,identitySubparts:6,
  letteredSubpartsVerified:44,numerical,identities,requestedQuantityAndConventionChecks:extras,
  graph:{status:"pass",equationRoots:[0,4],greaterThan:"[-1.5,0) union (4,6]",lessThan:"(0,4)",actualImageObservationConfirmedByDurableSpec:true},
  remainderFunction:{status:"pass",positiveNaturalPoints:20,conditionalZeroPoint:[0,0],functionUnderBothConventions:true},
  numberLines:{status:"pass",panels:2,requestedPoints:8,symbolicOrders:panels.map((p)=>({panel:p.panel,order:p.fullOrder})),pixelDistancesNotUsedAsNumericData:true},
  limitation:"These deterministic checks support the author's source-derived algebra and actual-image observations. They are not an independent reviewer comparison or a finalized publication audit.",
});
output("image-ledger.json",{
  schema:"stemrobin-182/answer-author-image-ledger@1",batches:[{batch:"n45-answer-author-four-images",images:imageEntries.length,maxPerBatch:8,contextImageTotal:4,images:imageEntries}],
  actualImagesViewed:4,originalPngViews:2,currentPreviewViews:2,reopens:0,crops:0,newRenders:0,
  fig59Opened:false,fig59Reason:"Worked example only; user explicitly excluded reopening.",
  observations:[
    {figure:"fig-60",text:"Actual original and current preview show crossings at (0,3),(4,3), bounded endpoints above y=3, and a curve below y=3 between the two crossings."},
    {figure:"fig-61",text:"Actual original and current preview show panel a order 0<A<B and panel b order 0<B<A. No numeric unit tick; neither pixel distance nor hollow marker is a numerical x assignment."},
  ],specReadOrder:"Durable fig-60 and fig-61 FigureSpecs were read after the four-image batch.",figureBindings,
});
const prep=json(prepReceiptPath);
assert.equal(prep.exit,0);
assert.equal(prep.error,null);
assert.equal(prep.cwd,repo);
prep.streams.forEach((s)=>assert.equal(sha(resolve(repo,s.path)),s.sha256));
const inputPaths=[
  join(repo,"AGENTS.md"),join(repo,".intentfold/readme.md"),join(repo,".intentfold/project.json"),
  ...["engineering","operations","product","ui"].map((n)=>join(repo,`.intentfold/charter/${n}.md`)),
  join(repo,".claude/skills/ld-s10y-answer/SKILL.md"),
  join(repo,".claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md"),
  join(repo,".claude/skills/ld-s10y-lesson/references/production-resume.md"),
  join(repo,".agents/skills/ld-s10y-image/SKILL.md"),
  join(repo,".claude/skills/ld-s10y-answer/tools/lesson_answers.py"),
  join(repo,".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json"),
  ...["lesson","exercises","figures"].map((n)=>join(lessonDir,`${n}.json`)),
  templatePath,prepReceiptPath,...prep.streams.map((s)=>resolve(repo,s.path)),
  ...imageEntries.map((i)=>resolve(repo,i.path)),
  ...["fig-60","fig-61"].flatMap((id)=>[
    join(durableBook,`figures/${id}.png`),
    ...["spec.json","svg"].flatMap((suffix)=>[
      join(durableFigures,`${id}.${suffix}`),
      join(sourceBook,`editions/modern-us-neutral/figures/${id}.${suffix}`),
      join(base,`n45-modern-figure-author/FINAL/${id}/${id}.${suffix}`),
    ]),
  ]),
];
output("input-hashes.json",{
  schema:"stemrobin-182/answer-author-inputs@1",
  capturedAt:new Date().toISOString(),
  capturePhase:"After independent solution and at draft validation; no claim of a pre-authoring hash capture.",
  prep:{receiptPath:relative(repo,prepReceiptPath),sha256:sha(prepReceiptPath),exit:0,reused:true,rerun:false},
  inputs:[...new Set(inputPaths)].map((p)=>({path:relative(repo,p),sha256:sha(p),bytes:statSync(p).size})),
  authorityPaths:["lesson.json","exercises.json","figures.json"].map((n)=>relative(repo,join(lessonDir,n))),
  prohibitedAnswerSourcesRead:[],liveTicketRead:false,reasonLiveTicketNotRead:"Direct human request requires OFFLINE with no network.",
});
console.log(JSON.stringify({
  status:"pass",exerciseCount:19,explicitSubparts:44,unsplitExercises:3,
  quadraticCases:38,identitySubparts:6,actualImagesViewed:4,ungraded:19,parts:0,
  conventionGaps:["880 signed/zero numerator-denominator conventions","890 zero-inclusive natural convention"],
},null,2));

