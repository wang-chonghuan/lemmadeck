import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const root = path.dirname(fileURLToPath(import.meta.url));
if (process.cwd() !== repo) throw new Error('Wrong checkout');
const require = createRequire(path.join(repo, '.agents/skills/package.json'));
const {chromium} = require('playwright-core');
const [number, draft] = process.argv.slice(2);
if (!['89', '90'].includes(number) || !['FIRST', 'REPAIR1'].includes(draft)) throw new Error('Unauthorized snapshot');
const stem = `fig-g10-${number}.${draft}`;
const pngFile = path.join(root, `${stem}.widths-480-300.png`);
const receiptFile = path.join(root, `${stem}.snapshot.json`);
if (fs.existsSync(pngFile) || fs.existsSync(receiptFile)) throw new Error('Snapshot already attempted');
const bind = absolute => {
  const bytes=fs.readFileSync(absolute);
  return {path:path.relative(repo,absolute), sha256:crypto.createHash('sha256').update(bytes).digest('hex'), bytes:bytes.length};
};
const svgFile=path.join(root,`${stem}.svg`), specFile=path.join(root,`${stem}.spec.json`), renderFile=path.join(root,`${stem}.render.json`);
const spec=JSON.parse(fs.readFileSync(specFile)), render=JSON.parse(fs.readFileSync(renderFile));
if (render.status!=='pass') throw new Error('Dependent snapshot blocked by native failure');
if (render.spec.sha256!==bind(specFile).sha256 || render.output.svg.sha256!==bind(svgFile).sha256) throw new Error('Output binding mismatch');
const receipt = {
  schema:'bounded-author-isolated-snapshot@1', figure:spec.id, draft,
  mechanism:'Installed playwright-core; isolated headless Chromium; unchanged self-contained exported SVG; no external requests or user browser.',
  purpose:'Author inspection only, not independent approval or product integration.',
  spec:bind(specFile), svg:bind(svgFile), render:bind(renderFile),
  display:spec.display, headed:false, formalProductTest:false, independentReview:false, semanticApproval:false,
  imageContextLoadsByCommand:0, plannedImageUnitsOnContactSheetInspection:2, measurements:[]
};
let browser;
try {
  const executablePath=[chromium.executablePath(),'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(p=>fs.existsSync(p));
  if (!executablePath) throw new Error('Installed Chromium unavailable; no install authorized');
  browser=await chromium.launch({executablePath,headless:true});
  const page=await browser.newPage({viewport:{width:804,height:Math.ceil(spec.canvas.height*480/spec.canvas.width)},deviceScaleFactor:1});
  let externalRequests=0;
  await page.route('**/*', route=>{externalRequests++;return route.abort();});
  const svg=fs.readFileSync(svgFile,'utf8');
  await page.setContent(`<style>html,body{margin:0;background:white;overflow:hidden}body{display:flex;gap:24px;align-items:flex-start}section{flex:none}svg{display:block;width:100%;height:auto}</style><section data-width="480" style="width:480px">${svg}</section><section data-width="300" style="width:300px">${svg}</section>`);
  await page.evaluate(()=>document.fonts.ready);
  receipt.measurements=await page.evaluate(async () => {
    const results=[];
    for (const pane of document.querySelectorAll('section')) {
      const svg=pane.querySelector('svg'), frame=svg.getBoundingClientRect(), width=Number(pane.dataset.width);
      const localBox=n=>{const b=n.getBoundingClientRect();return{x:b.x-frame.x,y:b.y-frame.y,width:b.width,height:b.height};};
      const within=b=>b.x>=-0.01 && b.y>=-0.01 && b.x+b.width<=frame.width+0.01 && b.y+b.height<=frame.height+0.01;
      const labels=[...svg.querySelectorAll('text')].map(n=>({
        id:n.getAttribute('data-label-id'),text:n.textContent,box:localBox(n),
        fontPx:Number(n.getAttribute('font-size'))*Math.hypot(n.getScreenCTM().a,n.getScreenCTM().b)
      }));
      const geometry=[...svg.querySelectorAll('line,path,circle,ellipse,polyline,polygon')].filter(n=>!n.closest('defs') && getComputedStyle(n).display!=='none' && getComputedStyle(n).visibility!=='hidden').map(n=>({id:n.id,box:localBox(n)})).filter(g=>g.box.width || g.box.height);
      const overlaps=[];
      for(let i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++){
        const a=labels[i].box,b=labels[j].box;
        if(Math.min(a.x+a.width,b.x+b.width)>Math.max(a.x,b.x) && Math.min(a.y+a.height,b.y+b.height)>Math.max(a.y,b.y))overlaps.push([labels[i].id,labels[j].id]);
      }
      const roles=[...new Set([...svg.querySelectorAll('[stroke],[fill]')].flatMap(n=>['stroke','fill'].map(k=>n.getAttribute(k)).filter(v=>v?.startsWith('var(--ld-figure-'))))];
      const dashedPaths=[...svg.querySelectorAll('[stroke-dasharray]')].filter(n=>!n.closest('defs')).map(n=>({id:n.id,dash:n.getAttribute('stroke-dasharray')}));
      const clone=svg.cloneNode(true);clone.setAttribute('width',String(width));clone.setAttribute('height',String(frame.height));
      const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)],{type:'image/svg+xml'}));
      let pixels;
      try{
        const image=new Image();image.src=url;await image.decode();
        const canvas=document.createElement('canvas');canvas.width=width;canvas.height=Math.round(frame.height);
        const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0,canvas.width,canvas.height);
        const rgba=ctx.getImageData(0,0,canvas.width,canvas.height).data;
        let ink=0,dark=0,border=0;
        for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++){
          const i=(y*canvas.width+x)*4;
          if(Math.min(rgba[i],rgba[i+1],rgba[i+2])<235){
            ink++;if(Math.max(rgba[i],rgba[i+1],rgba[i+2])<100)dark++;
            if(x<2 || y<2 || x>=canvas.width-2 || y>=canvas.height-2)border++;
          }
        }
        pixels={width,height:canvas.height,ink,dark,border,nonblankNotBlack:ink>100 && dark>100 && ink<canvas.width*canvas.height*0.35,unclipped:border===0};
      }finally{URL.revokeObjectURL(url);}
      results.push({width:frame.width,height:frame.height,labels,minFontPx:Math.min(...labels.map(l=>l.fontPx)),clippedLabels:labels.filter(l=>!within(l.box)),clippedGeometry:geometry.filter(g=>!within(g.box)),labelOverlaps:overlaps,geometryCount:geometry.length,semanticRoles:roles,dashedPaths,pixels});
    }
    return results;
  });
  receipt.externalRequests=externalRequests;
  receipt.checks={
    declaredWidths:receipt.measurements.map(m=>m.width).join(',')==='480,300',
    labelsAtLeast16:receipt.measurements.every(m=>m.labels.every(l=>l.fontPx>=16)),
    labelsAndGeometryUnclipped:receipt.measurements.every(m=>!m.clippedLabels.length && !m.clippedGeometry.length),
    labelsDoNotOverlap:receipt.measurements.every(m=>!m.labelOverlaps.length),
    nonblankNotBlack:receipt.measurements.every(m=>m.pixels.nonblankNotBlack && m.pixels.unclipped),
    semanticPalette:receipt.measurements.every(m=>m.semanticRoles.length>0),
    noExternalRequests:externalRequests===0,
    allLabelsPresent:receipt.measurements.every(m=>m.labels.length===render.labels)
  };
  await page.screenshot({path:pngFile,animations:'disabled'});
  receipt.image=bind(pngFile);
  receipt.status=Object.values(receipt.checks).every(Boolean)?'AUTHOR_SNAPSHOT_MECHANICAL_SATISFIED':'AUTHOR_SNAPSHOT_FAILED';
}catch(error){
  receipt.status='EXECUTION_FAULT';receipt.error=error.stack;process.exitCode=1;
}finally{
  if(browser)await browser.close();
  fs.writeFileSync(receiptFile,JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
  for(const file of[receiptFile,pngFile,specFile,svgFile,renderFile])if(fs.existsSync(file))fs.chmodSync(file,0o444);
}
console.log(JSON.stringify({receipt:bind(receiptFile),status:receipt.status,checks:receipt.checks,error:receipt.error}));
if(receipt.status==='AUTHOR_SNAPSHOT_FAILED')process.exitCode=2;
