import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';

const repo='/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(),repo);
const own=path.join(repo,'.intentfold/tickets/STEMROBIN-181/tmp/d1816-d280-fig2425-author');
const require=createRequire(`${repo}/app/package.json`);
const {chromium}=require('playwright');
const [figure]=process.argv.slice(2);
assert(['fig-24','fig-25'].includes(figure));
const dir=path.join(own,figure), svgFile=path.join(dir,`${figure}.svg`);
const bind=file=>({path:file,bytes:fs.statSync(file).size,
  sha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')});
const before=bind(svgFile);
const report=JSON.parse(fs.readFileSync(path.join(dir,`${figure}.render.json`)));
assert.equal(report.status,'pass');
assert.equal(report.output.svg.sha256,before.sha256);
const spec=JSON.parse(fs.readFileSync(path.join(dir,'spec.json')));
const requests=[],previews=[];
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
  for (const variant of [
    {name:'source-width',viewport:spec.canvas.width,media:spec.canvas.width},
    {name:'full-width',viewport:640,media:640},
    {name:'mobile331-scroll-end',viewport:331,media:640},
  ]) {
    const context=await browser.newContext({viewport:{width:variant.viewport,height:spec.canvas.height+16}});
    try {
      await context.route('**/*',route=>{requests.push(route.request().url());return route.abort();});
      const page=await context.newPage();
      await page.setContent(`<!doctype html><style>
        :root {
          --ld-figure-ink:#15201f;--ld-figure-muted:#4c5a58;
          --ld-figure-accent:#15201f;--ld-figure-accent-soft:#8a9795;
          --ld-figure-grid:#e3eae9;--ld-figure-paper:#ffffff;
        }
        html,body{margin:0;padding:0;background:#ffffff}
        #scroll{width:${variant.viewport}px;overflow-x:auto;background:#ffffff}
        svg{display:block;width:${variant.media}px;height:auto;max-width:none}
      </style><div id="scroll">${fs.readFileSync(svgFile,'utf8')}</div>`);
      await page.evaluate(()=>document.fonts.ready);
      const geometry=await page.locator('svg').evaluate(node=>({
        width:node.getBoundingClientRect().width,height:node.getBoundingClientRect().height,
        labelSizes:[...node.querySelectorAll('text')].map(text=>{
          const matrix=text.getScreenCTM();
          return parseFloat(getComputedStyle(text).fontSize)*Math.hypot(matrix.a,matrix.b);
        }),
        nonemptyGeometry:node.querySelectorAll('path,polygon,line,circle,ellipse').length,
        background:getComputedStyle(node).backgroundColor,
      }));
      assert.equal(geometry.width,variant.media);
      assert(geometry.labelSizes.every(n=>n>=16));
      assert(geometry.nonemptyGeometry>0);
      const scroll=await page.locator('#scroll').evaluate(node=>{
        const start=node.scrollLeft;
        node.scrollLeft=node.scrollWidth;
        return {clientWidth:node.clientWidth,scrollWidth:node.scrollWidth,start,
          end:node.scrollLeft,expectedEnd:node.scrollWidth-node.clientWidth};
      });
      assert.equal(scroll.end,scroll.expectedEnd);
      const output=path.join(dir,`${figure}.${variant.name}.png`);
      assert(!fs.existsSync(output));
      if (variant.viewport===331) await page.locator('#scroll').screenshot({path:output});
      else await page.locator('svg').screenshot({path:output,type:'png',animations:'disabled'});
      previews.push({...bind(output),variant:variant.name,geometry,scroll});
    } finally {await context.close();}
  }
} finally {await browser.close();}
assert.deepEqual(requests,[]);
assert.equal(bind(svgFile).sha256,before.sha256);
const evidence={schema:'d280-existing-svg-preview@1',helperBasis:
  'Existing preview-d118-n19-existing-svg.mjs and recover-d261-n44-preview.mjs: isolated headless Chromium, unchanged SVG, white background, no network.',
  figure,sourceSvg:before,previews,requests,geometryRerenders:0,svgChanged:false,
  resvgCalled:false,clarification:'Direct svg_raster.js/Resvg is excluded by the latest direct user instruction.'};
fs.writeFileSync(path.join(dir,'preview.json'),JSON.stringify(evidence,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(evidence));
