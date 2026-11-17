import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const cwd = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
assert.equal(process.cwd(), cwd);
const out = path.dirname(import.meta.filename);
const entries = [
  {
    path: '.tmp/ld-s10y-lesson/10p/pages/0104/page.grid.png',
    kind: 'source-page', order: 1,
    observation: 'Chapter IV and section 37; figure64; prose question; outgoing paragraph.',
  },
  {
    path: '.tmp/ld-s10y-lesson/10p/pages/0105/page.grid.png',
    kind: 'source-page', order: 2,
    observation: 'Section37 continuation, figure65, paragraph continues to106.',
  },
  {
    path: '.tmp/ld-s10y-lesson/10p/pages/0106/page.grid.png',
    kind: 'source-page', order: 3,
    observation: 'Section37 continuation, figures66-68, paragraph continues to107.',
  },
  {
    path: '.tmp/ld-s10y-lesson/10p/pages/0107/page.grid.png',
    kind: 'source-page', order: 4,
    observation: 'Section37 completes; section38 begins; final paragraph closed.',
  },
  {
    path: path.relative(cwd, path.join(out, 'source-text-crop-104.png')),
    kind: 'source-text-crop', order: 5,
    observation: 'Confirmed the printed wording 水的溅拍声.',
  },
  {
    path: path.relative(cwd, path.join(out, 'native-work/10p/pages/0104/figures/fig-64.png')),
    kind: 'native-figure-crop', order: 6,
    observation: 'Tree, shore, rings and center disturbance retained; no adjoining prose or caption.',
  },
  {
    path: path.relative(cwd, path.join(out, 'native-work/10p/pages/0105/figures/fig-65.png')),
    kind: 'native-figure-crop', order: 7,
    observation: 'Support, cord, hand and left arrow retained; no adjoining prose or caption.',
  },
  {
    path: path.relative(cwd, path.join(out, 'native-work/10p/pages/0106/figures/fig-68.png')),
    kind: 'native-figure-crop', order: 8,
    observation: 'Both spring subfigures, hands, supports, position marks and а/б retained; no prose or caption.',
  },
].map(entry => {
  const bytes = fs.readFileSync(entry.path);
  return { ...entry, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length };
});
const ledger = {
  schema: 'ld-s10y-image-opens@1', ticket: 'STEMROBIN-181',
  totalImageOpens: 8, sourcePageOpens: 4, sourceTextCropOpens: 1, nativeFigureCropOpens: 3,
  individualSourceTranscription: true, predecessorImageOpens: 0, otherImageOpens: 0,
  imagePayloadsToParent: false, independentSourceApproval: false, entries,
  nativeFigureCropsNotOpenedByAuthor: ['fig-66', 'fig-67'],
};
fs.writeFileSync(path.join(out, 'image-opens.json'), `${JSON.stringify(ledger, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ totalImageOpens: entries.length, path: path.join(out, 'image-opens.json') }));
