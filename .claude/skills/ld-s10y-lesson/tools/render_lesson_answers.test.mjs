import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const renderer = fileURLToPath(new URL('./render_lesson.js', import.meta.url));

function fixture(t, answers) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 's10y-readonly-answers-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const lesson = 'phy8-test';
  const book = path.join(root, '8p');
  const dir = path.join(book, 'editions/modern-us-neutral/lessons', lesson);
  const out = path.join(root, 'render');
  const target = path.join(out, lesson);
  fs.mkdirSync(dir, { recursive: true });
  fs.mkdirSync(target, { recursive: true });
  const write = (name, value) => fs.writeFileSync(path.join(dir, name), JSON.stringify(value));
  write('lesson.json', { id: lesson, title: 'Fixture', prose: [{ kind: 'p', text: 'Unchanged text.' }], section_breaks: [] });
  write('exercises.json', { count: 1, exercises: [{ number: 'g2-1', source_number: '1', group: 'Review', text: 'Find the pressure.', figures: [] }] });
  write('figures.json', { figures: [] });
  write('answer-keys.json', answers);
  fs.writeFileSync(path.join(target, 'text.html'), 'preserved text');
  fs.writeFileSync(path.join(target, 'choices.html'), 'preserved choices');
  return {
    target,
    run: () => spawnSync(process.execPath, [renderer, book, '--edition', 'modern-us-neutral',
      '--lesson', lesson, '--out', out, '--exercises-only'], { encoding: 'utf8' }),
  };
}

const ready = {
  book: '8p', lesson: 'phy8-test', edition: 'modern-us-neutral', status: 'ready',
  answers: [{ exercise: 'g2-1', displayAnswer: 'Pressure is $5880$ Pa. <script>bad()</script>' }],
};

test('ready answers are readonly, escaped and do not rewrite other surfaces', t => {
  const { run, target } = fixture(t, ready);
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  const html = fs.readFileSync(path.join(target, 'exercises.html'), 'utf8');
  assert.match(html, /class="written-answer"/);
  assert.match(html, /class="answer-label">参考答案/);
  assert.match(html, />Pressure<\/span> <span class="prose-math">is<\/span>/);
  assert.match(html, /5880/);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /&lt;\/script&gt;/);
  assert.doesNotMatch(html, /<input|<textarea|<math-field|<script>/);
  assert.equal(fs.readFileSync(path.join(target, 'text.html'), 'utf8'), 'preserved text');
  assert.equal(fs.readFileSync(path.join(target, 'choices.html'), 'utf8'), 'preserved choices');
});

test('ready answer ownership and missing coverage fail explicitly', t => {
  for (const keys of [{ ...ready, book: '7p' }, { ...ready, answers: [] }]) {
    const { run } = fixture(t, keys);
    assert.notEqual(run().status, 0);
  }
});

test('an unfinished answer draft is not displayed as approved content', t => {
  const { run, target } = fixture(t, { ...ready, status: 'draft' });
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  const html = fs.readFileSync(path.join(target, 'exercises.html'), 'utf8');
  assert.doesNotMatch(html, /class="written-answer"/);
  assert.match(html, /Find the pressure/);
});
