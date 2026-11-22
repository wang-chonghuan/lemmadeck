import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';

const failure = bind(`${ticket}/tmp/d1816-d1416-n39-first-en-review/pixel-review.json`);
assert.equal(failure.sha256, '69847d65b788f101c321d8a8acf7d78f99dfefb37726bef0143c283c223e86e5');
assert.equal(read(failure.path).status, 'REVISE');
const originalAuthor = bind(`${ticket}/tmp/d1816-d1429-n39-affected-text/authored.json`);
const original = read(originalAuthor.path), draft = read(original.englishDraft.path);
const before = 'N/m$^2$', after = 'N\u2060/\u2060m\u2060$^2$';
assert.equal(draft.prose[2].text.split(before).length, 3);
draft.prose[2].text = draft.prose[2].text.replaceAll(before, after);
const out = `${ticket}/tmp/d1816-d1466-n39-unit-joiners`;
const input = `${out}/en.before-native.json`;
save(input, draft);
const receipt = run('d1466-n39-affected-unit-joiner-native', [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B', '-c',
  `import sys,json
from pathlib import Path
sys.path.insert(0,${JSON.stringify(`${repo}/.claude/skills/ld-s10y-lesson/tools`)})
import edition
lesson=edition.load(Path(${JSON.stringify(input)}))
baseline=edition.load(Path(${JSON.stringify(original.englishDraft.path)}))
assert lesson["prose"][2]["text"].count("\\u2060")==6
assert edition.math_signature(lesson["prose"][2]["text"])==edition.math_signature(baseline["prose"][2]["text"])
assert edition.number_signature(lesson["prose"][2]["text"])==edition.number_signature(baseline["prose"][2]["text"])
comparison=json.loads(json.dumps(lesson))
comparison["prose"][2]["text"]=comparison["prose"][2]["text"].replace("\\u2060","")
assert comparison==baseline,"Only unit word-joiners may change"
edition.normalize_lesson_layout(lesson)
flow,errors=edition.prose_flow_contract(lesson["prose"],lesson["section_breaks"])
comparison=json.loads(json.dumps(lesson))
comparison["prose"][2]["text"]=comparison["prose"][2]["text"].replace("\\u2060","")
assert comparison==baseline,"Normalization must preserve every other field and all boundaries"
print(json.dumps({"lesson":lesson,"flow":flow,"errors":errors},ensure_ascii=False))
assert not errors,errors`,
]);
const output = JSON.parse(fs.readFileSync(read(receipt.path).streams.stdout.path, 'utf8'));
save(`${out}/en.lesson.draft.json`, output.lesson);
save(`${out}/en.prose-flow.json`, output.flow);
save(`${out}/authored.json`, {
  ...original, task: 'D1466', status: 'AFFECTED_ONLY_N39_UNIT_JOINER_NATIVE_PASS',
  englishBeforeNative: bind(input), englishDraft: bind(`${out}/en.lesson.draft.json`),
  englishFlow: bind(`${out}/en.prose-flow.json`), nativeReceipt: receipt,
  originalAuthor, firstPixelFailure: failure, changedPointers: ['/prose/2/text'],
  layoutOnly: true, wordJoinersInserted: 6, unitOccurrences: 2,
  allVisibleCharactersAndMathAndBoundariesUnchanged: true,
  noHtmlSpanAuthored: true, sourceAndChineseAndSvgUnchanged: true,
  independentAffectedReview: 'PENDING', parentImagesOpened: 0,
});
console.log(JSON.stringify({ authored: bind(`${out}/authored.json`), visibleTextChanged: false }));
