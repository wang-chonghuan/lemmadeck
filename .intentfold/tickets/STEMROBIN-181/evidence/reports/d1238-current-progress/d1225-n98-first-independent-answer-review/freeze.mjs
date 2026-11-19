import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const output = path.dirname(fileURLToPath(import.meta.url));
assert.equal(process.cwd(), root);
assert.equal(output, path.join(root, 'tmp/d1225-n98-first-independent-answer-review'));
const ticketTmp = '.intentfold/tickets/STEMROBIN-181/tmp';
const author = `${ticketTmp}/d1203-n98-first-bilingual-text-author`;
const repair = `${ticketTmp}/d1218-n97-rigid-rod-affected-repair`;
const canonical = 'ssot-resources/soviet10year-textbooks/artifacts/10p/editions/modern-us-neutral/lessons';
const lesson = 'phy10-c2-s4-n98';
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = relative => fs.readFileSync(path.join(root, relative));
const json = relative => JSON.parse(read(relative));
const inputs = [
  ['questions_zh', `${author}/zh/exercises.template.json`],
  ['questions_en', `${author}/en/exercises.template.json`],
  ['current_lesson_zh', `${author}/zh/lesson.template.json`],
  ['current_lesson_en', `${author}/en/lesson.template.json`],
  ['original_current_lesson', `${author}/root/10p/lessons/${lesson}/lesson.json`],
  ['original_questions', `${author}/root/10p/lessons/${lesson}/exercises.json`],
  ['original_source_page_263', `${author}/root/10p/pages/0263/page.json`],
  ['original_source_page_264', `${author}/root/10p/pages/0264/page.json`],
  ['original_source_page_263_text', `${author}/root/10p/pages/0263/page.md`],
  ['original_source_page_264_text', `${author}/root/10p/pages/0264/page.md`],
  ['canonical_definition_n94', `${canonical}/phy10-c2-s4-n94/lesson.json`],
  ['canonical_definition_n95', `${canonical}/phy10-c2-s4-n95/lesson.json`],
  ['canonical_definition_n96', `${canonical}/phy10-c2-s4-n96/lesson.json`],
  ['repaired_definition_n97_zh', `${repair}/zh/lesson.template.json`],
  ['repaired_definition_n97_en', `${repair}/en/lesson.template.json`],
  ['answer_skill', '.claude/skills/ld-s10y-answer/SKILL.md'],
  ['cap2_gate', '.claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md'],
  ['production_resume', '.claude/skills/ld-s10y-lesson/references/production-resume.md'],
  ['engineering_charter', '.intentfold/charter/engineering.md'],
  ['operations_charter', '.intentfold/charter/operations.md']
];
const bindings = inputs.map(([role, relative]) => {
  const absolute = path.join(root, relative);
  if (!fs.existsSync(absolute)) {
    assert.equal(role, 'canonical_definition_n94');
    return { role, path: absolute, status: 'missing', sha256: null };
  }
  const bytes = fs.readFileSync(absolute);
  return { role, path: absolute, status: 'readable', bytes: bytes.length, sha256: sha256(bytes) };
});
const solutionPath = path.join(output, 'independent-solutions.json');
const solutionBytes = fs.readFileSync(solutionPath);
const solutions = JSON.parse(solutionBytes);
assert.equal(solutions.candidate_content_read, false);
assert.equal(solutions.candidate_author_report_read, false);
const zh = json(`${author}/zh/exercises.template.json`);
const en = json(`${author}/en/exercises.template.json`);
const original = json(`${author}/root/10p/lessons/${lesson}/exercises.json`);
const expected = Array.from({ length: 8 }, (_, index) => String(index + 1));
for (const value of [zh, en, original]) {
  assert.equal(value.lesson, lesson);
  assert.equal(value.count, 8);
  assert.deepEqual(value.exercises.map(exercise => exercise.number), expected);
}
const inventory = solutions.inventory.map((entry, index) => {
  const questions = { zh: zh.exercises[index], en: en.exercises[index] };
  const source = original.exercises[index];
  for (const question of Object.values(questions)) {
    assert.equal(question.number, entry.exercise);
    assert.equal(question.source_number, entry.source_number);
    assert.equal(question.group_id, entry.group_id);
    assert.deepEqual(question.pages, entry.source_refs);
    assert.deepEqual(question.figure_refs, []);
    assert.deepEqual(question.figures, []);
    assert.equal(question.source_text, source.text);
  }
  assert.deepEqual(source.pages, entry.source_refs);
  return {
    ...entry,
    question_text: { zh: questions.zh.text, en: questions.en.text },
    original_question_text: source.text
  };
});
assert.deepEqual(inventory[4].source_refs, ['p0263#11', 'p0264#1']);
const frozenAt = new Date().toISOString();
const inventoryFile = path.join(output, 'independent-inventory.json');
const frozen = {
  schema: 'd1225/independent-inventory@1',
  ticket: 'STEMROBIN-181',
  batch: 'D037',
  lesson,
  round: 'FIRST',
  frozen_at: frozenAt,
  root,
  inputs: bindings,
  derivation: {
    path: solutionPath,
    sha256: sha256(solutionBytes),
    candidate_content_read_before_freeze: false,
    candidate_author_report_read_before_freeze: false,
    previous_answers_choices_interactions_read: false
  },
  inventory,
  usage: solutions.usage
};
const writeNew = (filename, data) => {
  fs.writeFileSync(filename, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' });
  fs.chmodSync(filename, 0o444);
};
writeNew(inventoryFile, frozen);
const sealFile = path.join(output, 'freeze-seal.json');
writeNew(sealFile, {
  schema: 'd1225/freeze-seal@1',
  frozen_at: frozenAt,
  phase: 'before any candidate answer or author-report read',
  candidate_read_count: 0,
  author_report_read_count: 0,
  files: [solutionPath, inventoryFile].map(filename => ({
    path: filename,
    sha256: sha256(fs.readFileSync(filename))
  })),
  missing_inputs: bindings.filter(input => input.status === 'missing'),
  usage: solutions.usage
});
fs.chmodSync(solutionPath, 0o444);
writeNew(path.join(output, 'usage.json'), {
  schema: 'd1225/usage@1',
  round: 'FIRST',
  ...solutions.usage
});
console.log(JSON.stringify({
  frozen_at: frozenAt,
  inventory: inventoryFile,
  inventory_sha256: sha256(fs.readFileSync(inventoryFile)),
  seal: sealFile,
  seal_sha256: sha256(fs.readFileSync(sealFile)),
  question_count: inventory.length,
  image_dependencies: 0,
  candidate_read_count: 0,
  missing_definitions: bindings.filter(input => input.status === 'missing')
}, null, 2));
