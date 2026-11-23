import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180';
assert.equal(process.cwd(), W);
const root = path.join(W, 'ssot-resources/soviet10year-textbooks/artifacts/8p');
const out = path.join(root, 'lessons/phy8-c1-s2-n12/source-review');
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const file = name => {
  assert.ok(path.resolve(name).startsWith(`${W}/`));
  const buffer = fs.readFileSync(name);
  return {path: name, bytes: buffer.length, sha256: sha(buffer)};
};
const inventoryPath = path.join(out, 'semantic-inventory.json');
const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
const pages = inventory.pages.map(original => {
  const id = String(original.page).padStart(4, '0');
  const dir = path.join(root, 'pages', id);
  const mdPath = path.join(dir, 'page.md');
  const rows = fs.readFileSync(mdPath, 'utf8').replaceAll('\r\n', '\n').split('\n');
  const end = rows.indexOf('---', 1);
  assert.ok(rows[0] === '---' && end > 0);
  const metadata = JSON.parse(rows.slice(1, end).join('\n'));
  const mdBlocks = [];
  let block;
  for (const row of rows.slice(end + 1)) {
    const header = row.match(/^<!-- (.*?) -->$/);
    if (header) {
      block = {header: header[1], lines: []};
      mdBlocks.push(block);
    } else if (row.trim()) {
      assert.ok(block);
      block.lines.push(row);
    }
  }
  const jsonPath = path.join(dir, 'page.json');
  const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  assert.deepEqual(metadata, json.meta);
  const jsonBlocks = json.blocks.map(item => ({
    header: [item.kind, item.label,
      ...['cont', 'open', 'samerow'].filter(flag => item[flag])].filter(Boolean).join(' '),
    lines: item.lines,
  }));
  const scoped = value => original.page === 65 ? value.slice(0, 2) : value;
  assert.deepEqual(scoped(mdBlocks), original.blocks, `MD body drift p${id}`);
  assert.deepEqual(scoped(jsonBlocks), original.blocks, `JSON body drift p${id}`);
  const formulas = scoped(mdBlocks).flatMap((item, b) => item.lines.flatMap((row, r) =>
    [...row.matchAll(/\$([^$]+)\$/g)].map(match => ({block:b,row:r,latex:match[1]}))));
  assert.equal(sha(JSON.stringify(formulas)), original.formulasSha256);
  let recovery = null;
  if (original.page !== 59) {
    const recoveryDir = path.join(dir, 'finalize-source-recovery');
    const receiptPath = path.join(recoveryDir, 'execution.json');
    const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
    assert.equal(receipt.cwd, W);
    assert.equal(receipt.exit_code, 0);
    const stdoutPath = path.join(recoveryDir, 'stdout.txt');
    const stderrPath = path.join(recoveryDir, 'stderr.txt');
    const stdout = fs.readFileSync(stdoutPath, 'utf8');
    assert.match(stdout, /25 行（印刷 25）/);
    assert.match(stdout, /规范化 0 处/);
    assert.equal(fs.statSync(stderrPath).size, 0);
    recovery = {receipt: file(receiptPath), stdout:file(stdoutPath),
      stderr:file(stderrPath), actualExecution:receipt};
  }
  return {page:original.page, scope:original.scope, md:file(mdPath), json:file(jsonPath),
    semanticBodySha256:original.semanticBodySha256,
    formulasSha256:original.formulasSha256,
    mdSemanticUnchanged:true, jsonSemanticMatchesReviewedMD:true,
    metadataMatchesJSON:true, recovery};
});
const reportPath = path.join(W,
  '.intentfold/tickets/STEMROBIN-180/source-review-8p-n12-recovery.md');
const result = {
  schema:'source-review/finalized-bindings@1', workspace:W,
  exportedAt:new Date().toISOString(), inventory:file(inventoryPath),
  priorBindingExport:file(path.join(out, 'bindings.json')),
  report:file(reportPath), script:file(path.join(out, 'bind-finalized.mjs')),
  suppliedTechnical60CandidateSha256:
    'b7c18ef0992b98a27b56ecd0437c3a5f2286f6da1ab5df02b0189ed14cc9a03a',
  suppliedTechnical60Status:'PASS_COLLECTED_CLOSED',
  pages, imageReopens:0, semanticReviewRepeated:false, reviewerFinalizeCalls:0,
  semanticVerdictsUnchanged:true, assemblyOrPromotion:false,
};
const destination = path.join(out, 'finalized-bindings.json');
fs.writeFileSync(destination, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({report:result.report, finalizedBindings:file(destination),
  pages:pages.map(({page,md,json,mdSemanticUnchanged,jsonSemanticMatchesReviewedMD}) =>
    ({page,md,json,mdSemanticUnchanged,jsonSemanticMatchesReviewedMD}))}, null, 2));
