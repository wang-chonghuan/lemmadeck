import fs from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import crypto from 'node:crypto';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
if (process.cwd() !== repo) throw new Error('Incorrect working directory');
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp');
const out = path.join(tmp, 'd1816-d371-n151-affected-text-review');
const read = file => JSON.parse(fs.readFileSync(file));
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const freeze = read(path.join(out, 'input-freeze.json'));
for (const item of freeze.exactInputs) {
  if (sha(item.path) !== item.sha256) throw new Error(`Input changed: ${item.path}`);
}
const checks = [];
const check = (id, condition, detail) => checks.push({
  id, status: condition ? 'PASS' : 'FAIL', detail
});
function differences(a, b, pointer = '') {
  if (isDeepStrictEqual(a, b)) return [];
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object' ||
      Array.isArray(a) !== Array.isArray(b)) return [pointer || '/'];
  const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])].sort();
  return keys.flatMap(key => Object.hasOwn(a, key) && Object.hasOwn(b, key)
    ? differences(a[key], b[key], `${pointer}/${key}`)
    : [`${pointer}/${key}`]);
}
const d357 = read(path.join(tmp, 'd1816-d357-n151-source-rebinding/input-freeze.json'));
const d370 = read(path.join(tmp, 'd1816-d370-n151-reference-clarity-repair/author-freeze.json'));
const originalRaw = read(d357.originalSource.path);
const repairedRaw = read(d357.repairedSource.path);
const independentReplacements = {
  zh: [['自由中子发生这种衰变时', '自由中子衰变时']],
  en: [
    ['In this decay, a free neutron becomes', 'When a free neutron decays, it becomes'],
    [
      'In modern physics, this is a nuclear-force model valid within a particular low-energy range, not a description of a single elementary quantum of a universal nuclear field.',
      'In modern physics, pion exchange is useful as a nuclear-force model within a particular low-energy range, but pions are not fundamental carriers of the strong interaction.'
    ]
  ]
};
const locales = [];
for (const output of d370.outputs) {
  const locale = output.locale;
  const base = read(output.baseline.path);
  const beforeFile = path.join(path.dirname(output.candidate.path), `${locale}.before.template.json`);
  const before = read(beforeFile);
  const after = read(output.candidate.path);
  const working = read(output.working.path);
  const author = read(d357.templates.find(item => item.locale === locale).author.path);
  const flow = read(output.finalFlow.path);
  const edition = locale === 'zh' ? 'modern-us-neutral' : 'modern-us-neutral-en';
  const receiptFile = path.join(tmp,
    `d1816-d351-n151-bilingual-author/layout/${edition}.prose-flow.receipt.json`);
  const receipt = read(receiptFile);
  const delta = differences(before, after);
  check(`${locale}-BEFORE`, isDeepStrictEqual(base, before) &&
    sha(beforeFile) === sha(output.baseline.path), 'D370 before is byte-identical to D357 rebound.');
  check(`${locale}-CURRENT`, isDeepStrictEqual(after, working) &&
    sha(output.candidate.path) === sha(output.working.path), 'Current working input is byte-identical to repaired snapshot.');
  check(`${locale}-ONLY-TEXT15`, isDeepStrictEqual(delta, ['/prose/15/text']), delta);
  const replacements = independentReplacements[locale];
  let expectedText = before.prose[15].text;
  const occurrenceCounts = replacements.map(([from, to]) => {
    const count = expectedText.split(from).length - 1;
    expectedText = expectedText.replace(from, to);
    return { from, to, count };
  });
  check(`${locale}-ONLY-NECESSARY-REPLACEMENTS`,
    occurrenceCounts.every(item => item.count === 1) && after.prose[15].text === expectedText &&
    isDeepStrictEqual(output.replacements, replacements), occurrenceCounts);
  check(`${locale}-SOURCE`, isDeepStrictEqual(after.source, before.source) &&
    isDeepStrictEqual(after.source.data, repairedRaw) &&
    after.source.sha256 === sha(d357.repairedSource.path) &&
    after.prose.every((entry, i) => entry.source_text === repairedRaw.prose[i].text),
  'Complete source.data, hash and all 26 per-entry source_text values remain exact.');
  check(`${locale}-ORIGINAL-SOURCE`, isDeepStrictEqual(author.source.data, originalRaw) &&
    author.source.sha256 === sha(d357.originalSource.path),
  'Frozen pre-rebinding originalauthor source snapshot remains bound to original raw.');
  const formulaTokens = text => text.match(/\$[^$]*\$/g) || [];
  const digits = text => text.match(/[0-9]+(?:\.[0-9]+)?/g) || [];
  check(`${locale}-AFFECTED-MATH-DIGITS`,
    isDeepStrictEqual(formulaTokens(before.prose[15].text), formulaTokens(after.prose[15].text)) &&
    isDeepStrictEqual(digits(before.prose[15].text), digits(after.prose[15].text)),
  { formulaTokens: formulaTokens(after.prose[15].text), digits: digits(after.prose[15].text) });
  check(`${locale}-METADATA-ENTITIES-ANCHORS`, after.prose.length === 26 &&
    isDeepStrictEqual(after.section_breaks, before.section_breaks) &&
    after.prose.every((entry, i) => {
      const previous = { ...before.prose[i] };
      const current = { ...entry };
      delete previous.text;
      delete current.text;
      return isDeepStrictEqual(previous, current);
    }), 'All entry identities, source refs, historical_entities, change declarations and numeric metadata protected by exact comparison.');
  check(`${locale}-BASELINE-FLOW`, receipt.exitCode === 0 &&
    receipt.paragraphs.length === 45 && flow.before.length === 45 &&
    isDeepStrictEqual(flow.before.map(item => item.text), receipt.paragraphs.map(item => item.text)),
  'Retained D370 before texts exactly match successful D351 final-flow receipt reused in D358.');
  const expectedBeforeFlow = receipt.paragraphs.map((item, index) => ({
    ...base.prose[item.blockIndex], text: item.text,
    ...(receipt.resolvedBreaks.includes(index) ? { sectionBreak: true } : {})
  }));
  check(`${locale}-BEFORE-FLOW-METADATA`, isDeepStrictEqual(flow.before, expectedBeforeFlow),
    'Each final paragraph has the exact D357 block metadata, including repaired source-only bindings.');
  const expectedAfterFlow = flow.before.map((item, index) => {
    let text = item.text;
    if (receipt.paragraphs[index].blockIndex === 15) {
      for (const [from, to] of replacements) text = text.replace(from, to);
    }
    return { ...item, text };
  });
  check(`${locale}-RETAINED-AFTER-FLOW`, flow.after.length === 45 &&
    isDeepStrictEqual(flow.after, expectedAfterFlow),
  'Retained output contains exactly the affected substitutions; all other final paragraph text/metadata unchanged.');
  const changedFinalIndices = flow.after.flatMap((item, i) =>
    isDeepStrictEqual(item, flow.before[i]) ? [] : [i]);
  const expectedChangedIndices = locale === 'zh' ? [27] : [25, 26];
  check(`${locale}-EXPECTED-FINAL-DELTAS`, isDeepStrictEqual(changedFinalIndices, expectedChangedIndices),
    changedFinalIndices);
  const anchorResolutions = after.section_breaks.map(anchor => {
    const matches = flow.after.flatMap((item, index) =>
      index > 0 && flow.after[index - 1].text === anchor.before && item.text === anchor.after
        ? [index] : []);
    return { ...anchor, matches };
  });
  check(`${locale}-SIX-EXACT-ANCHORS`, anchorResolutions.length === 6 &&
    anchorResolutions.every(item => item.matches.length === 1) &&
    isDeepStrictEqual(anchorResolutions.map(item => item.matches[0]), receipt.resolvedBreaks),
  anchorResolutions.map(item => item.matches));
  const affectedIndices = receipt.paragraphs.flatMap((item, i) =>
    item.blockIndex === 15 ? [i] : []);
  const contextIndices = [...new Set(affectedIndices.flatMap(index => [index - 1, index, index + 1]))]
    .filter(index => index >= 0 && index < flow.after.length).sort((a, b) => a - b);
  locales.push({
    locale, baseline: output.baseline, beforeSnapshot: { path: beforeFile, sha256: sha(beforeFile) },
    repaired: output.candidate, working: output.working, finalFlow: output.finalFlow,
    historicalSuccessfulFlowReceipt: { path: receiptFile, sha256: sha(receiptFile) },
    jsonChangedPointers: delta, necessaryReplacements: occurrenceCounts,
    proseEntries: after.prose.length, finalParagraphs: flow.after.length,
    changedFinalIndices, affectedEntryFinalIndices: affectedIndices,
    anchorResolutions: anchorResolutions.map(item => item.matches),
    contextForReading: contextIndices.map(index => ({
      finalParagraph: index, blockIndex: receipt.paragraphs[index].blockIndex,
      changed: changedFinalIndices.includes(index),
      source_refs: flow.after[index].source_refs,
      before: flow.before[index].text,
      after: flow.after[index].text
    }))
  });
}
const evidence = {
  schema: 'stemrobin181/affected-binding-observations@1',
  stage: 'D371',
  status: checks.every(item => item.status === 'PASS') ? 'PASS' : 'FAIL',
  generatedAtUtc: new Date().toISOString(),
  inputFreezeSha256: sha(path.join(out, 'input-freeze.json')),
  checks, locales,
  flowMethod: 'Compare existing D370 before/after output with historical successful D351 paragraph mapping and exact template deltas. No proseFlow invocation or independent whole-flow rerun.',
  scientificMethod: 'Reuse frozen D358 SCI PASS; assess only whether the two language repairs preserve its stated qualifications.',
  formatterEvidence: {
    path: path.join(repo, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'),
    sha256: sha(path.join(repo, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js')),
    relevantLines: [115, 124],
    observation: 'proseFlow adds sectionBreak:true to exactly the resolved final-paragraph indices; inspected but not invoked.'
  },
  reviewerComparisonRecovery: {
    firstOutput: {
      path: path.join(out, 'comparison-observations.json'),
      sha256: sha(path.join(out, 'comparison-observations.json'))
    },
    cause: 'The first expected paragraph object omitted the production-generated sectionBreak field. The retained output had only that extra field at the six already validated historical anchor indices.',
    correction: 'Expected objects include exactly the field specified by the existing formatter and historical successful resolvedBreaks. All first comparison results are preserved; no candidate changes or content-review reset.',
    technicalRecoveries: 1,
    extraAuthorContentRepairs: 0,
    scienceOrLanguageReruns: 0
  },
  images: 0, producerCalls: 0, fullScienceReruns: 0, fullLanguageReruns: 0
};
const file = path.join(out, 'comparison-observations.final.json');
fs.writeFileSync(file, JSON.stringify(evidence, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({
  status: evidence.status, checks: checks.length,
  failures: checks.filter(item => item.status === 'FAIL'),
  evidence: { path: file, sha256: sha(file) },
  affectedFinalContext: locales.map(item => ({ locale: item.locale, context: item.contextForReading }))
}, null, 2));
