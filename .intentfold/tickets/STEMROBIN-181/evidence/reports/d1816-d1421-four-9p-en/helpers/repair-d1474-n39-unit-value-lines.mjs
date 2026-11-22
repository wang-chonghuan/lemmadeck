import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';

const originalAuthor = bind(`${ticket}/tmp/d1816-d1429-n39-affected-text/authored.json`);
const failedAuthor = bind(`${ticket}/tmp/d1816-d1466-n39-unit-joiners/authored.json`);
const failedDisplay = bind(`${ticket}/tmp/d1816-d1473-n39-unit-selector-display-recovery/affected-report.json`);
assert.equal(read(failedDisplay.path).status, 'FAIL');
const original = read(originalAuthor.path), draft = read(original.englishDraft.path);
const edits = [
  ["as approximately $7.4", "as approximately:\n$7.4"],
  ["its approximate value is $p_", "its approximate value is:\n$p_"],
];
for (const [before, after] of edits) {
  assert.equal(draft.prose[2].text.split(before).length, 2);
  draft.prose[2].text = draft.prose[2].text.replace(before, after);
}
const out = `${ticket}/tmp/d1816-d1474-n39-unit-value-lines`, input = `${out}/en.before-native.json`;
save(input, draft);
const receipt = run('d1474-n39-affected-value-line-native', [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B', '-c',
  `import sys,json
from pathlib import Path
sys.path.insert(0,${JSON.stringify(`${repo}/.claude/skills/ld-s10y-lesson/tools`)})
import edition
lesson=edition.load(Path(${JSON.stringify(input)}))
baseline=edition.load(Path(${JSON.stringify(original.englishDraft.path)}))
assert edition.math_signature(lesson["prose"][2]["text"])==edition.math_signature(baseline["prose"][2]["text"])
assert edition.number_signature(lesson["prose"][2]["text"])==edition.number_signature(baseline["prose"][2]["text"])
edition.normalize_lesson_layout(lesson)
flow,errors=edition.prose_flow_contract(lesson["prose"],lesson["section_breaks"])
comparison=json.loads(json.dumps(lesson))
for before,after in ${JSON.stringify(edits)}:
    comparison["prose"][2]["text"]=comparison["prose"][2]["text"].replace(after,before)
assert comparison==baseline,"Only two value-introduction colons and line breaks may change"
print(json.dumps({"lesson":lesson,"flow":flow,"errors":errors},ensure_ascii=False))
assert not errors,errors`,
]);
const output = JSON.parse(fs.readFileSync(read(receipt.path).streams.stdout.path, 'utf8'));
save(`${out}/en.lesson.draft.json`, output.lesson);
save(`${out}/en.prose-flow.json`, output.flow);
save(`${out}/authored.json`, {
  ...original, task: 'D1474', status: 'AFFECTED_ONLY_N39_UNIT_VALUE_LINE_NATIVE_PASS',
  englishBeforeNative: bind(input), englishDraft: bind(`${out}/en.lesson.draft.json`),
  englishFlow: bind(`${out}/en.prose-flow.json`), nativeReceipt: receipt,
  originalAuthor, failedWordJoinerAuthor: failedAuthor, failedWordJoinerDisplay: failedDisplay,
  changedPointers: ['/prose/2/text'], layoutOnly: true, valueIntroductionLineBreaks: 2,
  allMathAndNumbersAndBoundariesUnchanged: true, sourceAndChineseAndSvgUnchanged: true,
  failedWordJoinerAttemptNotReset: true, retainedWordJoiners: 0, noHtmlSpanAuthored: true,
  independentAffectedReview: 'PENDING', parentImagesOpened: 0,
});
console.log(JSON.stringify({ authored: bind(`${out}/authored.json`), mathChanged: false }));
