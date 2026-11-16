import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const root = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const helper = `${work}/correct-9p-n50-n52-prose.mjs`;
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = async path => ({ path, sha256: hash(await fs.readFile(path)) });
const read = async path => JSON.parse(await fs.readFile(path, 'utf8'));
const number = Number(process.argv[2]);
assert.ok([50, 52].includes(number), 'Select only n50 or n52');
const index = number === 50 ? 10 : 6;
const id = `phy9-c1-s6-n${number}`;
const dir = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${id}`;
const templatePath = `${dir}/lesson.template.json`;
const beforePath = `${work}/9p-n${number}-before-science-correction.lesson.template.json`;
const reviewPath = `${work}/9p-n${number}-science-review.json`;
const freezePath = `${work}/9p-n${number}-prose-freeze.json`;
const reportPath = `${work}/9p-n${number}-correction-freeze.json`;
const before = await read(beforePath);
const candidate = await read(templatePath);
const review = await read(reviewPath);
const initial = await read(freezePath);
assert.equal((await bind(beforePath)).sha256, review.bindings.template.sha256);
assert.equal(initial.template.sha256, review.bindings.template.sha256);
assert.equal(review.status, 'revise');
assert.equal(review.findings.length, 1);
assert.equal(review.findings[0].id, 'F1');
assert.equal(review.findings[0].target, `lesson.prose[${index}]`);
assert.deepEqual(candidate.errata, before.errata);
assert.deepEqual(candidate.section_breaks, before.section_breaks);
for (const key of Object.keys(before).filter(key => key !== 'prose')) {
  assert.deepEqual(candidate[key], before[key]);
}
candidate.prose.forEach((block, i) => {
  if (i !== index) assert.deepEqual(block, before.prose[i]);
  for (const key of Object.keys(before.prose[i]).filter(key => !['text', 'changes'].includes(key))) {
    assert.deepEqual(block[key], before.prose[i][key]);
  }
});
assert.deepEqual(candidate.prose[index].changes, number === 50
  ? [...before.prose[index].changes, 'math-correction']
  : before.prose[index].changes);

const unchanged = await Promise.all([
  `${root}/lessons/${id}/lesson.json`, `${root}/lessons/${id}/lesson.md`,
  `${root}/lessons/${id}/exercises.json`,
].map(bind));
assert.equal(unchanged[0].sha256, review.bindings.source.sha256);
const source = await read(unchanged[0].path);
assert.deepEqual(candidate.source.data, source);
assert.equal(candidate.source.sha256, unchanged[0].sha256);

let sourceMetadataEvidence = null;
if (number === 50) {
  const page = `${root}/pages/0126`;
  const backup = `${work}/9p-n50-before-source126-erratum`;
  const currentPage = await read(`${page}/page.json`);
  const previousPage = await read(`${backup}/page.json`);
  assert.deepEqual(currentPage.blocks, previousPage.blocks);
  assert.deepEqual(
    { ...currentPage.meta, notes: previousPage.meta.notes, errata: previousPage.meta.errata },
    previousPage.meta,
  );
  assert.deepEqual(currentPage.meta.figures, previousPage.meta.figures);
  const body = bytes => {
    const at = bytes.indexOf('\n---\n');
    assert.ok(at >= 0);
    return bytes.subarray(at + 5);
  };
  const currentBody = body(await fs.readFile(`${page}/page.md`));
  assert.deepEqual(currentBody, body(await fs.readFile(`${backup}/page.md`)));
  sourceMetadataEvidence = {
    attribution: 'Main registered source126 metadata before this author correction; this helper makes no source writes.',
    current: await Promise.all(['page.md', 'page.json', 'audit.json'].map(name => bind(`${page}/${name}`))),
    before: await Promise.all(['page.md', 'page.json', 'audit.json'].map(name => bind(`${backup}/${name}`))),
    rawBodyByteIdentical: true, rawBodySha256: hash(currentBody), rawBlocksDeepEqual: true,
    pageMetadataChangedFields: ['notes', 'errata'], figureCropInventoryDeepEqual: true,
  };
}

const result = JSON.parse(execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', [
  '-B', '-c', String.raw`import json,sys
from pathlib import Path
sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools")
import edition
p=json.load(sys.stdin)
d=p["candidate"]
before=p["before"]
index=p["index"]
root=Path(p["book"])
raw=d["source"]["data"]
ex=json.loads((root/"lessons"/d["id"]/"exercises.json").read_text())
assert ex["count"]==0 and not ex["exercises"]
records=edition.source_errata(root,raw,ex)
if p["number"]==50:
    assert len(records)==1
    assert records[0]["id"]=="p0126-aluminum-young-modulus"
    assert records[0]["target"]=="lesson.prose[10]"
    assert records[0]["original"]==r"$E=7\times10^7$"
    records[0]["corrected"]=r"$E=7\times10^{10}$"
else:
    assert not records
d["errata"]=records
oldflow,errors=edition.prose_flow_contract(before["prose"],before["section_breaks"])
edition.normalize_lesson_layout(d)
newflow,flow_errors=edition.prose_flow_contract(d["prose"],[])
errors+=flow_errors
current={(v["blockIndex"],v["paragraphInBlock"]):v for v in newflow["paragraphs"]}
anchor_changes=[]
for k,boundary in enumerate(before["section_breaks"]):
    for side in ("before","after"):
        matches=[v for v in oldflow["paragraphs"] if v["text"]==boundary[side]]
        assert len(matches)==1
        old=matches[0]
        if old["blockIndex"]==index:
            new=current[(index,old["paragraphInBlock"])]["text"]
            if new!=boundary[side]:
                d["section_breaks"][k][side]=new
                anchor_changes.append({"path":f"/section_breaks/{k}/{side}","before":boundary[side],"current":new})
