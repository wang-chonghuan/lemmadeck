import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180';
assert.equal(process.cwd(), W);
const root = path.join(W, 'ssot-resources/soviet10year-textbooks/artifacts/8p');
const review = path.join(root, 'lessons/phy8-c1-s2-n12/source-review');
const out = path.join(review, 'native62-typography');
const ticket = path.join(W, '.intentfold/tickets/STEMROBIN-180');
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const bind = name => {
  assert.ok(path.resolve(name).startsWith(`${W}/`));
  const bytes = fs.readFileSync(name);
  return {path:name,bytes:bytes.length,sha256:sha(bytes)};
};
const priorReport = bind(path.join(ticket, 'source-review-8p-n12-recovery.md'));
assert.equal(priorReport.sha256,
  '1734e547c2500ce97762616a3b55273150d8d0f400757444154bc53d5dd6714e');
const priorPath = path.join(review, 'finalized-bindings.json');
const prior = JSON.parse(fs.readFileSync(priorPath, 'utf8'));
const pages = [62, 61].map(n => {
  const dir = path.join(root, 'pages', String(n).padStart(4, '0'));
  const mdPath = path.join(dir, 'page.md');
  const rows = fs.readFileSync(mdPath, 'utf8').replaceAll('\r\n', '\n').split('\n');
  const end = rows.indexOf('---', 1);
  assert.ok(rows[0] === '---' && end > 0);
  const metadata = JSON.parse(rows.slice(1, end).join('\n'));
  const blocks = [];
  let block;
  for (const row of rows.slice(end + 1)) {
    const header = row.match(/^<!-- (.*?) -->$/);
    if (header) {
      block = {header:header[1],lines:[]};
      blocks.push(block);
    } else if (row.trim()) {
      assert.ok(block);
      block.lines.push(row);
    }
  }
  const jsonPath = path.join(dir, 'page.json');
  const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  assert.deepEqual(metadata, json.meta);
  const jsonBlocks = json.blocks.map(item => ({
    header:[item.kind,item.label,
      ...['cont','open','samerow'].filter(key => item[key])].filter(Boolean).join(' '),
    lines:item.lines,
  }));
  assert.deepEqual(blocks, jsonBlocks);
  const bodySha256 = sha(JSON.stringify(blocks));
  const formulas = blocks.flatMap((item, b) => item.lines.flatMap((row, r) =>
    [...row.matchAll(/\$([^$]+)\$/g)].map(match => ({
      block:b,row:r,latex:match[1],
    }))));
  const formulasSha256 = sha(JSON.stringify(formulas));
  const old = prior.pages.find(page => page.page === n);
  assert.equal(bodySha256, old.semanticBodySha256);
  assert.equal(formulasSha256, old.formulasSha256);
  const result = {
    page:n, md:bind(mdPath), json:bind(jsonPath), semanticBodySha256:bodySha256,
    formulasSha256, matchesPriorBodyAndFormulas:true, metadataMatchesJSON:true,
  };
  if (n === 62) {
    const targets = [
      {unit:'T62-1',block:4,rows:[0,1]},
      {unit:'T62-2',block:3,rows:[0]},
      {unit:'T62-3',block:1,rows:[0,1,2]},
    ];
    result.targetBindings = targets.map(target => ({
      ...target, lines:target.rows.map(r => blocks[target.block].lines[r]),
      decision:'PASS_ZERO_EDIT',
    }));
  } else {
    const erratum = metadata.errata.find(item => item.id === 'p0061-projection-norm-1');
    assert.ok(erratum);
    assert.equal(erratum.block, 'p0061#6');
    assert.equal(erratum.original, '它们投影的绝对值等于矢量和的绝对值');
    assert.ok(blocks[5].lines.join('').includes(erratum.original));
    assert.ok(erratum.reason.includes('现代'));
    const receiptDir = path.join(dir, 'finalize-source-erratum');
    const receiptPath = path.join(receiptDir, 'execution.json');
    const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
    assert.equal(receipt.cwd, W);
    assert.equal(receipt.exit_code, 0);
    const stdoutPath = path.join(receiptDir, 'stdout.txt');
    const stderrPath = path.join(receiptDir, 'stderr.txt');
    assert.match(fs.readFileSync(stdoutPath, 'utf8'), /25 行（印刷 25）/);
    assert.match(fs.readFileSync(stdoutPath, 'utf8'), /规范化 0 处/);
    assert.equal(fs.statSync(stderrPath).size, 0);
    result.erratum = erratum;
    result.registrationReceipt = {
      receipt:bind(receiptPath),stdout:bind(stdoutPath),stderr:bind(stderrPath),
      actualExecution:receipt,
    };
    result.modernCorrectionReviewed = false;
  }
  return result;
});
const cropPath = path.join(out, 'crop-bindings.json');
const crops = JSON.parse(fs.readFileSync(cropPath, 'utf8'));
assert.equal(bind(crops.source.path).sha256, crops.source.sha256);
for (const crop of crops.crops) assert.deepEqual(bind(crop.file.path), crop.file);
const ownFiles = [
  path.join(out, 'independent-observations.md'), cropPath,
  path.join(review, 'native62-crop.py'), path.join(out, 'bind-supplement.mjs'),
  ...crops.crops.map(crop => crop.file.path),
].map(bind);
const report = bind(path.join(ticket, 'source-review-8p-n12-native62-typography.md'));
const result = {
  schema:'source-review/native62-typography-supplement@1',workspace:W,
  exportedAt:new Date().toISOString(), report, priorReport,
  priorFinalizedBindings:bind(priorPath), priorReportUnchanged:true,
  nativeSource:crops.source, sourceImageRepresentation:crops,
  observationsWrittenBeforeCurrentMDRead:true, ownFiles, pages,
  affectedVerdicts:{'T62-1':'PASS','T62-2':'PASS','T62-3':'PASS'},
  remainingAffectedHolds:0, sourceEdits:0, reviewerFinalizeCalls:0,
  imageLedger:{prior:8,new:3,cumulative:11,limit:24,phaseLimit:3,
    reopens:0,wholepageViews:0,otherPageSourceViews:0,payloadsReturned:0},
  historicalFailureCountReset:false,historicalCostReset:false,
  modernScienceApproval:false,assemblyOrPromotion:false,
};
const destination = path.join(out, 'bindings.json');
assert.ok(!fs.existsSync(destination));
fs.writeFileSync(destination, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({
  report,bindings:bind(destination),priorReportUnchanged:true,
  pages:pages.map(({page,md,json,semanticBodySha256,formulasSha256,
    matchesPriorBodyAndFormulas}) => ({
    page,md,json,semanticBodySha256,formulasSha256,matchesPriorBodyAndFormulas,
  })),
  affectedVerdicts:result.affectedVerdicts,imageLedger:result.imageLedger,
}, null, 2));
