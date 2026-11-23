import assert from 'node:assert/strict';
import { repo, ticket, read, save, bind } from './n42-native.mjs';

const author = `${ticket}/tmp/d1816-d1943-ex7-first-en-author/exercises.template.json`;
const chinese = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/lessons/phy9-c1-s6-t8/exercises.json`;
const original = read(author), recovered = structuredClone(original), source = read(chinese);
const changes = [];
for (let index = 0; index < recovered.exercises.length; index++) {
  for (const figure of recovered.exercises[index].figures) {
    const old = source.exercises[index].figures.find(item => item.id === figure.id);
    assert(old);
    if (figure.label !== old.label) {
      changes.push({ exercise: recovered.exercises[index].number, figure: figure.id,
        field: 'figures.label', before: figure.label, after: old.label });
      figure.label = old.label;
    }
  }
}
assert.equal(changes.length, 1);
assert.equal(changes[0].figure, 'fig-77');
const out = `${ticket}/tmp/d1816-d1948-ex7-source-label-recovery`;
save(`${out}/exercises.template.json`, recovered);
save(`${out}/failure-and-recovery.json`, {
  card: 'phy9-c1-s6-t8', status: 'SOURCE_LABEL_METADATA_ONLY_RECOVERY_NOT_APPROVAL',
  failure: {
    command: 'node .intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/finalize-first-English-lesson.mjs .intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/finalize-d1945-ex7-config.json',
    exitCode: 1, phase: 'preflight-before-native-call',
    diagnostic: 'exercise.figures deep equality failed: Figure 77 versus source identity label \u56fe 77',
  },
  originalAuthor: bind(author), chinese: bind(chinese), changes,
  recovered: bind(`${out}/exercises.template.json`),
  originalAuthorPreserved: true, translatedBodyMathAndConditionsUnchanged: true,
  independentEnglishReviewPending: true, imagesOpened: 0, databaseWrites: 0, paidCalls: 0,
});
console.log(JSON.stringify({ changes, recovered: bind(`${out}/exercises.template.json`) }));
