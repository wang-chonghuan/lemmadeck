import fs from 'node:fs';
import path from 'node:path';

const cwd = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
const own = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n35-fig217218-author7');
const E = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral';
const writeFileSync = fs.writeFileSync;
if (process.cwd() !== cwd) throw new Error('Wrong cwd');
// Adapt only metadata path serialization; geometry and SVG bytes stay native.
fs.writeFileSync = function (file, data, ...args) {
  if (path.dirname(path.resolve(file)) !== own) throw new Error('Write escaped ownership');
  if (String(file).endsWith('.render.json')) {
    const report = JSON.parse(data);
    report.root = E;
    report.spec.path = `figures/${report.figure}.spec.json`;
    for (const [kind, output] of Object.entries(report.output)) {
      output.path = `figures/${report.figure}.${kind}`;
    }
    report.candidateOnly = true;
    data = `${JSON.stringify(report, null, 2)}\n`;
  }
  return writeFileSync.call(fs, file, data, ...args);
};
await import(path.join(cwd, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs'));
