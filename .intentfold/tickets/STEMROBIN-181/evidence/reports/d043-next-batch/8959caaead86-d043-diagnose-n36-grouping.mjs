import assert from 'node:assert/strict';
import {
  ticket, read, bind, verify, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const folder = `${ticket}/tmp/d043-10p-n36-flow-repair`;
const freezePath = `${folder}/repair-freeze.json`;
await verify(freezePath, '8806d1763a05258cbe818edfcde489408292c36ba46fb80b2e1dcf4b0a024f28');
const freeze = await read(freezePath);
const languages = [];
const paragraphs = text => text.split(/\n{2,}/).map(value => value.trim()).filter(Boolean);
const compact = text => paragraphs(text).map(value => value.replace(/\s+/g, ''));
for (const language of freeze.languages) {
  for (const row of [language.candidate, language.nativeNormalized, language.check])
    await verify(row.path, row.sha256);
  const candidate = await read(language.candidate.path);
  const normalized = await read(language.nativeNormalized.path);
  const changes = candidate.prose.map((block, index) => {
    const actual = normalized.prose[index];
    const sameGroups = JSON.stringify(compact(block.text)) === JSON.stringify(compact(actual.text));
    assert.equal(block.text.replace(/\s+/g, ''), actual.text.replace(/\s+/g, ''));
    return {
      blockIndex: index, desiredParagraphs: paragraphs(block.text).length,
      actualParagraphs: paragraphs(actual.text).length,
      sameGroupsIgnoringLineWhitespace: sameGroups,
      classification: sameGroups ? 'whitespace-only-not-a-semantic-layout-failure' : 'complete-sentence-grouping-changed',
      semicolonParagraphEnds: paragraphs(actual.text).filter(value => /[;；]$/.test(value)),
    };
  });
  const blockingBlocks = changes.filter(row => !row.sameGroupsIgnoringLineWhitespace);
  assert.ok(blockingBlocks.length > 0);
  assert.ok(blockingBlocks.some(row => row.semicolonParagraphEnds.length > 0));
  languages.push({
    language: language.language, inputs: [language.candidate, language.nativeNormalized, language.check],
    changes, blockingBlocks: blockingBlocks.map(row => row.blockIndex),
    completeSentenceGroupingPASS: false,
  });
}
const output = `${folder}/grouping-diagnosis.json`;
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card: freeze.card, status: 'HOLD-actual-grouping-not-whitespace',
  probe: await bind(freezePath), languages,
  policy: 'Existing probe observations classified without rerunning normalization, finalization, source review or rendering.',
  originalFailurePreserved: true, inputWordsAndOrderUnchanged: true,
  parentImageOpens: 0, canonicalPromotion: false, fullCardApproval: false,
}, null, 2)}\n`);
console.log(JSON.stringify({ diagnosis: await bind(output),
  blocks: languages.map(row => ({ language: row.language, blocking: row.blockingBlocks })) }));
