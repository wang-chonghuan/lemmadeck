import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), root);
const own = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d054-n14-author');
const figdir = path.join(root, '.tmp/STEMROBIN-181/d1816-d054/n14-figure-author');
const read = file => JSON.parse(fs.readFileSync(file));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({path: file, sha256: hash(file)});
const save = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2)+'\n');
const mapping = read(path.join(own, 'source-inventory-mapping.json'));
const geometry = [];
const evaluate = (s,t) => [0,1].map(i => (1-t)**3*s[0][i]+3*(1-t)**2*t*s[1][i]+3*(1-t)*t*t*s[2][i]+t**3*s[3][i]);
for (const fig of mapping.figures) {
  assert.equal(hash(fig.spec.path), fig.spec.sha256);
  const spec = read(fig.spec.path);
  const curveRows = [];
  for (const curve of fig.curves) {
    const object = spec.objects.find(x => x.id === curve.id);
    assert.equal(object.type, 'svgPath');
    assert(!object.dash);
    const expectedPath = curve.segments.map((s,i) =>
      (i ? '' : `M ${s[0][0]} ${640-s[0][1]} `) +
      `C ${s.slice(1).map(p => `${p[0]} ${640-p[1]}`).join(' ')}`).join(' ');
    assert.equal(object.d, expectedPath);
    const samples = curve.segments.flatMap(s => Array.from({length: 21}, (_,i) => evaluate(s,i/20)));
    assert(samples.every(p => p[1] > 100 && p[0] >= 90 && p[0] <= 560));
    assert(samples.every((p,i) => !i || p[0] >= samples[i-1][0]));
    const peak = samples.reduce((p,q) => p[1] > q[1] ? p : q);
    assert(Math.hypot(peak[0]-curve.peak[0], peak[1]-curve.peak[1]) < 1e-6);
    assert(peak[0] < 370, 'Displacement peak below undamped natural frequency');
    const before = samples.filter(p => p[0] <= peak[0]);
    const after = samples.filter(p => p[0] >= peak[0]);
    assert(before.every((p,i) => !i || p[1] >= before[i-1][1]-1e-8));
    assert(after.every((p,i) => !i || p[1] <= after[i-1][1]+1e-8));
    const first = samples[0], last = samples.at(-1);
    assert.equal(first[0],90);
    assert.equal(first[1],190);
    assert.equal(last[0],560);
    assert(last[1] > 100 && last[1] < first[1]);
    if (curve.leader) {
      const target = spec.objects.find(x => x.id === `${curve.id}-leader-target`).at;
      assert(samples.some(p => Math.hypot(p[0]-target[0],p[1]-target[1]) < 1e-6), 'Leader lands on the actual retained curve path');
      const arrow = spec.objects.find(x => x.id === `${curve.id}-leader`);
      const from = spec.objects.find(x => x.id === arrow.from).at;
      assert(from[0] > target[0] && from[1] > target[1], 'Leader points left/down toward correct descending curve');
      assert.equal(spec.objects.find(x => x.id === `${curve.id}-number`).text, curve.id.split('-').at(-1));
    }
    const threshold = (190+peak[1])/2;
    const halfPeakSamples = samples.filter(p => p[1] >= threshold);
    curveRows.push({id:curve.id, peakDrawingCoordinate:peak, startDrawingCoordinate:first,
      endDrawingCoordinate:last, aboveHalfPeakExcessWidth:halfPeakSamples.at(-1)[0]-halfPeakSamples[0][0],
      sampleCount:samples.length, noPhysicalMeasurementsInTheseCoordinates:true,
      checks:['exact path binding','positive intercept and tail','one peak','monotone rise/fall','peak below natural frequency','leader attaches to corresponding path']});
  }
  if (curveRows.length === 3) {
    assert(curveRows[0].peakDrawingCoordinate[1] > curveRows[1].peakDrawingCoordinate[1]);
    assert(curveRows[1].peakDrawingCoordinate[1] > curveRows[2].peakDrawingCoordinate[1]);
    assert(curveRows[0].endDrawingCoordinate[1] > curveRows[1].endDrawingCoordinate[1]);
    assert(curveRows[1].endDrawingCoordinate[1] > curveRows[2].endDrawingCoordinate[1]);
    assert(curveRows[0].aboveHalfPeakExcessWidth < curveRows[1].aboveHalfPeakExcessWidth);
    assert(curveRows[1].aboveHalfPeakExcessWidth < curveRows[2].aboveHalfPeakExcessWidth);
    for (const x of [100,200,280,340,400,500,560]) {
      const r=(x-90)/280;
      const heights=fig.curves.map(c=>100+90/Math.sqrt((1-r*r)**2+(2*c.dampingRegularization*r)**2));
      assert(heights[0]>heights[1] && heights[1]>heights[2], 'Fixed-drive ordering must not cross');
    }
  }
  geometry.push({id:fig.id,status:'pass',spec:bind(fig.spec.path),curves:curveRows});
}
save(path.join(own,'curve-relationship-checks.json'),{
  schema:'STEMROBIN-181/d054-author-executable-curve-checks@1',role:'AUTHOR',status:'pass',
  nativeAssertionTypes:'connects, perpendicular, parallel, collinear, displacement, objectCount',
  supplementaryScope:'Native curve fallback is checked through executable Bezier path sampling and exact leader attachment. Drawing parameters are declared model regularization, not source measurements.',
  independentReview:'pending',figures:geometry,
});

