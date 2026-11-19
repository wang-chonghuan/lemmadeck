import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
assert.equal(process.cwd(), repo);
const base = path.join(path.dirname(new URL(import.meta.url).pathname), process.argv[2] || 'first');
const book = path.join(base, 'fixture/10p');
const renderer = path.join(repo, '.claude/skills/ld-s10y-lesson/tools/render_lesson.js');
const cases = [
  { id: 'en-bold', locale: 'en', group: '**问题**', expected: '<strong>Questions</strong>' },
  { id: 'en-plain', locale: 'en', group: '问题', expected: 'Questions' },
  { id: 'zh-bold', locale: 'zh', group: '**问题**', expected: '<strong>问题</strong>' },
  { id: 'en-unknown', locale: 'en', group: 'Applications', expected: 'Applications' },
  { id: 'en-empty', locale: 'en', group: '', expected: 'Exercises' },
  { id: 'en-property-name', locale: 'en', group: '__proto__', expected: '__proto__' },
];
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const bindings = [];
for (const item of cases) {
  const dir = path.join(book, 'lessons', item.id);
  fs.mkdirSync(dir, { recursive: true });
  const lessonFile = path.join(dir, 'lesson.json');
  const exerciseFile = path.join(dir, 'exercises.json');
  fs.writeFileSync(lessonFile, JSON.stringify({
    title: 'Group Display Fixture', locale: item.locale, prose: [], section_breaks: [],
  }), { flag: 'wx' });
  fs.writeFileSync(exerciseFile, JSON.stringify({
    count: 1, exercises: [{ number: '1', source_number: '1', group: item.group, text: 'A question.', figures: [] }],
  }), { flag: 'wx' });
  bindings.push({ lessonFile, exerciseFile, hashes: [sha(lessonFile), sha(exerciseFile)] });
}
const command = [process.execPath, renderer, book, '--out', path.join(base, 'html')];
fs.writeFileSync(path.join(base, 'FIRST-started.json'), JSON.stringify({ command, cwd: repo }), { flag: 'wx' });
const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8' });
fs.writeFileSync(path.join(base, 'FIRST-receipt.json'), JSON.stringify({
  command, cwd: repo, exit: result.status, stdout: result.stdout, stderr: result.stderr,
}), { flag: 'wx' });
assert.equal(result.status, 0, result.stderr);
for (const item of cases) {
  const html = fs.readFileSync(path.join(base, 'html', item.id, 'exercises.html'), 'utf8');
  assert.ok(html.includes(`<div class="exgroup">${item.expected}</div>`), item.id);
}
for (const binding of bindings) assert.deepEqual(
  [sha(binding.lessonFile), sha(binding.exerciseFile)], binding.hashes,
);
const report = {
  status: 'PASS', cases, renderer: { path: renderer, sha256: sha(renderer) },
  sourceIdentityBytesUnchanged: true, nativeRendererCalls: 1,
  browserOrImageChecks: 0, scope: 'Actual offline heading HTML; no product app or DB claim.',
  pendingIntegration: 'App populated-group localization remains with E; source group identity must remain stable.',
};
fs.writeFileSync(path.join(base, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ status: report.status, cases: cases.length, renderer: report.renderer }));
