import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const out = path.dirname(fileURLToPath(import.meta.url));
const { chromium } = createRequire(`${repo}/app/package.json`)('playwright');
const spec = JSON.parse(fs.readFileSync(path.join(out, 'fig-26.spec.json')));
const arrow = spec.objects.find(object => object.id === 'rotation-tip');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 420, height: 660 } });
  const requests = [];
  await page.route('**/*', route => { requests.push(route.request().url()); return route.abort(); });
  await page.setContent('<div id="marker-probe" style="width:420px;height:660px"></div>');
  await page.addScriptTag({ path: `${repo}/.agents/skills/node_modules/jsxgraph/distrib/jsxgraphcore.js` });
  const observations = await page.evaluate(({ box, arrow }) => {
    const board = JXG.JSXGraph.initBoard('marker-probe', {
      boundingbox: box, axis: false, grid: false, showNavigation: false, showCopyright: false,
      keepaspectratio: true, renderer: 'svg',
    });
    return [2.8, 3, 2].map(strokeWidth => {
      const item = board.create('arrow', [arrow.from, arrow.to], { strokeWidth, strokeColor: 'black' });
      board.fullUpdate();
      const marker = item.rendNodeTriangleEnd;
      const viewBox = marker.viewBox.baseVal;
      const result = {
        strokeWidth,
        viewBox: { width: viewBox.width, height: viewBox.height },
        markerWidth: marker.markerWidth.baseVal.value, markerHeight: marker.markerHeight.baseVal.value,
        markerDisplay: marker.getAttribute('display'),
        nativeMaterializerCompatible: !!viewBox.width && !!viewBox.height &&
          marker.markerWidth.baseVal.value / viewBox.width === marker.markerHeight.baseVal.value / viewBox.height,
      };
      board.removeObject(item);
      return result;
    });
  }, { box: spec.canvas.boundingBox, arrow });
  assert.deepEqual(requests, []);
  assert(observations.find(row => row.strokeWidth === 2).nativeMaterializerCompatible);
  console.log(JSON.stringify({
    schema: 'd282/arrow-marker-execution-diagnostic@1',
    observations, imagesCreated: 0, imageOpens: 0, networkRequests: requests,
    geometryOutputCreated: false,
  }, null, 2));
} finally { await browser.close(); }