const passagePlan = [
  ['R1-steady-transients','R1-UVA-http','The Driven Steady State Solution and Initial Transient Behavior','Using Complex Numbers to Solve'],
  ['R1-amplitude-phase','R1-UVA-http','We’ll try the complex function','Back to Reality'],
  ['R1-work-energy','R1-UVA-http','How Hard is the Driver Working to Keep this Thing Going?','Exercise 1:'],
  ['R2-linear-damping','R2-UNSW','Damped Oscillations\nIn practice','Forced Oscillations\nIn the analysis'],
  ['R2-energy-phase-limits','R2-UNSW','So at resonance, the force leads the displacement','We do not discuss here the transient behaviour'],
];
const passages = [];
for (const [id,reference,start,end] of passagePlan) {
  const full = path.join(own,'references',`${reference}.stdout.txt`);
  const bytes = fs.readFileSync(full);
  const text=bytes.toString('utf8');
  assert(text.includes('Status: 200'));
  const a=text.indexOf(start), b=text.indexOf(end,a+start.length);
  assert(a>=0 && b>a,id);
  const passage=text.slice(a,b);
  const target=path.join(own,'references',`${id}.passage.txt`);
  fs.writeFileSync(target,passage);
  passages.push({id,fullRenderedRead:bind(full),passage:bind(target),
    byteStart:Buffer.byteLength(text.slice(0,a)),byteEnd:Buffer.byteLength(text.slice(0,b))});
}
save(path.join(own,'primary-reference-bindings.json'),{
  role:'AUTHOR',actualFullReads:2,source:'University-authored physics teaching references read in full through cloak-fetch.',
  acquisition:bind(path.join(own,'reference-acquisition.json')),passages,
  claims:[
    {sourceRefs:['p0040#5'],basis:'R1-steady-transients',clarification:'Single-frequency steady response after transients decay in a stable linear driven model.'},
    {sourceRefs:['p0040#7','p0040#10','p0041#8'],basis:'R1-amplitude-phase',clarification:'The retained amplitude expression gives a damped displacement peak below the undamped natural frequency when such a peak exists; weak damping makes the difference small.',derivation:'Differentiate the squared amplitude denominator with respect to driving angular frequency. Its nonzero stationary point is below the undamped natural frequency for nonzero linear damping; the stationary point ceases to exist as damping becomes sufficiently large. This is an author derivation, not a verbatim reference claim or new lesson formula.'},
    {sourceRefs:['p0041#3','p0041#4','p0041#5'],basis:['R1-work-energy','R2-energy-phase-limits'],clarification:'Velocity/drive alignment and instantaneous damping-force cancellation at the undamped natural frequency are distinguished from the damped displacement-amplitude maximum. Cycle energy balance is general to the stated steady model.'},
    {sourceRefs:['p0040#8','p0041#6','p0041#7','p0042#3','p0042#5'],basis:['R1-amplitude-phase','R2-energy-phase-limits'],clarification:'Fixed-drive comparison, finite low-frequency quasistatic response, high-frequency decrease and weaker-damping taller/narrower peaks.'},
    {sourceRefs:['p0042#6','p0042#7'],basis:['R1-steady-transients','R2-linear-damping'],clarification:'Large steady amplitude needs buildup; faster transient decay with increased damping is limited to the oscillatory linear-damping comparison. Strong-damping response remains meaningful; actual liquid drag depends on the liquid and motion.',derivation:'The primary driven damped equation also governs its homogeneous transient. Increasing the damping coefficient is not an unconditional monotone improvement in settling time once real rather than oscillatory characteristic roots apply. No added equation, damping number, or physical datum appears in lesson text.'},
  ],
  caveats:['Do not copy the UVA Tacoma Narrows causal example; it is not used in this lesson.',
    'UNSW rendered mathematical text contains typographical inconsistencies; no new formula is transcribed into the lesson. Qualitative phase and linear-loss statements are cross-supported by the UVA equation.'],
  measurementsInvented: false, paidCalls:0, independentReview:'pending',
});

