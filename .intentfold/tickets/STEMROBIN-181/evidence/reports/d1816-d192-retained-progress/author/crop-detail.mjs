import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
if (process.cwd() !== repo) throw new Error('Wrong cwd');
const out = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d192-10p-source65-67-author');
const input = path.join(repo, '.tmp/STEMROBIN-181/d1816-d192/source-work/10p/pages/0066/page.png');
const output = path.join(out, 'crops/p0066-formula-detail.png');
fs.mkdirSync(path.dirname(output), { recursive: true });
if (fs.existsSync(output)) throw new Error('Preserve existing crop');
const box = [575, 650, 280, 760];
const code = 'from PIL import Image; import sys; im=Image.open(sys.argv[1]); x,y,w,h=map(int,sys.argv[3:]); im.crop((x,y,x+w,y+h)).save(sys.argv[2])';
const call = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', ['-c', code, input, output, ...box.map(String)], { cwd: repo, encoding: 'utf8' });
const bind = (file) => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const spec = {
  kind: 'native-source-pixel-crop', source: bind(input), output: call.status === 0 ? bind(output) : null,
  boxXYWH: box, resize: false, padding: 0, masking: false, interpolation: null,
  purpose: 'Inspect the actual amplitude and reactance subscripts without re-rendering a page.',
  cwd: repo, command: ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-c', code, input, output, ...box.map(String)],
  exitCode: call.status, error: call.error?.message || null, stdout: call.stdout, stderr: call.stderr,
};
fs.writeFileSync(path.join(out, 'crops/p0066-formula-detail.spec.json'), JSON.stringify(spec, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify(spec, null, 2));
process.exitCode = call.status ?? 1;
