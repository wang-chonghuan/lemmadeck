import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(`${process.cwd()}/.claude/skills/ld-s10y-lesson/package.json`);
const { Resvg } = require('@resvg/resvg-js');
const out = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d593-n25-figures-first';
for (const id of ['fig-40', 'fig-41', 'fig-42']) {
  const render = JSON.parse(fs.readFileSync(`${out}/${id}.render.json`));
  if (render.status !== 'pass') throw new Error(`Native render did not pass: ${id}`);
  const svg = fs.readFileSync(`${out}/${id}.svg`, 'utf8')
    .replaceAll('var(--ld-figure-ink,#1b1b1b)', '#1b1b1b')
    .replaceAll('var(--ld-figure-muted,#6b6b6b)', '#6b6b6b')
    .replaceAll('var(--ld-figure-paper,#ffffff)', '#ffffff');
  const resvg = new Resvg(svg, { background: '#ffffff' });
  fs.writeFileSync(`${out}/${id}.preview.png`, resvg.render().asPng(), { flag: 'wx' });
}
console.log(JSON.stringify({ previews: 3, browserOpened: false }));
