import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = process.cwd();
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d340-arrow-marker-diagnostic`;
const dir = '.tmp/STEMROBIN-181/d1816-d340';
const scripts = path.resolve('.agents/skills/ld-s10y-image/scripts');
assert(!fs.existsSync(O));
assert(!fs.existsSync(dir));
fs.mkdirSync(O, { recursive: true });
fs.mkdirSync(dir, { recursive: true });
const bind = file => ({ path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const spec = '.tmp/STEMROBIN-181/d1816-d333/attempt-2/fig-277.spec.json';
const source = '.agents/skills/ld-s10y-image/scripts/materialize_arrowheads.mjs';
const beforeSource = bind(source);
const beforeSpec = bind(spec);
const original = fs.readFileSync(source, 'utf8');
const error = 'throw new Error(`Unsupported arrow marker aspect ratio: ${id}`)';
assert(original.includes(error));
const diagnostic = original.replace(error,
  'throw new Error(`Unsupported arrow marker aspect ratio: ${id} ` + JSON.stringify({' +
  'width, height, viewBox: {x:viewBox.x,y:viewBox.y,width:viewBox.width,height:viewBox.height}, ' +
  'markerXML:marker.outerHTML, markerCount:[...svg.querySelectorAll("marker")].filter(n=>n.id===id).length}))');
fs.writeFileSync(`${dir}/materialize_arrowheads.mjs`, diagnostic, { flag: 'wx' });
let renderer = fs.readFileSync(`${scripts}/render_spec.mjs`, 'utf8');
const location = 'const scriptDir = path.dirname(fileURLToPath(import.meta.url))';
assert(renderer.includes(location));
renderer = renderer.replace(location, `const scriptDir = ${JSON.stringify(scripts)}`);
renderer = renderer.replace("from 'playwright-core'",
  `from ${JSON.stringify(path.resolve('.agents/skills/node_modules/playwright-core/index.mjs'))}`);
fs.writeFileSync(`${dir}/render_spec.mjs`, renderer, { flag: 'wx' });
fs.writeFileSync(`${O}/input-freeze.json`, JSON.stringify({
  stage: 'D340', source: bind(source), diagnostic: bind(`${dir}/materialize_arrowheads.mjs`),
  renderer: bind(`${scripts}/render_spec.mjs`), diagnosticRenderer: bind(`${dir}/render_spec.mjs`),
  failedSpecUnchanged: bind(spec), diagnosticOnly: 'Error payload includes original marker DOM dimensions.',
  productionEdits: 0, specEdits: 0, imagesOpened: 0,
}, null, 2) + '\n', { flag: 'wx' });
try {
  execFileSync('node', [`${T}/tmp/d1816-recovery/run-native.mjs`,
    'd340-failed-arrow-marker-diagnostic', process.execPath, `${dir}/render_spec.mjs`,
    '--spec', path.resolve(spec), '--svg', `${dir}/diagnostic.svg`,
    '--report', `${dir}/diagnostic.render.json`], { cwd: repo, stdio: 'inherit' });
} finally {
  assert.equal(bind(source).sha256, beforeSource.sha256);
  assert.equal(bind(spec).sha256, beforeSpec.sha256);
}