const runtime=read(path.join(own,'technical-runtime-reuse.json'));
const require=createRequire(runtime.files[0].runtime.path);
const {chromium}=require('playwright-core');
const executablePath=[process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,process.env.CHROME_PATH,
  chromium.executablePath(),'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean).find(p=>fs.existsSync(p));
assert(executablePath);
const browser=await chromium.launch({headless:true,executablePath});
const previews=[];
try {
  const page=await browser.newPage({deviceScaleFactor:1});
  for (const id of ['fig-18','fig-19']) {
    const svgPath=path.join(figdir,`${id}.svg`);
    const reportPath=path.join(figdir,`${id}.render.json`);
    const report=read(reportPath);
    assert.equal(report.status,'pass');
    assert.equal(report.spec.sha256,hash(path.join(figdir,`${id}.spec.json`)));
    assert.equal(report.output.svg.sha256,hash(svgPath));
    assert(report.displayChecks.every(x=>x.status==='pass' && x.measuredMinPx>=16));
    const widths=[];
    for (const width of [331,640]) {
      await page.setViewportSize({width,height:width});
      await page.setContent(`<style>html,body{margin:0;background:white}svg{display:block;width:${width}px;height:auto}</style>${fs.readFileSync(svgPath,'utf8')}`);
      const sizes=await page.locator('svg text').evaluateAll(nodes=>nodes.map(n=>{
        const c=n.getScreenCTM();return {text:n.textContent,size:parseFloat(n.getAttribute('font-size'))*Math.hypot(c.a,c.b)};
      }));
      assert(sizes.length>0 && sizes.every(x=>x.size>=16));
      widths.push({width,actualLabels:sizes});
      if (width===331) {
        const output=path.join(figdir,`${id}.preview-331.png`);
        assert(!fs.existsSync(output));
        await page.locator('svg').screenshot({path:output});
      }
    }
    previews.push({id,svg:bind(svgPath),nativeRender:bind(reportPath),
      native640:bind(path.join(figdir,`${id}.native.png`)),
      preview331:bind(path.join(figdir,`${id}.preview-331.png`)),widths});
  }
} finally {await browser.close();}
save(path.join(own,'preview-bindings.json'),{
  role:'AUTHOR',status:'pass',method:'Existing Playwright, unchanged native SVG at actual CSS widths 331 and 640, deviceScaleFactor 1; 331 preview saved and full 640 native PNG reused.',
  previews,imagesLoadedByThisProgram:0,independentReview:'pending',
});
for (const edition of ['modern-us-neutral','modern-us-neutral-en']) {
  const file=path.join(root,'.tmp/STEMROBIN-181/d1816-d054/n14-work/adapt/10p',edition,'lessons/phy10-c1-s2-n14/figures.template.json');
  const doc=read(file);
  for (const item of doc.figures) {
    item.svg=`figures/${item.id}.svg`;
    item.render=`figures/${item.id}.render.json`;
    item.review=`figures/${item.id}.review.json`;
    item.spec=`figures/${item.id}.spec.json`;
  }
  save(file,doc);
}
console.log(JSON.stringify({geometry:'pass',primaryFullReads:2,previews:previews.map(x=>({id:x.id,preview:x.preview331})),
  figuresManifest:'Draft output contracts only; review targets are pending, not issued or promoted.'}));
