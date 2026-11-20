import fs from 'node:fs';
import path from 'node:path';
import {isDeepStrictEqual as equal} from 'node:util';

const tmp = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp';
const own = path.join(tmp, 'source226227-FIRST-review-01');
const read = file => JSON.parse(fs.readFileSync(path.join(tmp, file), 'utf8'));
const prior = read('source226227-FIRST-review-01/n61-all30-independent-comparison.json').objects.find(object => object.id === '215');
const raw = read('g10-n61/artifacts/9-10g/lessons/geo910-c2-s3-n61/exercises.json').exercises[9];
const current = read('n61-modern-text-author/exercises.template.json').exercises[9];

// A figure number inside parentheses is not a numbered question subpart.
function topLevelSubparts(text) {
  let math = false;
  let depth = 0;
  const parts = [];
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '$' && text[i - 1] !== '\\') { math = !math; continue; }
    if (math) continue;
    if (char === '(' || char === '（') { depth++; continue; }
    if ((char === ')' || char === '）') && depth > 0) { depth--; continue; }
    if (depth > 0 || !/\d/u.test(char) || /\d/u.test(text[i - 1] ?? '')) continue;
    const match = /^(\d+)\)/u.exec(text.slice(i));
    if (match) { parts.push(match[1]); i += match[0].length - 1; }
  }
  return parts;
}
const rawSubparts = topLevelSubparts(raw.text);
const currentSubparts = topLevelSubparts(current.text);
const candidateLines = current.text.split('\n');
const passed = equal(rawSubparts, ['1', '2']) && equal(currentSubparts, ['1', '2']) &&
  equal(current.lines, candidateLines) && candidateLines.length === 3 &&
  candidateLines[0] === '215.' && candidateLines[1].startsWith('1) ') && candidateLines[2].startsWith('2) ') &&
  raw.text === prior.rawText && current.text === prior.currentText &&
  prior.contentWithoutWhitespaceEqual && prior.signatures.exactlyEqual &&
  prior.identity.every(item => item.equal) && prior.metadata.sourceTextExactlyRaw &&
  prior.metadata.layoutOnlyDeclarationMatches && prior.metadata.emptyNumericAndHistory;
const result = {
  schema: 'independent-affected-only-comparison-recovery@1',
  object: 'exercises[9]', number: '215',
  priorArtifact: 'n61-all30-independent-comparison.json',
  priorStatusPreserved: prior.status,
  diagnosis: 'The naive first scanner counted 88) in (图 88) as a third subpart. This was a reviewer-comparison defect, not candidate content failure.',
  rawSubparts, currentSubparts, candidateLines,
  exactCandidateAndRawReusedFromPriorComparison: raw.text === prior.rawText && current.text === prior.currentText,
  unaffectedObjectsRecompared: 0,
  unaffectedFigureAssertionsRecompared: 0,
  nativeFlowLayoutOrProducerReruns: 0,
  candidateRepairs: 0,
  correctedAffectedCheck: passed ? 'PASS' : 'FAIL',
  priorFailureNotDeletedOrRewritten: true
};
fs.writeFileSync(path.join(own, 'ex215-affected-comparison.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({object: result.object, affectedResult: result.correctedAffectedCheck, rawSubparts, currentSubparts}));
