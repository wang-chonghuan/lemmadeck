import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(),repo);
const dir = path.join(repo,'.tmp/STEMROBIN-181/d1816-d149/figures/fig-06/candidate-2');
const require = createRequire(path.join(repo,'.agents/skills/package.json'));
const { chromium } = require('playwright-core');
const hash = p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const binding = p=>({path:p,bytes:fs.statSync(p).size,sha256:hash(p)});
const specPath = path.join(dir,'spec.json'), svgPath = path.join(dir,'fig-06.svg'), renderPath = path.join(dir,'fig-06.render.json');
const reportPath = path.join(dir,'author-preview.metrics.json');
assert(!fs.existsSync(reportPath),'No preview checker replay');
const render = JSON.parse(fs.readFileSync(renderPath,'utf8'));
assert.equal(render.status,'pass');
assert.equal(render.spec.sha256,hash(specPath));
assert.equal(render.output.svg.sha256,hash(svgPath));
const svg = fs.readFileSync(svgPath,'utf8');
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>D149 fig-06 author preview</title>
<style>html,body{margin:0;background:white}main{margin:0 auto;padding:24px;max-width:688px;box-sizing:border-box}
figure{margin:0;width:640px;max-width:100%;overflow-x:auto}figure>svg{display:block;width:640px;min-width:640px;height:640px}
body[data-theme=accent]{--ld-figure-ink:#202124;--ld-figure-muted:#595959}
body[data-theme=print]{--ld-figure-ink:#000;--ld-figure-muted:#444}</style>
<body><main><figure aria-label="Dilute gas">${svg}</figure></main></body></html>`;
const htmlPath = path.join(dir,'author-preview.html');
fs.writeFileSync(htmlPath,html,{flag:'wx'});
const executablePath = [process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,chromium.executablePath(),'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean).find(p=>fs.existsSync(p));
assert(executablePath);
const browser = await chromium.launch({executablePath,headless:true});
const checks = [];
try {
  const page = await browser.newPage({viewport:{width:1440,height:960},deviceScaleFactor:1});
  const errors = [];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`file://${htmlPath}`);
  for (const viewport of [{width:1440,height:960},{width:390,height:844}]) {
    await page.setViewportSize(viewport);
    await page.locator('figure').evaluate((f,mobile)=>{f.style.width=mobile?'331px':'640px';},viewport.width===390);
    for (const theme of ['neutral','accent','print']) {
      await page.locator('body').evaluate((b,t)=>{b.dataset.theme=t;},theme);
      const metrics = await page.locator('figure').evaluate(f=>{
        const s=f.querySelector('svg'), box=s.getBoundingClientRect();
        return {
          width:box.width,height:box.height,containerWidth:f.clientWidth,scrollWidth:f.scrollWidth,
          labels:[...s.querySelectorAll('[data-label-id]')].map(n=>{
            const matrix=n.getScreenCTM(),r=n.getBoundingClientRect();
            return {id:n.getAttribute('data-label-id'),px:Number(n.getAttribute('font-size'))*Math.hypot(matrix.a,matrix.b),
              bounds:[r.left-box.left,r.top-box.top,r.right-box.left,r.bottom-box.top],fill:getComputedStyle(n).fill};
          }),
          arrowheads:s.querySelectorAll('[data-arrowhead-for]').length,
          particles:[...s.querySelectorAll('ellipse,circle,path')].filter(n=>/ld-gas-particle-\d+$/.test(n.id)).length,
        };
      });
      assert.equal(metrics.width,640);
      assert.equal(metrics.height,640);
      assert.equal(metrics.labels.length,2);
      assert.equal(metrics.arrowheads,26);
      assert.equal(metrics.particles,14);
      assert(metrics.labels.every(l=>l.px>=16&&l.bounds[0]>=0&&l.bounds[1]>=0&&l.bounds[2]<=640&&l.bounds[3]<=640));
      const [a,b]=metrics.labels.map(l=>l.bounds);
      assert(!(Math.min(a[2],b[2])>Math.max(a[0],b[0])&&Math.min(a[3],b[3])>Math.max(a[1],b[1])));
      checks.push({viewport,theme,status:'pass',metrics});
    }
    const scrolling=await page.locator('figure').evaluate(f=>{
      f.scrollLeft=f.scrollWidth;
      return {left:f.scrollLeft,max:f.scrollWidth-f.clientWidth};
    });
    assert(Math.abs(scrolling.left-scrolling.max)<1);
    if(viewport.width===390)assert.equal(scrolling.max,309);
    checks.push({id:`scroll-end-${viewport.width}`,status:'pass',...scrolling});
  }
  const pixels=await page.evaluate(async text=>{
    const image=new Image();
    image.src='data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(text)));
    await image.decode();
    const canvas=document.createElement('canvas');
    canvas.width=640;canvas.height=640;
    const c=canvas.getContext('2d');
    c.fillStyle='white';c.fillRect(0,0,640,640);c.drawImage(image,0,0);
    const data=c.getImageData(0,0,640,640).data;
    let nonwhite=0;
    for(let i=0;i<data.length;i+=4)if(data[i]<240||data[i+1]<240||data[i+2]<240)nonwhite++;
    return {nonwhite,total:640*640};
  },svg);
  assert(pixels.nonwhite>1000&&pixels.nonwhite<pixels.total*0.2);
  assert.deepEqual(errors,[]);
  checks.push({id:'not-blank-or-black',status:'pass',...pixels},{id:'no-page-errors',status:'pass'});
} finally {
  await browser.close();
}
fs.writeFileSync(reportPath,`${JSON.stringify({
  schema:'STEMROBIN-181/author-preview-metrics@1',status:'pass',
  surface:'Isolated exported-SVG author host only, not product or native lesson acceptance',
  headed:false,browserClosed:true,independentApproval:false,
  spec:binding(specPath),svg:binding(svgPath),render:binding(renderPath),html:binding(htmlPath),checks,
  sourceFidelity:'Known wall-contact gaps are separately retained as AUTHOR_HOLD; this technical pass does not waive them.',
},null,2)}\n`,{flag:'wx'});
console.log(JSON.stringify({status:'pass',report:reportPath,browserClosed:true,imagePayloads:0}));
