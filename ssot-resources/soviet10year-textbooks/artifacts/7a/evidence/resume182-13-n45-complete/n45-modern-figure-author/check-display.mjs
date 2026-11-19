import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const root='/Users/yong/.codex/worktrees/d9b1/lemmadeck';
const own=path.join(root,'.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n45-modern-figure-author');
const require=createRequire(path.join(root,'.agents/skills/package.json'));
const {chromium}=require('playwright-core');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const candidates=[chromium.executablePath(),'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'];
const executablePath=candidates.find(p=>fs.existsSync(p));
assert(executablePath,'Existing Chromium unavailable; do not install dependencies');
const browser=await chromium.launch({headless:true,executablePath});
const checks=[];
let blockedRequests=0;
try {
  const context=await browser.newContext();
  await context.route('**/*',route=>{blockedRequests++;return route.abort();});
  const page=await context.newPage();
  for(const id of ['fig-59','fig-60','fig-61']) {
    const specPath=path.join(own,'FINAL',id,id+'.spec.json');
    const svgPath=path.join(own,'FINAL',id,id+'.svg');
    const spec=JSON.parse(fs.readFileSync(specPath,'utf8'));
    const svg=fs.readFileSync(svgPath,'utf8');
    assert(svg.includes('var(--ld-figure-ink'));
    assert(svg.includes('data-arrowhead-for'));
    for(const width of [300,331,640]) {
      await page.setViewportSize(width===640?{width:1440,height:960}:{width:390,height:844});
      await page.setContent(`<!doctype html><style>
        :root{--ld-figure-ink:#15201f;--ld-figure-muted:#4c5a58;--ld-figure-accent:#15201f;--ld-figure-grid:#e3eae9;--ld-figure-paper:#fff}
        body{margin:0}figure{margin:0;width:${width}px;overflow-x:auto;overflow-y:hidden}
        .media{width:${spec.display.layout==='scroll'?640:Math.min(width,spec.display.maxWidthPx)}px;max-width:none}
        svg{display:block;width:100%;height:auto}
      </style><figure><div class="media">${svg}</div></figure>`);
      const actual=await page.evaluate(()=>{
        const fig=document.querySelector('figure'),media=document.querySelector('.media'),svg=media.querySelector('svg');
        const values=[...svg.querySelectorAll('text')].map(t=>{
          const m=t.getScreenCTM();
          return Number(t.getAttribute('font-size'))*Math.hypot(m.a,m.b);
        });
        fig.scrollLeft=100000;
        return {
          viewport:{width:innerWidth,height:innerHeight},
          containerPx:fig.clientWidth,mediaPx:media.getBoundingClientRect().width,
          minTextPx:Math.min(...values),labels:values.length,
          scrollMax:fig.scrollWidth-fig.clientWidth,scrollReached:fig.scrollLeft,
          svgBounds:{width:svg.getBoundingClientRect().width,height:svg.getBoundingClientRect().height},
          arrowheads:svg.querySelectorAll('[data-arrowhead-for]').length,
          rawPaths:[...svg.querySelectorAll('[id$="raw-path-layer"] > path')].map(p=>({
            d:p.getAttribute('d'),transform:p.parentElement.getAttribute('transform'),
            stroke:p.getAttribute('stroke'),dash:p.getAttribute('stroke-dasharray')
          })),
          dashedGeometry:[...svg.querySelectorAll('[stroke-dasharray]')]
            .filter(n=>n.getAttribute('stroke-dasharray')!=='none'&&n.getAttribute('stroke-dasharray')!=='').length
        };
      });
      assert(actual.minTextPx>=16-0.01);
      assert(Math.abs(actual.mediaPx-(spec.display.layout==='scroll'?640:width))<0.01);
      assert.equal(actual.scrollReached,actual.scrollMax);
      assert.equal(actual.arrowheads,2);
      const sourceCurve=spec.objects.find(o=>o.type==='svgPath');
      if(sourceCurve) {
        assert.equal(actual.rawPaths.length,1);
        assert.equal(actual.rawPaths[0].d,sourceCurve.d);
        assert.equal(actual.rawPaths[0].dash,null);
        assert.equal(actual.dashedGeometry,id==='fig-59'?3:2);
      } else assert.equal(actual.rawPaths.length,0);
      checks.push({figure:id,layout:spec.display.layout,requestedContainerPx:width,
        spec:{path:specPath,sha256:hash(specPath)},svg:{path:svgPath,sha256:hash(svgPath)},
        actual,status:'pass'});
    }
  }
} finally {await browser.close();}
console.log(JSON.stringify({
  schema:'n45-offline-figure-display-evidence@1',
  surface:'Isolated SVG-only headless figure host, NOT the application or a finalized lesson. No screenshot or image payload loaded into agent context.',
  network:'All page network requests explicitly blocked',blockedRequests,
  status:'pass',checks,
  checker:{path:new URL(import.meta.url).pathname,sha256:hash(new URL(import.meta.url).pathname)},
  independentFigureReview:'pending'
},null,2));
