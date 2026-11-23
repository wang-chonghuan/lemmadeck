import assert from 'node:assert/strict';
import { ticket, read, save, bind } from './n42-native.mjs';

const out = `${ticket}/tmp/d1816-d2055-historical-term-recovery`;
const entries = [
  {
    stage: 'd2008-n87', name: 'lesson.template.json', collection: 'prose', index: 18,
    terms: ['Soviet', 'Grebenshchikov', 'Terenin'],
    failure: 'd2040-n87-adapt-finalize',
  },
  {
    stage: 'd2009-t12', name: 'exercises.template.json', collection: 'exercises', index: 0,
    terms: ['Michelson'], failure: 'd2047-t12-adapt-finalize',
  },
];
const results = [];
for (const entry of entries) {
  const source = `${ticket}/tmp/d1816-${entry.stage}-first-en-author/${entry.name}`;
  const original = read(source), document = structuredClone(original);
  const block = document[entry.collection][entry.index];
  const declarations = block.historical_entities;
  assert.equal(declarations.length, entry.terms.length);
  const delta = declarations.map((declaration, index) => {
    assert(block.source_text.includes(declaration.term));
    assert(block.text.includes(entry.terms[index]));
    const before = structuredClone(declaration);
    declaration.source_term = declaration.term;
    declaration.term = entry.terms[index];
    return { index, before, after: structuredClone(declaration) };
  });
  assert(block.changes.includes('translation'));
  const normalized = structuredClone(document);
  normalized[entry.collection][entry.index].historical_entities =
    original[entry.collection][entry.index].historical_entities;
  assert.deepEqual(normalized, original);
  const destination = `${out}/${entry.stage}/${entry.name}`;
  save(destination, document);
  results.push({
    source: bind(source), candidate: bind(destination),
    firstFailure: bind(`${ticket}/tmp/d1816-recovery/native/${entry.failure}/receipt.json`),
    delta, textMathSourceAndOtherMetadataUnchanged: true,
  });
}
save(`${out}/provenance.json`, {
  status: 'LOCALIZED_HISTORICAL_DECLARATIONS_NOT_ENGLISH_APPROVAL',
  changes: results,
  nativeContract: 'English term occurs in current text; exact Chinese source_term occurs in source_text; translation change retained.',
  originalAuthorsUnchanged: true,
  imagesOpened: 0, databaseWrites: 0, paidCalls: 0,
});
console.log(JSON.stringify({ results, independentEnglishReviewStillRequired: true }));
