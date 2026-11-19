const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
const resume = path.join(root,'.intentfold/tickets/STEMROBIN-182/tmp/resume182-13');
const own = path.join(resume,'n45-modern-figure-author');
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const load = p => JSON.parse(fs.readFileSync(p,'utf8'));
const write = (p,d) => {
  assert(p.startsWith(own+'/'));
  fs.mkdirSync(path.dirname(p),{recursive:true});
  fs.writeFileSync(p,JSON.stringify(d,null,2)+'\n');
};
assert.equal(process.cwd(),root);
assert(fs.existsSync(path.join(own,'EVIDENCE/source-inventory-BEFORE-DRAWING.json')));
assert(!fs.existsSync(path.join(own,'authoring-binding.json')));
const inventory=load(path.join(own,'WORKING/source-inventory.json'));
const lessonPath=path.join(resume,'n45-modern-author/WORKING/alg7-c4-s3-n45/lesson.template.json');
const exercisesPath=path.join(resume,'n45-modern-author/WORKING/alg7-c4-s3-n45/exercises.template.json');
const lesson=load(lessonPath), exercises=load(exercisesPath);
const sourceDir=path.join(resume,'n45-source-stage/artifacts/7a/figures');
const n = v => Number(v.toFixed(10));
const pt=(id,at,more={})=>({id,type:'point',at,...more});
const text=(id,at,s,fontSize=22,placement={position:'CENTER'})=>({
  id,type:'text',at,text:s,fontSize,fontWeight:500,labelPlacement:placement,labelColor:'ink'
});
const edge=(id,type,from,to,more={})=>({id,type,from,to,stroke:'ink',strokeWidth:3,...more});
const displacement=(id,from,to,dx,dy)=>({id,type:'displacement',from,to,dx:n(dx),dy:n(dy)});
const connects=(id,arrow,from,to)=>({id,type:'connects',arrow,from,to});
const count=(id,t,count)=>({id,type:'objectCount',objectType:t,count});
function base(id,canvas,display,authoritativeText) {
  return {
    schema:'ld-s10y-image/figure-spec@2',id,mode:'deterministic',
    description: id==='fig-59'
      ? 'Inspect the height/time graph for the source worked example, its two height-60 guides and maximum; keep the source lattice and physical endpoints.'
      : id==='fig-60'
        ? 'Read the bounded graph of f for exercise 889. Preserve its source query crossings, minimum and endpoint guides without supplying an analytic law or a solved inequality.'
        : 'Compare the two given A(x), B(x squared) number-line orders for exercise 891. The source schematic is unscaled; leave all requested new points unmarked.',
    source:{image:{path:path.join(sourceDir,id+'.png'),sha256:hash(path.join(sourceDir,id+'.png'))},
      authoritativeText,inventory:[]},
    canvas:{...canvas,background:'paper',keepAspectRatio:false},display,
    objects:[],assertions:[],layout:{minLabelGap:3}
  };
}
function graphFrame(spec,p,bounds,steps,columns,rows) {
  const grid={id:p+'-grid',type:'grid',bounds,xStep:steps[0],yStep:steps[1],
    xOffset:0,yOffset:0,stroke:'grid',strokeWidth:1};
  spec.objects.push(grid);
  spec.assertions.push({id:p+'-grid-dimensions',type:'gridDimensions',grid:grid.id,columns,rows});
  spec.source.inventory.push({
    id:p+'-source-grid',
    description:inventory.figures[spec.id].sourceFacts[1],
    objects:[grid.id],assertions:[p+'-grid-dimensions'],requires:['gridDimensions']
  });
}
function axes(spec,p,xBounds,yBounds,xValues,yValues,xLabel,yLabel) {
  const horizontal=p+(p==='f59'?'-t-axis':'-x-axis');
  const vertical=p+(p==='f59'?'-h-axis':'-y-axis');
  spec.objects.push(edge(horizontal,'axis',[xBounds[0],0],[xBounds[1],0]));
  spec.objects.push(edge(vertical,'axis',[0,yBounds[0]],[0,yBounds[1]]));
  const xArrow=p+(p==='f59'?'-t-arrow':'-x-arrow');
  const yArrow=p+(p==='f59'?'-h-arrow':'-y-arrow');
  const xStart=[xBounds[1]-0.5,0],xEnd=[xBounds[1],0];
  const yStart=[0,yBounds[1]-(p==='f59'?8:0.5)],yEnd=[0,yBounds[1]];
  spec.objects.push(edge(xArrow,'arrow',xStart,xEnd));
  spec.objects.push(edge(yArrow,'arrow',yStart,yEnd));
  spec.assertions.push(connects(xArrow+'-binding',xArrow,xStart,xEnd));
  spec.assertions.push(connects(yArrow+'-binding',yArrow,yStart,yEnd));
  const labels=[];
  for(const x of xValues) {
    const id=p+'-x-label-'+String(x).replace('-','minus');
    labels.push(id);
    spec.objects.push(text(id,[x,0],String(x),22,x===0
      ? {position:'SW',gap:14,offset:[-2,p==='f59'?9:5]}
      : {position:'S',gap:14,offset:[0,p==='f59'?9:5]}));
  }
  for(const y of yValues) {
    const id=p+'-y-label-'+y;
    labels.push(id);
    spec.objects.push(text(id,[0,y],String(y),22,
      {position:'W',gap:p==='f59'?9:12,offset:[p==='f59'?0:-36,0]}));
  }
  spec.objects.push(text(p+'-x-name',xLabel.at,xLabel.text));
  spec.objects.push(text(p+'-y-name',yLabel.at,yLabel.text));
  labels.push(p+'-x-name',p+'-y-name');
  spec.source.inventory.push({
    id:p+'-source-axes-labels',
    description:p==='f59'
      ? 'Source upward h axis, rightward t axis, labels 0..8 and 10..90; units translated to metres/seconds.'
      : 'Actual source y (not f) and x labels, upward/rightward axes, horizontal -1,0..6 and vertical 1..4.',
    objects:[horizontal,vertical,xArrow,yArrow,...labels],
    assertions:[xArrow+'-binding',yArrow+'-binding']
  });
}
const s59=base('fig-59',{width:640,height:720,boundingBox:[-1.8,118,11,-26]},
  {purpose:'instructional',layout:'scroll',minTextPx:16,widths:[640]},
  lesson.prose.filter(b=>b.kind==='p'&&b.source_refs.some(r=>/^p026[67]#/.test(r)))
    .map(b=>({lesson:lesson.id,text:b.text})));
graphFrame(s59,'f59',[-1,110,9.5,-10],[0.5,5],21,24);
axes(s59,'f59',[-1,9.4],[-10,108],[0,1,2,3,4,5,6,7,8],[10,20,30,40,50,60,70,80,90],
  {at:[10.1,-1],text:'t (s)'},{at:[0,114],text:'h (m)'});
const f59points=[
  ['f59-ground-start',[0,0]],['f59-cross-2',[2,60]],['f59-maximum',[4,80]],
  ['f59-cross-6',[6,60]],['f59-ground-end',[8,0]],['f59-guide2-foot',[2,0]],
  ['f59-guide6-foot',[6,0]],['f59-level-start',[0,60]],['f59-level-end',[9.5,60]]
];
s59.objects.push(...f59points.map(([id,at])=>pt(id,at,{visible:false})));
const relation59=[
  displacement('f59-rise60','f59-ground-start','f59-cross-2',2,60),
  displacement('f59-rise-to-max','f59-cross-2','f59-maximum',2,20),
  displacement('f59-fall-to60','f59-maximum','f59-cross-6',2,-20),
  displacement('f59-return-ground','f59-cross-6','f59-ground-end',2,-60),
  displacement('f59-foot2','f59-ground-start','f59-guide2-foot',2,0),
  displacement('f59-foot6','f59-ground-start','f59-guide6-foot',6,0),
  displacement('f59-height2','f59-guide2-foot','f59-cross-2',0,60),
  displacement('f59-height6','f59-guide6-foot','f59-cross-6',0,60),
  displacement('f59-level-offset','f59-ground-start','f59-level-start',0,60),
  displacement('f59-level-extent','f59-level-start','f59-level-end',9.5,0)
];
s59.assertions.push(...relation59);
const screen=(spec,[x,y])=>[n(x-spec.canvas.boundingBox[0]),n(spec.canvas.boundingBox[1]-y)];
const pair=a=>a.join(' ');
s59.objects.push({
  id:'f59-curve',type:'svgPath',
  d:`M ${pair(screen(s59,[0,0]))} Q ${pair(screen(s59,[4,160]))} ${pair(screen(s59,[8,0]))}`,
  stroke:'accent',strokeWidth:4.5
});
for(const [id,a,b] of [
  ['f59-level60','f59-level-start','f59-level-end'],
  ['f59-guide2','f59-guide2-foot','f59-cross-2'],
  ['f59-guide6','f59-guide6-foot','f59-cross-6']
]) {
  s59.objects.push(edge(id,'segment',a,b,{stroke:'muted',strokeWidth:2,dash:2}));
  s59.assertions.push(connects(id+'-binding',id,a,b));
}
s59.source.inventory.push({
  id:'f59-source-curve-guides',
  description:'Solid bounded source curve (0,0),(2,60),(4,80),(6,60),(8,0). Exact quadratic is given in prose. Dashed h=60 reaches the right grid edge; t=2,6 guides run only from ground to height 60. Hidden construction nodes add no plotted markers.',
  objects:['f59-curve','f59-level60','f59-guide2','f59-guide6'],
  assertions:[...relation59.map(a=>a.id),'f59-level60-binding','f59-guide2-binding','f59-guide6-binding']
});
s59.assertions.push(count('f59-one-curve','svgPath',1));

const s60=base('fig-60',{width:640,height:440,boundingBox:[-2.75,5.6,7.9166666667,-1.7333333333]},
  {purpose:'instructional',layout:'scroll',minTextPx:16,widths:[640]},
  [{lesson:lesson.id,exercise:'889',text:exercises.exercises.find(e=>e.number==='889').text}]);
graphFrame(s60,'f60',[-2,5,7,-1],[0.5,0.5],18,12);
axes(s60,'f60',[-2,6.9],[-1,4.85],[-1,0,1,2,3,4,5,6],[1,2,3,4],
  {at:[6.8,-0.45],text:'x'},{at:[-0.5,4.8],text:'y'});
const f60anchors=[
  ['f60-left-end',[-1.5,3.5],0],
  ['f60-cross-0',[0,3],-0.55],
  ['f60-shape-1',[1,2.2],-1.15],
  ['f60-shape-1p5',[1.5,1.5],-1.4],
  ['f60-minimum',[2,1],0],
  ['f60-shape-3',[3,2.2],0.95],
  ['f60-cross-4',[4,3],0.7],
  ['f60-shape-5',[5,3.6],0.5],
  ['f60-right-end',[6,4],0.3]
];
s60.objects.push(...f60anchors.map(([id,at])=>pt(id,at,{visible:false})),
  pt('f60-left-foot',[-1.5,0],{visible:false}),pt('f60-right-foot',[6,0],{visible:false}));
const relation60=[];
for(let i=1;i<f60anchors.length;i++) {
  const [id,a]=f60anchors[i], [prior,b]=f60anchors[i-1];
  relation60.push(displacement(id+'-offset',prior,id,a[0]-b[0],a[1]-b[1]));
}
relation60.push(displacement('f60-left-height','f60-left-foot','f60-left-end',0,3.5));
relation60.push(displacement('f60-right-height','f60-right-foot','f60-right-end',0,4));
relation60.push(displacement('f60-domain-span','f60-left-foot','f60-right-foot',7.5,0));
s60.assertions.push(...relation60);
let d=`M ${pair(screen(s60,f60anchors[0][1]))}`;
for(let i=1;i<f60anchors.length;i++) {
  const [,a,ma]=f60anchors[i-1], [,b,mb]=f60anchors[i], h=b[0]-a[0];
  const c1=[a[0]+h/3,a[1]+ma*h/3], c2=[b[0]-h/3,b[1]-mb*h/3];
  d+=` C ${pair(screen(s60,c1))} ${pair(screen(s60,c2))} ${pair(screen(s60,b))}`;
}
s60.objects.push({id:'f60-curve',type:'svgPath',d,stroke:'accent',strokeWidth:4.5});
for(const [id,a,b] of [
  ['f60-left-guide','f60-left-foot','f60-left-end'],
  ['f60-right-guide','f60-right-foot','f60-right-end']
]) {
  s60.objects.push(edge(id,'segment',a,b,{stroke:'muted',strokeWidth:2,dash:2}));
  s60.assertions.push(connects(id+'-binding',id,a,b));
}
s60.source.inventory.push({
  id:'f60-source-curve-guides',
  description:'Source-constrained nonanalytic curve with included domain [-1.5,6], endpoints approximately (-1.5,3.5),(6,4), y=3 crossings (0,3),(4,3), sole minimum (2,1), approximate traced shape locators at x=1,1.5,3,5. Preserve only the source dashed endpoint guides; add no query guides, labels or solution intervals.',
  objects:['f60-curve','f60-left-guide','f60-right-guide'],
  assertions:[...relation60.map(a=>a.id),'f60-left-guide-binding','f60-right-guide-binding']
});
s60.assertions.push(count('f60-one-curve','svgPath',1));

const s61=base('fig-61',{width:640,height:320,boundingBox:[0,320,640,0]},
  {purpose:'instructional',layout:'inline',maxWidthPx:640,minTextPx:16,widths:[300,331,640]},
  [{lesson:lesson.id,exercise:'891',text:exercises.exercises.find(e=>e.number==='891').text}]);
const factor=640/872;
for(const [panel,y,origin,a,b,left,right] of [
  ['a',225,201,334,508,56,853],
  ['b',75,203,538,367,64,857]
]) {
  const p='f61-'+panel, O=[n(origin*factor),y], A=[n(a*factor),y], B=[n(b*factor),y];
  const L=[n(left*factor),y],R=[n(right*factor),y];
  s61.objects.push(pt(p+'-origin',O,{visible:false}),
    pt(p+'-A',A,{fill:panel==='a'?'paper':'ink',stroke:'ink',size:4,strokeWidth:2.5}),
    pt(p+'-B',B,{fill:'ink',stroke:'ink',size:4,strokeWidth:2.5}),
    edge(p+'-line','arrow',L,R,{strokeWidth:3.5}),
    edge(p+'-origin-tick','segment',[O[0],y-8],[O[0],y+8]),
    text(p+'-zero',[O[0],y+43],'0',36),
    text(p+'-A-text',[A[0],y+43],'A(x)',36),
    text(p+'-B-text',[B[0],y+43],'B(x\u00b2)',36),
    text(p+'-panel',[20,y],panel+')',36));
  const first=panel==='a'?p+'-A':p+'-B',second=panel==='a'?p+'-B':p+'-A';
  const firstPos=panel==='a'?A:B,secondPos=panel==='a'?B:A;
  const firstAssertion=p+'-order-'+(panel==='a'?'A':'B');
  const secondAssertion=p+'-order-'+(panel==='a'?'B':'A');
  s61.assertions.push(
    displacement(firstAssertion,p+'-origin',first,firstPos[0]-O[0],0),
    displacement(secondAssertion,first,second,secondPos[0]-firstPos[0],0),
    {id:p+'-collinear',type:'collinear',a:p+'-A',b:p+'-B',c:O},
    {id:p+'-all-on-line',type:'pointOnLine',point:p+'-origin',a:p+'-A',b:p+'-B'},
    connects(p+'-line-binding',p+'-line',L,R),
    connects(p+'-tick-binding',p+'-origin-tick',[O[0],y-8],[O[0],y+8]));
  s61.source.inventory.push({
    id:p+'-source-panel',
    description:panel==='a'
      ? 'Top source panel: origin tick and 0, hollow A(x), filled B(x squared), 0<A<B and right arrow. Screen offsets are schematic, not numeric units. Latin panel label.'
      : 'Bottom source panel: origin tick and 0, filled B(x squared), filled A(x), 0<B<A and right arrow. No unit tick or requested answer point.',
    objects:[p+'-A',p+'-B',p+'-line',p+'-origin-tick',p+'-zero',p+'-A-text',p+'-B-text',p+'-panel'],
    assertions:[firstAssertion,secondAssertion,p+'-collinear',p+'-all-on-line',p+'-line-binding',p+'-tick-binding'],
    requires:['pointRelationships']
  });
}
s61.assertions.push(count('f61-point-constructions','point',6),count('f61-two-lines','arrow',2),
  count('f61-two-origin-ticks','segment',2),count('f61-eight-labels','text',8));
const specs=[s59,s60,s61];
const files=[];
for(const spec of specs) {
  const p=path.join(own,'WORKING',spec.id,spec.id+'.spec.json');
  write(p,spec); files.push({path:p,sha256:hash(p),objectCount:spec.objects.length,assertionCount:spec.assertions.length});
}
write(path.join(own,'EVIDENCE/inventory-header-amendment.json'),{
  reason:'PNG IHDR receipt establishes actual fig-61 width 872, not the initial approximate 864. One metadata correction before any spec validation/render, no image reopen or content retry.',
  preservedOriginalInventory:hash(path.join(own,'EVIDENCE/source-inventory-BEFORE-DRAWING.json')),
  correctedInventory:hash(path.join(own,'WORKING/source-inventory.json')),
  field:'figures.fig-61.schematicFrame.sourceWidth',before:864,after:872,
  at:new Date().toISOString()
});
fs.chmodSync(path.join(own,'EVIDENCE/inventory-header-amendment.json'),0o444);
write(path.join(own,'authoring-binding.json'),{
  at:new Date().toISOString(),cwd:root,authorScript:{path:__filename,sha256:hash(__filename)},
  priorImmutableInventory:{path:path.join(own,'EVIDENCE/source-inventory-BEFORE-DRAWING.json'),sha256:hash(path.join(own,'EVIDENCE/source-inventory-BEFORE-DRAWING.json'))},
  workingInventory:{path:path.join(own,'WORKING/source-inventory.json'),sha256:hash(path.join(own,'WORKING/source-inventory.json'))},
  authoritativeText:[lessonPath,exercisesPath].map(p=>({path:p,sha256:hash(p)})),
  specs:files,externalModelCalls:0,paidImageCalls:0,renderCalls:0,approval:'none; author candidates only'
});
console.log(JSON.stringify({specs:files,authoringBinding:path.join(own,'authoring-binding.json')},null,2));
