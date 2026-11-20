import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
const own = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d280-fig2425-author');
assert.equal(process.cwd(), repo);
const freeze = JSON.parse(fs.readFileSync(path.join(own, 'input-freeze.json')));
const inventoryBytes = fs.readFileSync(freeze.sourceInventory.path);
assert.equal(crypto.createHash('sha256').update(inventoryBytes).digest('hex'), freeze.sourceInventory.sha256);
const inventory = JSON.parse(inventoryBytes);
assert(inventory.recordedBeforeAnyCandidateOrSpecDrawing);
const round = n => Number(n.toFixed(6));
const base = (id, height, description) => ({
  schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic', description,
  source: {
    image: {...freeze.sources.find(f => f.id === id)},
    authoritativeText: freeze.authoritativeText,
    inventory: [],
  },
  canvas: {width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper'},
  display: {layout: 'scroll', purpose: 'instructional', minTextPx: 16, widths: [640]},
  objects: [], assertions: [], layout: {minLabelGap: 5},
});
const point = (height, at) => [round(at[0]), round(height - at[1])];
function group(spec, id, objects, assertions, requires = []) {
  const sourceFigure = inventory.figures.find(f => f.id === spec.id);
  const sourceGroup = sourceFigure.groups.find(g => g.id === id);
  spec.source.inventory.push({
    id, description: `${sourceGroup.facts} Source observations: ${JSON.stringify(sourceGroup)}. ` +
      `Declared schematic regularization, not calibration: ${sourceFigure.modernRegularizationAllowed.join(' ')}`,
    objects, assertions, ...(requires.length ? {requires} : {}),
  });
}
function displacement(spec, id, a, b) {
  const from = point(spec.canvas.height, a);
  const to = point(spec.canvas.height, b);
  spec.assertions.push({id, type: 'displacement', from, to,
    dx: round(to[0] - from[0]), dy: round(to[1] - from[1]), tolerance: 0.000002});
  return id;
}
const s24 = base('fig-24', 360,
  'Uncalibrated sweep voltage versus time: gradual linear increase, two rapid resets, ' +
  'and a partial third increase. Preserve the source common axes, negative portions, and three mathematical labels.');
delete s24.source.image.id;
delete s24.source.image.bytes;
const axisScreen = {
  's24-time-axis': [[32,210],[614,210]],
  's24-voltage-axis': [[78,328],[78,28]],
};
for (const [id, [a,b]] of Object.entries(axisScreen)) {
  s24.objects.push({id, type: 'arrow', from: point(360,a), to: point(360,b), stroke: 'ink', strokeWidth: 2.4});
  s24.assertions.push({id: `${id}-connects`, type: 'connects', arrow: id,
    from: point(360,a), to: point(360,b)});
}
const labels = [
  ['s24-voltage-label', [38,82], 'u\u209a'],
  ['s24-origin-label', [52,234], 'O'],
  ['s24-time-label', [585,245], 't'],
];
for (const [id, at, text] of labels) s24.objects.push({
  id, type: 'text', at: point(360,at), text, fontSize: 22, fontWeight: 500,
  labelPlacement: {position: 'CENTER'}, labelColor: 'ink',
});
s24.assertions.push(
  {id: 's24-axes-orthogonal', type: 'perpendicular', a: point(360,[32,210]), b: point(360,[614,210]),
    c: point(360,[78,328]), d: point(360,[78,28])},
  {id: 's24-origin-on-time', type: 'pointOnLine', point: point(360,[78,210]),
    a: point(360,[32,210]), b: point(360,[614,210])},
  {id: 's24-origin-on-voltage', type: 'pointOnLine', point: point(360,[78,210]),
    a: point(360,[78,328]), b: point(360,[78,28])},
  {id: 's24-three-labels', type: 'objectCount', objectType: 'text', count: 3},
  {id: 's24-two-axis-arrows', type: 'objectCount', objectType: 'arrow', count: 2},
);
group(s24, 's24-axes', [...Object.keys(axisScreen), ...labels.map(l => l[0])],
  ['s24-time-axis-connects','s24-voltage-axis-connects','s24-axes-orthogonal',
    's24-origin-on-time','s24-origin-on-voltage','s24-three-labels','s24-two-axis-arrows']);
const vertices24 = [[78,328],[217,90],[217,328],[356,90],[356,328],[456,round(328-238*100/139)]];
const sweepIDs = ['s24-rise-1','s24-reset-1','s24-rise-2','s24-reset-2','s24-rise-3-partial'];
const sweepAssertions = [];
for (let i=0; i<sweepIDs.length; i++) {
  const id = sweepIDs[i], a = vertices24[i], b = vertices24[i+1];
  s24.objects.push({id, type: 'segment', from: point(360,a), to: point(360,b),
    stroke: 'accent', strokeWidth: 3.3, dash: 0});
  const connects = `${id}-connects`;
  s24.assertions.push({id: connects, type: 'connects', arrow: id, from: point(360,a), to: point(360,b)});
  sweepAssertions.push(connects, displacement(s24, `${id}-displacement`, a, b));
}
s24.assertions.push({id: 's24-equal-complete-rises', type: 'equalDistance',
  a: point(360,vertices24[0]), b: point(360,vertices24[1]),
  c: point(360,vertices24[2]), d: point(360,vertices24[3])});
sweepAssertions.push('s24-equal-complete-rises');
const crossings24 = [];
for (const i of [0,2,4]) {
  const a=vertices24[i], b=vertices24[i+1];
  const x=a[0]+(210-a[1])*(b[0]-a[0])/(b[1]-a[1]);
  const crossing=[round(x),210];
  crossings24.push(crossing);
  const id = `s24-crossing-${i/2+1}`;
  s24.assertions.push({id, type: 'pointOnLine', point: point(360,crossing),
    a: point(360,a), b: point(360,b), tolerance: 0.0002});
  sweepAssertions.push(id);
}
group(s24, 's24-sweep', sweepIDs, sweepAssertions);

const s25 = base('fig-25', 704,
  'Complete round cathode-ray oscilloscope apparatus with its double rim, light mounting plate, ' +
  'dark housing and lower band, four fasteners, complete circle-bounded 19-vertical/17-horizontal ' +
  'graticule, and source-landmark-bound damped voltage trace. No calibrated axes or units.');
delete s25.source.image.id;
delete s25.source.image.bytes;
const h=704, center=[320,310], radius=212, step=22.6;
const polygon = (id, coords, fill, width=0.5) => ({
  id, type: 'polygon', points: coords.map(p => point(h,p)),
  fill, fillOpacity: 1, stroke: fill, strokeWidth: width,
});
const disk = r => Array.from({length: 128}, (_,i) => [
  round(center[0]+r*Math.cos(i*2*Math.PI/128)),
  round(center[1]+r*Math.sin(i*2*Math.PI/128)),
]);
s25.objects.push(
  polygon('s25-housing', [[44,28],[596,28],[596,662],[44,662]], 'ink'),
  polygon('s25-lower-band', [[44,540],[596,540],[596,662],[44,662]], 'ink'),
  polygon('s25-mount', [[124,102],[512,102],[529,119],[529,493],[512,518],[120,518],[104,494],[104,125]], 'paper'),
  polygon('s25-outer-rim-disk', disk(221), 'ink'),
  polygon('s25-rim-gap-disk', disk(216.5), 'paper'),
  polygon('s25-inner-rim-disk', disk(213.5), 'ink'),
  polygon('s25-screen-disk', disk(radius), 'paper'),
);
const apparatusIDs = s25.objects.map(o => o.id);
const apparatusAssertions = [];
for (const [id, r, width] of [['s25-outer-rim',221,1], ['s25-inner-rim',213.5,1]]) {
  s25.objects.push({id, type:'circle', center: point(h,center), radius:r,
    stroke:'ink', strokeWidth:width, fillOpacity:0});
  apparatusIDs.push(id);
  for (let i=0;i<4;i++) {
    const a=[center[0]+r*Math.cos(i*Math.PI/2),center[1]+r*Math.sin(i*Math.PI/2)];
    const aid=`${id}-cardinal-${i}`;
    s25.assertions.push({id:aid,type:'pointOnCircle',point:point(h,a),center:point(h,center),radius:r});
    apparatusAssertions.push(aid);
  }
}
const source25 = inventory.figures.find(f=>f.id==='fig-25');
const sourceToScreen25 = p => [round(320+(p[0]-218)*1.28),round(310+(p[1]-220)*1.28)];
for (const [i,sourceAt] of source25.groups.find(g=>g.id==='s25-apparatus').fastenersApprox.entries()) {
  const at=sourceToScreen25(sourceAt), id=`s25-fastener-${i+1}`;
  s25.objects.push({id,type:'circle',center:point(h,at),radius:11,stroke:'ink',strokeWidth:1,
    fill:'ink',fillOpacity:1},
  {id:`${id}-hole`,type:'circle',center:point(h,at),radius:3.5,stroke:'paper',strokeWidth:0.5,
    fill:'paper',fillOpacity:1});
  apparatusIDs.push(id, `${id}-hole`);
  const aid=`${id}-inside-mount`;
  s25.assertions.push({id:aid,type:'inside',point:point(h,at),container:'s25-mount'});
  apparatusAssertions.push(aid);
}
s25.assertions.push({id:'s25-ten-circles',type:'objectCount',objectType:'circle',count:10});
apparatusAssertions.push('s25-ten-circles');
group(s25,'s25-apparatus',apparatusIDs,apparatusAssertions);

const core=[center[0]-6*step,center[1]-6*step,center[0]+6*step,center[1]+6*step];
s25.objects.push({id:'s25-core-grid',type:'grid',
  bounds:[round(core[0]),round(h-core[1]),round(core[2]),round(h-core[3])],
  xStep:step,yStep:step,xOffset:center[0],yOffset:h-center[1],
  stroke:'muted',strokeWidth:1.3,opacity:0.52});
s25.assertions.push({id:'s25-core-12x12',type:'gridDimensions',grid:'s25-core-grid',columns:12,rows:12});
const gridIDs=['s25-core-grid'], gridAssertions=['s25-core-12x12'], tracks=[];
function gridSegment(id,a,b) {
  s25.objects.push({id,type:'segment',from:point(h,a),to:point(h,b),
    stroke:'muted',strokeWidth:1.3,opacity:0.52});
  gridIDs.push(id);
  gridAssertions.push(displacement(s25,`${id}-extent`,a,b));
}
for (const [orientation,limit] of [['v',9],['h',8]]) {
  for (let i=-limit;i<=limit;i++) {
    const offset=i*step, extent=Math.sqrt(radius*radius-offset*offset);
    const a=orientation==='v'?[center[0]+offset,center[1]-extent]:[center[0]-extent,center[1]+offset];
    const b=orientation==='v'?[center[0]+offset,center[1]+extent]:[center[0]+extent,center[1]+offset];
    const id=`s25-${orientation}-track-${i+limit+1}`;
    if (Math.abs(i)<=6) {
      const coreA=orientation==='v'?[a[0],core[1]]:[core[0],a[1]];
      const coreB=orientation==='v'?[a[0],core[3]]:[core[2],a[1]];
      gridSegment(`${id}-first-extension`,a,coreA);
      gridSegment(`${id}-last-extension`,coreB,b);
    } else gridSegment(id,a,b);
    for (const [suffix,p] of [['first',a],['last',b]]) {
      const aid=`${id}-${suffix}-on-screen`;
      s25.assertions.push({id:aid,type:'pointOnCircle',point:point(h,p),center:point(h,center),
        radius,tolerance:0.000002});
      gridAssertions.push(aid);
    }
    tracks.push({id,orientation,index:i,offset:round(offset),start:a.map(round),end:b.map(round)});
  }
}
group(s25,'s25-graticule',gridIDs,gridAssertions,['gridDimensions']);

const sourceTrace = source25.groups.find(g=>g.id==='s25-damped-trace');
const trace = sourceTrace.landmarks.map(k=>({...k,screen:sourceToScreen25(k.atApprox)}));
let d=`M ${trace[0].screen.join(' ')}`;
const traceAssertions=[];
for (let i=0;i<trace.length-1;i++) {
  const a=trace[i].screen,b=trace[i+1].screen,dx=b[0]-a[0];
  d+=` C ${round(a[0]+dx/3)} ${a[1]} ${round(b[0]-dx/3)} ${b[1]} ${b.join(' ')}`;
  traceAssertions.push(displacement(s25,`${trace[i].id}-to-next`,a,b));
}
s25.objects.push({id:'s25-damped-trace',type:'svgPath',d,stroke:'accent',strokeWidth:4,
  fillOpacity:0,dash:0});
group(s25,'s25-damped-trace',['s25-damped-trace'],traceAssertions);
const mapping = {
  schema:'d280-source-to-geometry@1', sourceInventorySha256:freeze.sourceInventory.sha256,
  fig24:{canvas:[640,360],vertices:vertices24,baselineCrossings:crossings24,
    calibration:'None; screen-space coordinates only.',sourceLandmarkIDs:
      inventory.figures[0].groups.find(g=>g.id==='s24-sweep').landmarks.map(k=>k.id),
    regularization:'Orthogonal axes, equal repeated rises, instantaneous vertical resets, same source endpoint topology.'},
  fig25:{canvas:[640,h],screenCenter:center,screenRadius:radius,sourceTransform:
    'x = 320 + (sourceX - 218)*1.28; y = 310 + (sourceY - 220)*1.28',
    graticule:{verticalTracks:19,horizontalTracks:17,coreColumns:12,coreRows:12,step,
      calibration:'Uncalibrated equal-spacing schematic, not volts/div or time/div.',tracks},
    trace,referenceLevel:sourceToScreen25([218,sourceTrace.referenceLevelApproxY])[1],
    interpolation:'One monotone cubic per consecutive source landmark, horizontal extrema tangents; no sine/exponential model.'},
  sourcePointMarkers:'Neither original has plotted point markers. Segment/cubic endpoint relationships use literal coordinates, not invented visible dot objects.',
};
for (const spec of [s24,s25]) {
  const dir=path.join(own,spec.id);
  fs.mkdirSync(dir,{recursive:true});
  const file=path.join(dir,'spec.json');
  fs.writeFileSync(file,JSON.stringify(spec,null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify({figure:spec.id,path:file,objects:spec.objects.length,assertions:spec.assertions.length,
    authoritativeLanguages:spec.source.authoritativeText.length}));
}
fs.writeFileSync(path.join(own,'source-to-geometry.json'),JSON.stringify(mapping,null,2)+'\n',{flag:'wx'});
