import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { inline, proseInline } = require('./htmlfrag.js');

for (const [name, render] of [['inline', inline], ['prose', proseInline]]) {
  test(`${name} renders single-star emphasis and preserves strong text`, () => {
    const html = render('**Apparatus**: the *objective* and *eyepiece*.');
    assert.equal((html.match(/<em>/g) ?? []).length, 2);
    assert.equal((html.match(/<strong>/g) ?? []).length, 1);
    assert(!html.includes('*'));
  });

  test(`${name} does not interpret math multiplication as text emphasis`, () => {
    const html = render('Keep $a*b$ and $c*d$ intact.');
    assert(!html.includes('<em>'));
    assert(html.includes('a*b</annotation>'));
    assert(html.includes('c*d</annotation>'));
  });

  test(`${name} escapes emphasized HTML and leaves plain multiplication alone`, () => {
    assert(render('*<tag>*').includes('<em>&lt;'));
    assert(!render('*<tag>*').includes('<tag>'));
    assert(!render('2 * 3 * 4').includes('<em>'));
    assert(!render(String.raw`\*literal\*`).includes('<em>'));
  });
}

test('offline lesson and exercise renderer use the same emphasis contract', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 's10y-emphasis-'));
  try {
    const lessonDir = path.join(directory, 'book/lessons/test');
    fs.mkdirSync(lessonDir, { recursive: true });
    fs.writeFileSync(path.join(lessonDir, 'lesson.json'), JSON.stringify({
      id: 'test', title: 'Emphasis', printed_title: 'Emphasis', locale: 'en',
      chapter: null, section: null, start_printed: 1,
      prose: [{ kind: 'p', text: 'The *objective* forms an image. Keep $a*b$ and $c*d$ intact.' }],
      section_breaks: [],
    }));
    fs.writeFileSync(path.join(lessonDir, 'exercises.json'), JSON.stringify({
      count: 1, exercises: [{ number: '1', source_number: '1', text: 'Identify the *eyepiece*.', figures: [] }],
    }));
    const renderer = fileURLToPath(new URL('./render_lesson.js', import.meta.url));
    execFileSync(process.execPath, [renderer, path.join(directory, 'book'), '--out', path.join(directory, 'out')]);
    const text = fs.readFileSync(path.join(directory, 'out/test/text.html'), 'utf8');
    const exercises = fs.readFileSync(path.join(directory, 'out/test/exercises.html'), 'utf8');
    assert.equal((text.match(/<em>/g) ?? []).length, 1);
    assert.equal((exercises.match(/<em>/g) ?? []).length, 1);
    assert(text.includes('a*b</annotation>') && text.includes('c*d</annotation>'));
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
