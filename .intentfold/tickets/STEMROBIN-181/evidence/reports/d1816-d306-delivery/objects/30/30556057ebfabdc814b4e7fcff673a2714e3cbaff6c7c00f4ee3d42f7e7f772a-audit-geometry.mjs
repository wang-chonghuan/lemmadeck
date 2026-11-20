import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo='/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
const own=path.join(repo,'.intentfold/tickets/STEMROBIN-181/tmp/d1816-d280-fig2425-author');
assert.equal(process.cwd(),repo);
const read=p=>JSON.parse(fs.readFileSync(path.join(own,p)));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const freeze=read('input-freeze.json'), source=read('source-inventory.json'), mapping=read('source-to-geometry.json');
const checks=[];
function check(id, fn, detail) {
  fn();
  checks.push({id,status:'pass',detail});
}
const near=(a,b)=>assert(Math.abs(a-b)<0.00001,`${a} != ${b}`);
const nearPoint=(a,b)=>{near(a[0],b[0]);near(a[1],b[1]);};
const toUser=(height,p)=>[p[0],height-p[1]];
const s24=read('fig-24/spec.json'),s25=read('fig-25/spec.json');
for (const spec of [s24,s25]) {
  check(`${spec.id}-full-bilingual-draft-text`,()=>{
    assert.deepEqual(spec.source.authoritativeText,freeze.authoritativeText);
    assert.equal(spec.source.authoritativeText.length,2);
    assert(freeze.drafts.every(d=>d.nonfigBlocks.length===12 && d.status==='draft'));
  },'All nonfigure text, footnote, captions and chapter/title from both drafts; neither text draft is approved.');
  check(`${spec.id}-native-binding`,()=>{
    const render=read(`${spec.id}/${spec.id}.render.json`);
    assert.equal(render.status,'pass');
    assert.equal(render.spec.sha256,hash(path.join(own,spec.id,'spec.json')));
    assert.equal(render.output.svg.sha256,hash(path.join(own,spec.id,`${spec.id}.svg`)));
    assert.equal(render.collisions.length,0);
    assert(render.displayChecks.every(c=>c.status==='pass' && c.width===640));
    const preview=read(`${spec.id}/preview.json`);
    assert.equal(preview.sourceSvg.sha256,render.output.svg.sha256);
    assert.equal(preview.geometryRerenders,0);
    assert.equal(preview.svgChanged,false);
    assert.deepEqual(preview.requests,[]);
    assert(preview.previews.every(p=>p.geometry.labelSizes.every(n=>n>=16)));
    const mobile=preview.previews.find(p=>p.variant==='mobile331-scroll-end');
    assert.equal(mobile.geometry.width,640);
    assert.equal(mobile.scroll.clientWidth,331);
    assert.equal(mobile.scroll.end,309);
    assert.equal(mobile.scroll.end,mobile.scroll.expectedEnd);
  },'One native render, hash-bound previews of unchanged SVG, no collisions, media width 640 including mobile scroll extent.');
  check(`${spec.id}-source-current`,()=>{
    assert.equal(hash(spec.source.image.path),spec.source.image.sha256);
  },'Actual raw PNG bytes still match the frozen approved D271 hashes.');
}
check('s24-topology-and-extrema',()=>{
  const segments=s24.objects.filter(o=>o.type==='segment');
  assert.equal(segments.length,5);
  for (let i=0;i<5;i++) {
    nearPoint(segments[i].from,toUser(360,mapping.fig24.vertices[i]));
    nearPoint(segments[i].to,toUser(360,mapping.fig24.vertices[i+1]));
    assert.equal(segments[i].dash,0);
    if(i<4)nearPoint(segments[i].to,segments[i+1].from);
  }
  const rises=segments.filter(s=>s.to[0]>s.from[0] && s.to[1]>s.from[1]);
  const resets=segments.filter(s=>s.to[0]===s.from[0] && s.to[1]<s.from[1]);
  assert.equal(rises.length,3);assert.equal(resets.length,2);
  assert.equal(mapping.fig24.baselineCrossings.length,3);
  assert(mapping.fig24.vertices[5][1]>90 && mapping.fig24.vertices[5][1]<210);
  assert(s24.objects.filter(o=>o.type==='arrow').length===2);
  assert.deepEqual(s24.objects.filter(o=>o.type==='text').map(o=>o.text),['u\u209a','O','t']);
},'Three rising runs, two complete instantaneous resets, three baseline crossings, partial final rise, two axis arrows, u-subscript-p/O/t only.');
check('s25-full-circular-lattice',()=>{
  const grid=mapping.fig25.graticule;
  assert.equal(grid.tracks.filter(t=>t.orientation==='v').length,19);
  assert.equal(grid.tracks.filter(t=>t.orientation==='h').length,17);
  const core=s25.objects.find(o=>o.id==='s25-core-grid');
  near((core.bounds[2]-core.bounds[0])/core.xStep,12);
  near((core.bounds[1]-core.bounds[3])/core.yStep,12);
  assert(s25.source.inventory.find(g=>g.id==='s25-graticule').requires.includes('gridDimensions'));
  const byId=new Map(s25.objects.map(o=>[o.id,o]));
  const [cx,cy]=mapping.fig25.screenCenter,r=mapping.fig25.screenRadius,step=grid.step;
  const coreStart={v:cy-6*step,h:cx-6*step},coreEnd={v:cy+6*step,h:cx+6*step};
  for (const t of grid.tracks) {
    for(const p of [t.start,t.end])near(Math.hypot(p[0]-cx,p[1]-cy),r);
    const index=t.orientation==='v'?0:1;
    near(t.start[index],(index===0?cx:cy)+t.index*step);
    near(t.end[index],t.start[index]);
    if(Math.abs(t.index)<=6) {
      const first=byId.get(`${t.id}-first-extension`),last=byId.get(`${t.id}-last-extension`);
      assert(first&&last);
      nearPoint(first.from,toUser(704,t.start));
      nearPoint(last.to,toUser(704,t.end));
      near(first.to[1-index],index===0?704-coreStart.v:coreStart.h);
      near(last.from[1-index],index===0?704-coreEnd.v:coreEnd.h);
    } else {
      const whole=byId.get(t.id);assert(whole);
      nearPoint(whole.from,toUser(704,t.start));nearPoint(whole.to,toUser(704,t.end));
    }
  }
  assert(!s25.objects.some(o=>o.type==='axis'||o.type==='arrow'||o.type==='text'));
},'19 vertical and 17 horizontal tracks. True 12x12 rectangular core plus every circle-bounded extension and short edge track; no exposed rectangular corner grid, axes or calibration.');
check('s25-trace-all-source-extrema-and-endpoints',()=>{
  const original=source.figures.find(f=>f.id==='fig-25').groups.find(g=>g.id==='s25-damped-trace');
  const knots=mapping.fig25.trace;
  assert.equal(knots.length,10);
  assert.equal(knots.filter(k=>k.type==='minimum').length,4);
  assert.equal(knots.filter(k=>k.type==='maximum').length,4);
  for(let i=0;i<knots.length;i++){
    assert.equal(knots[i].id,original.landmarks[i].id);
    nearPoint(knots[i].atApprox,original.landmarks[i].atApprox);
    nearPoint(knots[i].screen,[320+(knots[i].atApprox[0]-218)*1.28,310+(knots[i].atApprox[1]-220)*1.28]);
    assert(Math.hypot(knots[i].screen[0]-320,knots[i].screen[1]-310)<212);
  }
  const trace=s25.objects.find(o=>o.id==='s25-damped-trace');
  assert.equal(trace.type,'svgPath');assert.equal(trace.dash,0);
  const tokens=trace.d.trim().split(/\s+/);
  assert.equal(tokens.shift(),'M');
  nearPoint([Number(tokens.shift()),Number(tokens.shift())],knots[0].screen);
  for(let i=0;i<knots.length-1;i++){
    assert.equal(tokens.shift(),'C');
    const n=Array.from({length:6},()=>Number(tokens.shift()));
    const a=knots[i].screen,b=knots[i+1].screen;
    nearPoint(n.slice(4),b);
    near(n[0],a[0]+(b[0]-a[0])/3);near(n[2],b[0]-(b[0]-a[0])/3);
    near(n[1],a[1]);near(n[3],b[1]);
    assert(a[0]<n[0]&&n[0]<n[2]&&n[2]<b[0]);
    for(const y of [n[1],n[3]])assert(y>=Math.min(a[1],b[1])&&y<=Math.max(a[1],b[1]));
  }
  assert.equal(tokens.length,0);
  const reference=mapping.fig25.referenceLevel;
  for(const type of ['minimum','maximum']){
    const amplitudes=knots.filter(k=>k.type===type).map(k=>Math.abs(k.screen[1]-reference));
    assert(amplitudes.every((a,i)=>i===0||a<amplitudes[i-1]));
  }
},'All 10 source landmarks bound to the actual cubic d, exactly four crests/four troughs, strictly decreasing crest and trough amplitudes, monotone nonovershooting pieces, no extension beyond source endpoints.');
check('s25-apparatus-complete',()=>{
  const ids=s25.source.inventory.find(g=>g.id==='s25-apparatus').objects;
  for(const id of ['s25-housing','s25-lower-band','s25-mount','s25-screen-disk','s25-outer-rim','s25-inner-rim'])assert(ids.includes(id));
  for(let i=1;i<=4;i++)assert(ids.includes(`s25-fastener-${i}`)&&ids.includes(`s25-fastener-${i}-hole`));
  const lower=s25.objects.find(o=>o.id==='s25-lower-band');
  assert(lower.points.every(p=>p[1]<=164));
  assert.equal(s25.objects.filter(o=>o.type==='circle').length,10);
},'Round double rim, light mount, complete dark housing/lower band, exactly four ring fasteners; no invented controls.');
const output={schema:'d280-author-geometric-audit@1',status:'pass',checks,
  nativeAssertions:{fig24:s24.assertions.length,fig25:s25.assertions.length,total:s24.assertions.length+s25.assertions.length},
  independence:'Executable author-side geometry consistency only, not mathematical/cultural independent review or source approval.'};
fs.writeFileSync(path.join(own,'geometry-audit.json'),JSON.stringify(output,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(output));
