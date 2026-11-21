import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const cwd = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
const root = path.join(cwd, '.tmp/stemrobin-184-six/source166-active');
const template = fs.readFileSync(path.join(root, 'original-page.template.md'), 'utf8');
const body = fs.readFileSync(path.join(root, 'source.body.md'), 'utf8');
const front = template.match(/^---\n([\s\S]*?)\n---/)[1];
const meta = JSON.parse(front);
meta.printed_page = 159;
const text = `---\n${JSON.stringify(meta, null, 2)}\n---\n\n${body}`;
const native = path.join(root, 'native/9c/pages/0166');
const work = path.join(root, 'work/9c/pages/0166');
fs.mkdirSync(native, { recursive: true });
fs.mkdirSync(work, { recursive: true });
fs.writeFileSync(path.join(native, 'page.md'), text, { flag: 'wx' });
fs.writeFileSync(path.join(root, 'native-input.md'), text, { flag: 'wx', mode: 0o444 });
fs.symlinkSync(path.join(cwd, '.tmp/ld-s10y-lesson/9c/pages/0166/page.png'),
  path.join(work, 'page.png'));
console.log(JSON.stringify({
  nativeRoot: path.join(root, 'native'),
  workRoot: path.join(root, 'work'),
  inputPath: path.join(native, 'page.md'),
  inputBytes: Buffer.byteLength(text),
  inputSha256: crypto.createHash('sha256').update(text).digest('hex'),
  metadataChange: { printed_page: { from: null, to: 159 } },
  body: 'Exact frozen source.body.md, unchanged',
  rasterLoads: 0,
}, null, 2));