flow,anchor_errors=edition.prose_flow_contract(d["prose"],d["section_breaks"])
errors+=anchor_errors
errors+=edition.validate_source(root,d["source"],root/"lessons"/d["id"]/"lesson.json","lesson")
corrections,errata_errors=edition.validate_errata(root,raw,ex,d,ex)
errors+=errata_errors
target=f"lesson.prose[{index}]"
b=d["prose"][index]
profile=json.load(open(".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json"))
block_errors=edition.validate_text(b["source_text"],b["text"],b["changes"],b["numeric_changes"],target,profile["forbidden_terms"]+profile["forbidden_person_names"],b["historical_entities"],corrections.get(target,[]))
errors+=block_errors
expected=b["source_text"]
for c in corrections.get(target,[]):
    expected=expected.replace(c["original"],c["corrected"],1)
checks={
    "target":target,"source_refs":b["source_refs"],"errors":block_errors,
    "authorized_math_only":edition.math_signature(edition.normalize_numbered_subparts(expected))==edition.math_signature(edition.normalize_numbered_subparts(b["text"])),
    "nonmath_numbers_unchanged":edition.number_signature(before["prose"][index]["text"])==edition.number_signature(b["text"]),
    "math_fragments":len(edition.math_signature(b["text"])),
}
print(json.dumps({"lesson":d,"errors":errors,"checks":checks,"anchorChanges":anchor_changes,"paragraphs":len(flow["paragraphs"]),"boundaries":flow["boundaries"]},ensure_ascii=False))`,
], { input: JSON.stringify({ candidate, before, number, index, book: root }), encoding: 'utf8' }));
assert.deepEqual(result.errors, []);
assert.equal(result.checks.authorized_math_only, true);
assert.equal(result.checks.nonmath_numbers_unchanged, true);
const corrected = result.lesson;
for (const key of Object.keys(before).filter(key => !['prose', 'errata', 'section_breaks'].includes(key))) {
  assert.deepEqual(corrected[key], before[key]);
}
corrected.prose.forEach((block, i) => {
  if (i !== index) assert.deepEqual(block, before.prose[i]);
  for (const key of Object.keys(before.prose[i]).filter(key => !['text', 'changes'].includes(key))) {
    assert.deepEqual(block[key], before.prose[i][key]);
  }
});
assert.deepEqual(corrected.prose[index].changes, candidate.prose[index].changes);
assert.equal(corrected.section_breaks.length, before.section_breaks.length);
for (const binding of unchanged) assert.deepEqual(await bind(binding.path), binding);
if (sourceMetadataEvidence) {
  for (const binding of sourceMetadataEvidence.current) assert.deepEqual(await bind(binding.path), binding);
}
assert.equal((await bind(templatePath)).sha256, hash(JSON.stringify(candidate, null, 2) + '\n'));
await fs.writeFile(templatePath, JSON.stringify(corrected, null, 2) + '\n');
const report = {
  ticket: 'STEMROBIN-181', lesson: id, status: 'author-correction-frozen-awaiting-independent-F1-recheck',
  bindings: {
    template: await bind(templatePath), source: unchanged[0], before: await bind(beforePath),
    initial_author_freeze: await bind(freezePath), initial_science_review: await bind(reviewPath),
    helper: await bind(helper), source_md: unchanged[1], source_exercises: unchanged[2],
  },
  affected: [{
    finding: 'F1', target: `/prose/${index}`, source_refs: corrected.prose[index].source_refs,
    before: before.prose[index], current: corrected.prose[index],
    scope: number === 50
      ? 'One registered aluminum exponent correction and typical-value/model qualification; pending-error disclaimer removed. Original steel formula, comparison notation and all remaining block math/numbers preserved.'
      : 'Only explicit limitation of original unreconciled/unverified data and graph set to source-attributed qualitative brittle-versus-ductile comparison; no numerical inference using prior modulus example.',
  }],
  registered_errata: corrected.errata, affected_anchors: result.anchorChanges,
  preservation: {
    all_unaffected_blocks_deep_equal: true, source_snapshots_refs_identity_order_unchanged: true,
    all_unaffected_top_level_fields_deep_equal: true, figure_caption_placeholders_unchanged: true,
    n51_not_read_or_written: true, all_unaffected_anchors_deep_equal: true,
    raw_source_bindings_unchanged: unchanged,
  },
  source_metadata_evidence: sourceMetadataEvidence,
  native_affected_author_check: {
    status: 'pass', method: 'Native source_errata, validate_errata, affected-only validate_text, in-memory normalize_lesson_layout and prose_flow_contract. Unaffected blocks verified by deep equality, not substantively rereviewed.',
    checks: result.checks, errors: result.errors, normalized_paragraphs: result.paragraphs,
    boundary_count: result.boundaries.length,
  },
  limits: 'Affected-only author correction. Initial unchanged SCI evidence is retained for main to inherit; no independent self-approval, source/figure/context writes, external lookup, adapt-prepare/finalize, promotion, DB, git, app/shared-tool/dependency changes or other-chat message.',
};
await fs.writeFile(reportPath, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({
  freeze: await bind(reportPath), template: report.bindings.template, before: report.bindings.before,
  source: report.bindings.source, registeredErrata: corrected.errata,
  affectedAnchors: result.anchorChanges, nativeCheck: 'pass', independentReview: 'pending',
}, null, 2));
