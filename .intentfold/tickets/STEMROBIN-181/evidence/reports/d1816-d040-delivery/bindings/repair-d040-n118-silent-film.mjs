import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

const scratch = '.intentfold/tickets/STEMROBIN-181/tmp/d1814-recovery';
const base = '.tmp/STEMROBIN-181/d1816/author-work/adapt/10p';
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const records = [];
for (const [locale, edition, from, to] of [
  ['zh', 'modern-us-neutral', '却不能直接听到影片所记录的人声', '却听不到银幕上人物的说话声'],
  ['en', 'modern-us-neutral-en', 'but recorded voices could not be heard directly from the film', 'but there was no recorded dialogue accompanying the pictures'],
]) {
  const file = `${base}/${edition}/lessons/phy10-c2-s6-n118/lesson.template.json`;
  const before = `${scratch}/d040-n118-silent-film-first-candidate/${edition}.json`;
  fs.mkdirSync(`${scratch}/d040-n118-silent-film-first-candidate`, { recursive: true });
  fs.copyFileSync(file, before, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(before, 0o444);
  const lesson = JSON.parse(fs.readFileSync(file));
  const original = structuredClone(lesson);
  assert.equal(lesson.prose[0].text.split(from).length, 2);
  lesson.prose[0].text = lesson.prose[0].text.replace(from, to);
  original.prose[0].text = lesson.prose[0].text;
  assert.deepEqual(lesson, original);
  fs.writeFileSync(file, JSON.stringify(lesson, null, 2) + '\n');
  records.push({ locale, from, to, before: { path: before, sha256: hash(before) },
    after: { path: file, sha256: hash(file) }, changedBlockOnly: 0 });
}
fs.writeFileSync(`${scratch}/d040-n118-silent-film-affected.json`, JSON.stringify({
  batch: 'D040', id: 'phy10-c2-s6-n118', records,
  cause: 'Nonblocking independent clarity finding: avoid suggesting silent film already carried an inaudible voice recording.',
  changedOpticalContext: false, changedQuestions: false, sourceChanged: false,
  affectedReview: 'pending', parentNewImageOpens: 0, databaseWrites: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ id: 'phy10-c2-s6-n118', changedClauses: 2 }));
