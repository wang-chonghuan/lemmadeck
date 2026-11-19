const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const root='/Users/yong/.codex/worktrees/d9b1/lemmadeck';
const own=path.join(root,'.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n45-modern-figure-author');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const inventory=JSON.parse(fs.readFileSync(path.join(own,'WORKING/source-inventory.json'),'utf8'));
const close=(a,b,msg)=>assert(Math.abs(a-b)<1e-7,`${msg}: ${a} != ${b}`);
const bezier=(p,t)=>p.length===3
  ? p[0]*(1-t)**2+2*p[1]*t*(1-t)+p[2]*t*t
  : p[0]*(1-t)**3+3*p[1]*t*(1-t)**2+3*p[2]*t*t*(1-t)+p[3]*t**3;
function paths(s) {
  const curve=s.objects.find(o=>o.type==='svgPath');
  const tokens=curve.d.match(/[MQC]|-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?/gi);
  let i=0,at=null; const segments=[];
  const coord=()=>[s.canvas.boundingBox[0]+Number(tokens[i++]),s.canvas.boundingBox[1]-Number(tokens[i++])];
  while(i<tokens.length) {
    const cmd=tokens[i++];
    if(cmd==='M') at=coord();
    else if(cmd==='Q'||cmd==='C') {
      const seg=[at,coord(),coord()];
      if(cmd==='C') seg.push(coord());
      segments.push(seg);at=seg.at(-1);
    } else throw new Error('Unexpected curve command');
  }
  return {curve,segments};
}
const results=[];
for(const id of ['fig-59','fig-60','fig-61']) {
  const file=path.join(own,'WORKING',id,id+'.spec.json');
  const s=JSON.parse(fs.readFileSync(file,'utf8')), facts=[];
  const points=s.objects.filter(o=>o.type==='point');
  for(const p of points) {
    assert(s.assertions.some(a=>JSON.stringify(a).includes('"'+p.id+'"')),`Uncovered point ${p.id}`);
  }
  facts.push({fact:'Every point construction appears in an executable FigureSpec relationship',points:points.map(p=>p.id)});
  if(id!=='fig-61') {
    const f=inventory.figures[id].mathematicalFrame,grid=s.objects.find(o=>o.type==='grid');
    assert.deepEqual(grid.bounds,f.bounds);assert.deepEqual([grid.xStep,grid.yStep],f.steps);
    assert.deepEqual([grid.xOffset,grid.yOffset],f.offsets);
    const dim=s.assertions.find(a=>a.type==='gridDimensions');
    assert.equal(dim.columns,f.columns);assert.equal(dim.rows,f.rows);
    facts.push({fact:'Exact grid dimensions/steps/phases/origin offsets',bounds:grid.bounds,columns:dim.columns,rows:dim.rows,steps:f.steps,offsets:f.offsets});
    const {curve,segments}=paths(s);
    close(segments[0][0][0],f.curveDomain[0],'domain start');
    close(segments.at(-1).at(-1)[0],f.curveDomain[1],'domain end');
    const samples=[];
    for(const segment of segments) {
      const xs=segment.map(p=>p[0]),ys=segment.map(p=>p[1]);
      for(let j=0;j<=1000;j++) {
        const t=j/1000, x=bezier(xs,t),y=bezier(ys,t);
        assert(x>=f.curveDomain[0]-1e-8&&x<=f.curveDomain[1]+1e-8);
        assert(y>=s.canvas.boundingBox[3]&&y<=s.canvas.boundingBox[1]);
        samples.push([x,y]);
        if(id==='fig-59') close(y,40*x-5*x*x,'whole bounded source quadratic');
      }
    }
    if(id==='fig-59') {
      for(const [x,y] of f.checkpoints) {
        const seg=segments[0],t=x/8;
        close(bezier(seg.map(p=>p[0]),t),x,'source time');
        close(bezier(seg.map(p=>p[1]),t),y,'source height');
      }
      close(Math.max(...samples.map(p=>p[1])),80,'maximum');
      facts.push({fact:'Exact curve h=40t-5t^2 over [0,8]; crossings (2,60),(6,60), unique max (4,80), ground endpoints',samples:samples.length});
    } else {
      const critical=f.sourceCriticalPoints;
      for(const [x,y] of [...critical,...f.shapeLocators]) {
        const endpoints=segments.flatMap(a=>[a[0],a.at(-1)]);
        assert(endpoints.some(p=>Math.abs(p[0]-x)<1e-7&&Math.abs(p[1]-y)<1e-7),`Missing traced point ${x},${y}`);
      }
      for(const seg of segments) {
        const xs=seg.map(p=>p[0]),ys=seg.map(p=>p[1]);
        assert(xs.every((x,j)=>j===0||x>xs[j-1]),'Curve must remain a function');
        const increasing=seg[0][0]>=2;
        assert(ys.every((y,j)=>j===0||(increasing?y>=ys[j-1]-1e-8:y<=ys[j-1]+1e-8)),
          'Bezier control hull must preserve monotonicity; no overshoot');
        if(seg.at(-1)[0]<=0 || seg[0][0]>=4) assert(ys.every(y=>y>=3-1e-8));
        else assert(ys.every(y=>y<=3+1e-8));
      }
      const min=samples.reduce((a,b)=>a[1]<b[1]?a:b);
      close(min[0],2,'unique minimum x');close(min[1],1,'unique minimum y');
      const incoming=segments.find(seg=>Math.abs(seg.at(-1)[0]-2)<1e-7);
      const outgoing=segments.find(seg=>Math.abs(seg[0][0]-2)<1e-7);
      close(incoming[2][1],1,'left tangent at minimum');close(outgoing[1][1],1,'right tangent at minimum');
      facts.push({fact:'Nonanalytic, source-constrained monotone cubic; only y=3 crossings x=0,4; sole smooth minimum (2,1); included endpoints [-1.5,6]; no branch extension',
        criticalPoints:critical,approximateSourceLocators:f.shapeLocators,samples:samples.length,proof:'Monotone x and y Bezier control hulls per segment; strict interior order except zero endpoint tangent.'});
    }
    const guides=s.objects.filter(o=>o.type==='segment'&&o.dash);
    assert.equal(guides.length,f.guides.length);
    const position=v=>Array.isArray(v)?v:points.find(p=>p.id===v).at;
    for(let i=0;i<guides.length;i++) {
      assert.deepEqual([...position(guides[i].from),...position(guides[i].to)],f.guides[i]);
      assert.equal(guides[i].dash,2);
    }
    assert(!curve.dash); assert(!grid.dash);
    assert.equal(s.display.layout,'scroll');assert.deepEqual(s.display.widths,[640]);
    assert(points.every(p=>p.visible===false),'Do not add source curve point markers');
    facts.push({fact:'Exactly the source solid/dashed distinctions and guide spans; no added visible markers',guides:f.guides});
  } else {
    assert.equal(s.objects.filter(o=>o.type==='arrow').length,2);
    assert.equal(s.objects.filter(o=>o.type==='segment').length,2);
    assert.equal(points.filter(p=>p.visible!==false).length,4);
    assert.equal(s.objects.filter(o=>o.type==='grid'||o.type==='axis'||o.type==='svgPath').length,0);
    const texts=s.objects.filter(o=>o.type==='text').map(o=>o.text).sort();
    assert.deepEqual(texts,['0','0','A(x)','A(x)','B(x\u00b2)','B(x\u00b2)','a)','b)'].sort());
    for(const [panel,origin,A,B] of [['a',201,334,508],['b',203,538,367]]) {
      const get=k=>points.find(p=>p.id===`f61-${panel}-${k}`);
      for(const [name,v] of [['origin',origin],['A',A],['B',B]]) close(get(name).at[0],v*640/872,'source-relative schematic x');
      close(get('A').at[1],get('B').at[1],'shared panel line');
      assert(panel==='a'?get('A').at[0]<get('B').at[0]:get('B').at[0]<get('A').at[0]);
    }
    assert.equal(points.find(p=>p.id==='f61-a-A').fill,'paper');
    assert(points.filter(p=>p.visible!==false&&p.id!=='f61-a-A').every(p=>p.fill==='ink'));
    for(const width of s.display.widths) close(36*width/640,36*width/640,'label transform');
    assert(36*Math.min(...s.display.widths)/640>=16);
    facts.push({fact:'Two independent unscaled panels; all four A/B points, origin ticks, source order/relative spacing, top hollow A; no answer-bearing unit tick or requested point',
      labels:texts,unitScale:'none',minimumDeclaredTextPx:36*300/640});
  }
  results.push({figure:id,spec:{path:file,sha256:hash(file)},facts,status:'pass'});
}
console.log(JSON.stringify({schema:'n45-mathematical-assertion-evidence@1',authorCheckOnly:true,
  independentFigureReview:'pending; this mechanical evidence is not figure approval',
  checker:{path:__filename,sha256:hash(__filename)},inventoryHash:hash(path.join(own,'WORKING/source-inventory.json')),
  results,status:'pass'},null,2));
