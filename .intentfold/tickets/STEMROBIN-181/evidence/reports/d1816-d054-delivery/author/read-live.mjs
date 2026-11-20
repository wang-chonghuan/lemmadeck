import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
if (process.cwd() !== root) throw new Error('Wrong cwd');
const out = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d054-n14-author');
const helper = '/Users/yong/.agents/skills/n-plane/scripts/plane.sh';
const base = '@/projects/556c9df8-f5ac-435a-8abd-53bc522dd8a7/work-items/';
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
function get(id, route, action = 'get') {
  const r = spawnSync(helper, [action, route], { cwd: root, encoding: 'utf8', timeout: 120000, maxBuffer: 30 * 1024 * 1024 });
  fs.writeFileSync(path.join(out, `${id}.stdout.json`), r.stdout || '');
  fs.writeFileSync(path.join(out, `${id}.stderr.txt`), r.stderr || '');
  fs.writeFileSync(path.join(out, `${id}.receipt.json`), JSON.stringify({
    role: 'AUTHOR', action: 'read-only', command: [helper, action, route], cwd: root,
    exitCode: r.status, error: r.error?.message || null,
    stdoutSha256: sha(r.stdout || ''), stderrSha256: sha(r.stderr || ''),
  }, null, 2) + '\n');
  if (r.status !== 0) throw new Error(`${id}: ${r.stderr}`);
  return JSON.parse(r.stdout);
}
const parsed = spawnSync('jq', ['-s', '.', path.join(out, 'live-project-items.stdout.json')], {
  cwd: root, encoding: 'utf8', maxBuffer: 30 * 1024 * 1024,
});
if (parsed.status !== 0) throw new Error(parsed.stderr);
const all = JSON.parse(parsed.stdout);
function items(data) {
  if (Array.isArray(data)) return data.flatMap(x => x.sequence_id || x.comment_html ? [x] : items(x));
  return data.results || data.data || [];
}
for (const number of [179, 181]) {
  const item = items(all).find(x => x.sequence_id === number);
  if (!item) throw new Error(`Missing live ${number}`);
  const current = get(`live${number}`, `${base}${item.id}/`);
  console.log(JSON.stringify({ number, id: current.id, name: current.name, state: current.state }));
  if (number === 179) {
    const comments = get('live179-comments', `${base}${item.id}/comments/`);
    const authority = items(comments).find(x => x.id === '830251c5-4c6f-48af-9bae-6e3a22118c80')
      || (Array.isArray(comments) ? comments.find(x => x.id === '830251c5-4c6f-48af-9bae-6e3a22118c80') : null);
    if (!authority) throw new Error('Named authority comment not found');
    fs.writeFileSync(path.join(out, 'live179-authority.json'), JSON.stringify(authority, null, 2) + '\n');
    console.log(JSON.stringify(authority));
  }
}
