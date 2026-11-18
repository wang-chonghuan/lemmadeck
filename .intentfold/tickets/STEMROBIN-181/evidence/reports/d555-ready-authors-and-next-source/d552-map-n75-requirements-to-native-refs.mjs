import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  ticket, absolute, bytes, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`;
const baseline = `${base}/d538-n75-preauthor-confirmed-source-requirements`;
const extensionPath = `${base}/d548-n75-source200-requirement-extension/report.json`;
const folder = `${base}/d552-n75-native-ref-adapter`;
await verify(`${baseline}/report.json`,
  '7d7e3baa08ab549567a51eae644783c2bdbfe7a86133889412e37565f333bbd8');
await verify(extensionPath, 'd6a31169d9891d11c21aa44a5c221331164a34c734639f0a112592acba22337d');
assert.equal(await exists(folder), false);
const snapshots = await read(`${baseline}/source-blocks.json`);
const requirements = await read(`${baseline}/source-requirements.json`);
const extension = await read(extensionPath);
const mapping = new Map();
for (const page of snapshots.pages) {
  await verify(page.source_path, page.source_sha256);
  const source = await read(page.source_path);
  for (const row of page.blocks) {
    const index = Number(row.pointer.split('/').at(-1));
    assert.equal(row.source_ref, `p${String(page.page).padStart(4, '0')}#${index}`);
    const block = source.blocks[index];
    for (const key of ['kind', 'label', 'cont', 'open', 'samerow', 'lines', 'id']) {
      if (Object.hasOwn(row, key)) assert.deepEqual(row[key], block[key]);
    }
    mapping.set(row.source_ref, `p${String(page.page).padStart(4, '0')}#${index + 1}`);
  }
}
const page200 = await read(extension.page.path);
await verify(extension.page.path, extension.page.sha256);
for (let index = 0; index < page200.blocks.length; index++) {
  mapping.set(`p0200#${index}`, `p0200#${index + 1}`);
}
const changes = [];
function translate(value, trail = []) {
  if (Array.isArray(value)) return value.map((item, index) => translate(item, [...trail, index]));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, translate(item, [...trail, key])]));
  }
  if (typeof value === 'string' && /^p(?:019[7-9]|0200)#\d+$/.test(value)) {
    const replacement = mapping.get(value) ?? value.replace(/#(\d+)$/, (_, index) => `#${Number(index) + 1}`);
    changes.push({ pointer: `/${trail.join('/')}`, oldRef: value, nativeRef: replacement });
    return replacement;
  }
  return value;
}
const nativeRequirements = translate(requirements);
const nativeExtension = translate(extension);
for (let index = 0; index < requirements.requirements.length; index++) {
  assert.equal(nativeRequirements.requirements[index].requirement, requirements.requirements[index].requirement);
}
const nativeSource = translate(snapshots);
nativeSource.source_ref_convention = 'Native assemble convention: pNNNN#K identifies zero-based /blocks/(K-1).';
for (const [name, value] of [
  ['source-blocks.native-refs.json', nativeSource],
  ['source-requirements.native-refs.json', nativeRequirements],
  ['source200-extension.native-refs.json', nativeExtension],
]) await immutableWrite(`${folder}/${name}`, serialize(value));
const toolPath = '.claude/skills/ld-s10y-lesson/tools/assemble.py';
const tool = (await bytes(toolPath)).toString();
assert.ok(tool.includes('"ref": f"p{page:04d}#{i+1}"'));
const reportPath = `${folder}/report.json`;
await immutableWrite(reportPath, serialize({
  schema: 'STEMROBIN-181/n75-native-source-ref-adapter@1',
  ticket: 'STEMROBIN-181', status: 'MECHANICAL-REF-ADAPTER-PASS-SEMANTICS-NOT-REREVIEWED',
  finding: {
    status: 'FAIL-DIRECT-NATIVE-REF-COMPATIBILITY-OF-LEGACY-BASELINE',
    legacyConvention: 'Explicit zero-based custom pNNNN#K in d538, propagated to d548.',
    nativeConvention: 'One-based pNNNN#K from existing assemble.py; JSON pointers remain zero-based.',
    legacyReportsPreserved: true, sourceOrRequirementsMeaningChanged: false,
  },
  inputs: [await bind(`${baseline}/source-blocks.json`), await bind(`${baseline}/source-requirements.json`),
    await bind(extensionPath), await bind(toolPath)],
  outputs: await Promise.all(['source-blocks.native-refs.json', 'source-requirements.native-refs.json',
    'source200-extension.native-refs.json'].map(name => bind(`${folder}/${name}`))),
  mappings: [...mapping].map(([legacyRef, nativeRef]) => ({ legacyRef, nativeRef })),
  changedRefFields: changes, JSONPointersAndLiteralSourceFieldsUnchanged: true,
  requirementTextUnchanged: true, useOnlyNativeAdapterForFutureAuthoring: true,
  nativeRuns: 0, sourceSemanticReviews: 0, newImages: 0, parentImageCount: 24,
  sourcePagesAdded: 0, completeCardsAdded: 0, fullcard: false, historicalFAILHOLDPreserved: true,
}));
for (const name of ['source-blocks.native-refs.json', 'source-requirements.native-refs.json',
  'source200-extension.native-refs.json', 'report.json']) await fs.chmod(absolute(`${folder}/${name}`), 0o444);
console.log(JSON.stringify(await bind(reportPath)));
