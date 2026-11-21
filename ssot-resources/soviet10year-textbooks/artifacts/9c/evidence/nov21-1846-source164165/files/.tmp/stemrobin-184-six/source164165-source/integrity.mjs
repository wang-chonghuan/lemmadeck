import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
const root = path.join(repo, '.tmp/stemrobin-184-six/source164165-source');
assert.equal(process.cwd(), repo);
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const binding = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const verify = record => assert.deepEqual(binding(record.path), {
  path: record.path, bytes: record.bytes, sha256: record.sha256,
});
const manifest = read(path.join(root, 'manifest.json'));
assert.equal(manifest.root, root);
assert.equal(manifest.excludesOnlySelf, 'manifest.json');
assert.equal(fs.statSync(root).mode & 0o777, 0o555);
assert.deepEqual(fs.readdirSync(root).sort(), [...manifest.files.map(file => file.name), 'manifest.json'].sort());
for (const file of manifest.files) {
  assert.equal(file.path, path.join(root, file.name));
  verify(file);
}
for (const name of fs.readdirSync(root)) {
  assert.equal(fs.statSync(path.join(root, name)).mode & 0o777, 0o444);
  if (name.endsWith('.json')) read(path.join(root, name));
}
for (const ref of manifest.externalRefs) verify(ref);
const packageData = read(path.join(root, 'package.json'));
for (const ref of [
  ...packageData.bodyBindings, ...packageData.freezeBindings,
  packageData.comparison, packageData.usage, packageData.report,
]) verify(ref);

const owners = new Map();
const rows = new Map();
for (const page of packageData.pages) {
  const freeze = read(path.join(root, `0${page}.freeze.json`));
  verify(freeze.source);
  const body = fs.readFileSync(path.join(root, freeze.body), 'utf8');
  const blocks = [];
  for (const line of body.trimEnd().split('\n')) {
    const match = /^<!-- (h[123]|p|exhead|ex \d+|fig .+ box \d+,\d+,\d+,\d+|cap .+|foot)(?: (cont|open|samerow|owner-ex \d+))? -->$/.exec(line);
    if (match) {
      blocks.push({ type: match[1], lines: [] });
    } else {
      assert(blocks.length && line.length, 'BODY line without typed owner');
      blocks.at(-1).lines.push(line);
      assert(!line.includes('\u21b5\n'), 'LF immediately after physical math wrap');
      const spans = line.split('$');
      assert.equal(spans.length % 2, 1, 'Unpaired lexical math delimiter');
      for (let i = 0; i < spans.length; i += 2) {
        assert(!spans[i].includes('\u21b5'), 'Wrap marker outside lexical math span');
      }
    }
  }
  assert.equal(blocks.length, freeze.blocks.length, 'Owner structure mismatch');
  freeze.blocks.forEach((block, index) => {
    const kind = blocks[index].type.split(' ')[0];
    assert.equal(kind, block.kind);
    assert(!owners.has(block.id), 'Duplicate owner ID');
    owners.set(block.id, block);
  });
  freeze.physicalRows.forEach(row => {
    const block = owners.get(row.owner);
    assert(block && block.rows.includes(row.row), 'Row references unknown owner');
    const id = `${page}:${row.row}`;
    assert(!rows.has(id), 'Duplicate row ID');
    rows.set(id, row);
  });
  for (const scope of freeze.mathScopes) assert(owners.has(scope.owner));
}
const comparisons = read(path.join(root, 'comparison.json'));
for (const comparison of comparisons) {
  verify(comparison.originalTemplate);
  verify(comparison.originalLayoutBinding);
  verify(comparison.proposal.bodyReference);
  verify(comparison.proposal.notesEvidence);
  const original = read(comparison.originalLayoutBinding.path);
  assert.deepEqual(original, comparison.originalLayout, 'Changed original projection fields');
  assert.deepEqual(comparison.projectionOwners.map(map => map.originalBand), original.line_bands, 'Incomplete projection references');
  comparison.projectionOwners.forEach((map, index) => {
    assert.equal(map.bandOrdinal, index + 1);
    assert.deepEqual(map.originalBand, original.line_bands[index]);
    if (map.frozenOwner !== null) {
      assert(owners.has(map.frozenOwner), 'Map references unknown owner');
      assert.equal(rows.get(`${comparison.physicalPage}:${map.frozenRow}`)?.owner, map.frozenOwner);
    }
  });
}
const stages = [...packageData.completedStages.map(stage => stage.name),
  'source164165-first-build-nov21', 'source164165-first-seal-nov21'];
const actualStages = stages.map(name => {
  const receipt = path.join(repo, `.tmp/stemrobin-184-six/stages/${name}.receipt.json`);
  const facts = read(receipt);
  assert.equal(facts.cwd, repo);
  assert.equal(facts.exitCode, 0, `Actual failed stage retained: ${name}`);
  const streams = Object.entries(facts.outputs).map(([stream, ref]) => {
    const bound = { ...ref, path: path.join(repo, ref.path) };
    verify(bound);
    return { stream, ...bound };
  });
  return { name, exitCode: facts.exitCode, receipt: binding(receipt), streams };
});
console.log(JSON.stringify({
  status: 'PASS_BYTE_JSON_REFS_GRAMMAR_MAPS_ONLY',
  manifest: binding(path.join(root, 'manifest.json')),
  filesChecked: manifest.files.length + 1,
  externalRefsChecked: manifest.externalRefs.length,
  rasterDecodes: 0,
  newImageViews: 0,
  mathematicalSourceCountOrBoundaryAcceptance: false,
  actualStages,
  holds: packageData.holds,
  state: 'OPEN_FOR_FULL_PARENT_TEXT_INTAKE_AND_EXPLICIT_CLOSE',
}, null, 2));
