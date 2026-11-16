import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { bind } from './retain-d016-evidence.mjs';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const original = `${work}/offline-d017-check.mjs`;
const output = `${work}/offline-d018-check.mjs`;
let source = await fs.readFile(original, 'utf8');
assert.equal(source.match(/tmp\/offline-d017/g)?.length, 1);
source = source.replace('tmp/offline-d017', 'tmp/offline-d018');
source = source.replace('text.size >= spec.display.minTextPx - 0.1', 'text.size >= spec.display.minTextPx');
const endMarker = '        const screenshot = path.join(evidence,';
assert.equal(source.split(endMarker).length, 2);
source = source.replace(endMarker, `        const scrollEnds = await page.evaluate(() => {
          const elements = [...document.querySelectorAll('.nb, figure.fig, li.ex .body')]
            .filter(element => element.scrollWidth > element.clientWidth + 1);
          return elements.map(element => {
            element.scrollLeft = element.scrollWidth;
            const result = {
              kind: element.tagName,
              tex: element.querySelector('annotation[encoding="application/x-tex"]')?.textContent ?? null,
              scrollWidth: element.scrollWidth, clientWidth: element.clientWidth,
              scrollLeft: element.scrollLeft,
              endReached: element.scrollLeft + element.clientWidth >= element.scrollWidth - 1,
            };
            return result;
          });
        });
        assert.ok(scrollEnds.every(item => item.endReached), \`\${target.id}/\${surface}: unreachable horizontal end\`);
        if (scrollEnds.length) {
          const endScreenshot = path.join(evidence, \`\${target.id}-\${surface}-\${viewport.width}-scroll-end.png\`);
          await page.screenshot({ path: endScreenshot, fullPage: true });
          metrics.scrollEndScreenshot = endScreenshot;
          metrics.scrollEndScreenshotSha256 = await fileHash(endScreenshot);
        }
        metrics.scrollEnds = scrollEnds;
        await page.evaluate(() => {
          for (const element of document.querySelectorAll('.nb, figure.fig, li.ex .body')) element.scrollLeft = 0;
          window.scrollTo(0, document.documentElement.scrollHeight);
          if (scrollY + innerHeight < document.documentElement.scrollHeight - 1) throw new Error('Page end unreachable');
          window.scrollTo(0, 0);
        });
${endMarker}`);
await fs.writeFile(output, source, { flag: 'wx' });
await fs.writeFile(`${work}/d018-offline-check-preparation.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', basis: await bind(original), generated: await bind(output),
  adaptations: [
    'D018-only evidence directory; D017 script and passed checkpoints untouched.',
    'Strict declared16px figure floor, no tolerance relaxation.',
    'Prose-math/figure/exercise horizontal ends and page bottom explicitly reachable; actual end screenshots retained.',
  ],
  gateInvocations: 0,
}, null, 2)}\n`, { flag: 'wx' });
console.log(output);
