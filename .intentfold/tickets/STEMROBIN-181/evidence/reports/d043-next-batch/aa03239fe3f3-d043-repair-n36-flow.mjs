import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, read, bytes, bind, verify, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const author = `${ticket}/tmp/d042-10p-n36-author/complete`;
const folder = `${ticket}/tmp/d043-10p-n36-flow-repair`;
const reviewPath = `${ticket}/tmp/d043-10p-n36-science-review.json`;
await verify(reviewPath, 'fa5462d33f6ce60087f1931b4187729a8201cf8a747d7c852f2febf0bc2b14b8');
await verify(`${author}/author-freeze.json`, '9aa558e9044043d45890bf9bfb7a9f7c5df81176490669f8eb3d154c2eb0e0bf');
const review = await read(reviewPath);
assert.equal(review.SCI, true);
assert.equal(review.ZHEN, false);
assert.deepEqual(review.findings.map(row => row.id), ['F1']);
const requireNative = createRequire(absolute('.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const { proseOutline, proseFlow, sectionBreakIndices } = requireNative('./htmlfrag.js');
const freeze = await read(`${author}/author-freeze.json`);
const inputs = [await bind(reviewPath), await bind(`${author}/author-freeze.json`),
  await bind('.claude/skills/ld-s10y-lesson/tools/edition.py')];
const groupSizes = [[3], [2], [2, 2], [2], [2, 2], [2, 2], [3], [2, 2]];
const languages = [];
for (const language of freeze.languages) {
  const originalPath = language.templates.find(row => row.path.endsWith('/lesson.template.json')).path;
  const original = await read(originalPath);
  const candidate = structuredClone(original);
  assert.equal(original.prose.length, 8);
  const originalOutline = proseOutline(original.prose);
  const transitions = sectionBreakIndices(original.prose, original.section_breaks).map(index => ({
    beforeBlock: originalOutline[index - 1].blockIndex, afterBlock: originalOutline[index].blockIndex,
  }));
  const sentenceGroups = [];
  for (const [blockIndex, block] of candidate.prose.entries()) {
    const sentences = [];
    for (const line of block.text.split(/\n+/).map(text => text.trim()).filter(Boolean)) {
      if (sentences.length && /[;；]$/.test(sentences.at(-1))) sentences[sentences.length - 1] += ` ${line}`;
      else sentences.push(line);
    }
    assert.equal(sentences.length, groupSizes[blockIndex].reduce((sum, size) => sum + size, 0));
    assert.ok(sentences.every(sentence => /[.!?。！？]["”’']?$/.test(sentence)));
    let offset = 0;
    const groups = groupSizes[blockIndex].map(size => {
      const group = sentences.slice(offset, offset + size);
      offset += size;
      return group;
    });
    block.text = groups.map(group => group.join(' ')).join('\n\n');
    assert.equal(block.text.replace(/\s+/g, ''), original.prose[blockIndex].text.replace(/\s+/g, ''));
    sentenceGroups.push({ blockIndex, groups });
  }
  const outline = proseOutline(candidate.prose);
  candidate.section_breaks = transitions.map(transition => {
    const index = outline.findIndex(row => row.blockIndex === transition.afterBlock);
    assert.ok(index > 0);
    assert.equal(outline[index - 1].blockIndex, transition.beforeBlock);
    return { before: outline[index - 1].text, after: outline[index].text };
  });
  const originalNonProse = { ...original, prose: null, section_breaks: null };
  assert.deepEqual({ ...candidate, prose: null, section_breaks: null }, originalNonProse);
  const candidatePath = `${folder}/${language.language}/lesson.template.json`;
  await immutableWrite(candidatePath, `${JSON.stringify(candidate, null, 2)}\n`);
  for (const row of language.templates.filter(row => !row.path.endsWith('/lesson.template.json')))
    await immutableWrite(`${folder}/${language.language}/${row.path.split('/').at(-1)}`, await bytes(row.path));
  const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B', '-c', [
    'import sys,json', "sys.path.insert(0,'.claude/skills/ld-s10y-lesson/tools')", 'import edition',
    'lesson=json.load(sys.stdin)', 'edition.normalize_lesson_layout(lesson)',
    'print(json.dumps(lesson,ensure_ascii=False))',
  ].join('\n')];
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root, input: JSON.stringify(candidate), encoding: 'utf8', timeout: 180000,
  });
  assert.equal(result.status, 0, result.stderr);
  const normalized = JSON.parse(result.stdout);
  const normalizedPath = `${folder}/${language.language}/native-normalized-lesson.json`;
  await immutableWrite(normalizedPath, `${JSON.stringify(normalized, null, 2)}\n`);
  const drifts = normalized.prose.flatMap((block, index) => block.text === candidate.prose[index].text
    ? [] : [{ blockIndex: index, desired: candidate.prose[index].text, native: block.text }]);
  let boundaryError = null;
  try { sectionBreakIndices(normalized.prose, normalized.section_breaks); }
  catch (error) { boundaryError = error.message; }
  const receiptPath = `${folder}/${language.language}/native-normalization-check.json`;
  await immutableWrite(receiptPath, `${JSON.stringify({
    command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
    desiredFlow: proseFlow(candidate.prose, candidate.section_breaks),
    nativeOutline: proseOutline(normalized.prose), drifts, boundaryError,
    status: drifts.length || boundaryError ? 'HOLD-native-grouping-drift' : 'PASS-affected-layout',
    exactWordsAndOrderPreserved: true, completeSentenceGroupSizes: groupSizes, sentenceGroups,
    nativeAdaptFinalizeRun: false, nativeRenderRun: false,
  }, null, 2)}\n`);
  languages.push({
    language: language.language, candidate: await bind(candidatePath),
    nativeNormalized: await bind(normalizedPath), check: await bind(receiptPath),
    driftBlocks: drifts.map(row => row.blockIndex), boundaryError,
  });
  inputs.push(...language.templates);
}
for (const input of inputs) await verify(input.path, input.sha256);
const blocked = languages.some(row => row.driftBlocks.length || row.boundaryError);
const output = `${folder}/repair-freeze.json`;
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card: freeze.card,
  status: blocked ? 'HOLD-native-normalization-overwrites-reviewed-grouping' : 'AFFECTED-FLOW-REPAIR-REVIEW-PENDING',
  inputs, languages, SCI: 'PASS-reused', ZHEN: blocked ? 'HOLD-layout' : 'affected-review-pending',
  cause: 'The existing native normalizer treats semicolons as line boundaries and greedily regroups at 180 characters, overwriting the complete-sentence groups and their native section anchors.',
  completeSentencesAndWordsPreservedInCandidate: true, authorRepairs: 1,
  originalFreezeAndInitialHoldUnchanged: true, questionsUnchanged: true,
  sourceReviewReplays: 0, scienceReviewReplays: 0, nativeFinalizations: 0,
  nativeRenders: 0, imageOpens: 0, canonicalPromotion: false, fullCardApproval: false,
  nextAction: blocked ? 'Keep n36 incomplete; no normalization bypass or shared-tool edit performed.' : 'Affected-only independent language-flow review.',
}, null, 2)}\n`);
console.log(JSON.stringify({ freeze: await bind(output), status: blocked ? 'HOLD' : 'repair-pending',
  languages: languages.map(row => ({ language: row.language, driftBlocks: row.driftBlocks, boundaryError: row.boundaryError })) }));
