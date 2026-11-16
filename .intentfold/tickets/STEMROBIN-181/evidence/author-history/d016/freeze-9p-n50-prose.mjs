import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const root = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = async path => ({ path, sha256: hash(await fs.readFile(path)) });
const read = async path => JSON.parse(await fs.readFile(path, 'utf8'));

export async function freezeProse({ number, expectedSourceSha, sourceBlocks, boundaryBlocks, topics, risks = [], notationChanges = [] }) {
  const id = `phy9-c1-s6-n${number}`;
  const dir = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${id}`;
  const templatePath = `${dir}/lesson.template.json`;
  const beforePath = `${work}/9p-n${number}-before-authoring.lesson.template.json`;
  const sourcePath = `${root}/lessons/${id}/lesson.json`;
  const reportPath = `${work}/9p-n${number}-prose-freeze.json`;
  const before = await read(beforePath), current = await read(templatePath), source = await read(sourcePath);
  const sourceBinding = await bind(sourcePath);
  assert.equal(sourceBinding.sha256, expectedSourceSha);
  assert.equal(current.id, id);
  assert.equal(current.source.sha256, sourceBinding.sha256);
  assert.deepEqual(current.source.data, source);
  assert.equal(current.prose.length, sourceBlocks);
  assert.equal(current.prose.length, source.prose.length);
  assert.equal(current.exercise_count, 0);
  assert.deepEqual(current.errata, []);
  assert.deepEqual(current.section_breaks, []);
  for (const key of Object.keys(before).filter(key => !['prose', 'section_breaks'].includes(key))) {
    assert.deepEqual(current[key], before[key], `Unexpected ${id}.${key} change`);
  }
  current.prose.forEach((block, index) => {
    assert.equal(block.source_text, source.prose[index].text);
    for (const key of Object.keys(before.prose[index]).filter(key => !['text', 'changes'].includes(key))) {
      assert.deepEqual(block[key], before.prose[index][key], `Unexpected ${id}.prose[${index}].${key} change`);
    }
    if (block.kind !== 'p') assert.deepEqual(block, before.prose[index]);
  });
  const unchanged = [];
  for (const file of [
    sourcePath, `${root}/lessons/${id}/lesson.md`, `${root}/lessons/${id}/exercises.json`,
    `${dir}/figures.template.json`, `${dir}/exercises.template.json`,
  ]) unchanged.push(await bind(file));

  const result = JSON.parse(execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', [
    '-B', '-c', String.raw`import json,sys
from pathlib import Path
sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools")
import edition,mathcheck
p=json.load(sys.stdin)
d=p["lesson"]
root=Path(p["book"])
raw=d["source"]["data"]
ex=json.loads((root/"lessons"/d["id"]/"exercises.json").read_text())
assert ex["count"]==0 and not ex["exercises"]
edition.normalize_lesson_layout(d)
flow,errors=edition.prose_flow_contract(d["prose"],[])
for block_index in p["boundaryBlocks"]:
    paragraph=next(x for x in flow["paragraphs"] if x["blockIndex"]==block_index and x["paragraphInBlock"]==0)
    assert paragraph["index"]>0
    d["section_breaks"].append({"before":flow["paragraphs"][paragraph["index"]-1]["text"],"after":paragraph["text"]})
flow,anchor_errors=edition.prose_flow_contract(d["prose"],d["section_breaks"])
errors+=anchor_errors
errors+=edition.validate_source(root,d["source"],root/"lessons"/d["id"]/"lesson.json","lesson")
corrections,errata_errors=edition.validate_errata(root,raw,ex,d,ex)
errors+=errata_errors
assert not corrections and not d["errata"]
profile=json.load(open(".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json"))
forbidden=profile["forbidden_terms"]+profile["forbidden_person_names"]
coverage=[]
for i,b in enumerate(d["prose"]):
    text_errors=edition.validate_text(b["source_text"],b["text"],b["changes"],b["numeric_changes"],f"lesson.prose[{i}]",forbidden,b["historical_entities"])
    errors+=text_errors
    original=edition.normalize_numbered_subparts(b["source_text"])
    modern=edition.normalize_numbered_subparts(b["text"])
    coverage.append({"index":i,"kind":b["kind"],"source_refs":b["source_refs"],"math_fragments":len(edition.math_signature(original)),"normalized_math_signature_preserved":edition.math_signature(original)==edition.math_signature(modern),"nonmath_number_signature_preserved":edition.number_signature(original)==edition.number_signature(modern),"text_errors":text_errors})
math_errors,math_warnings=mathcheck.collect_and_check([{"id":f"lesson.prose[{i}]","text":b["text"]} for i,b in enumerate(d["prose"])],lambda b:[("text",b["text"])])
errors+=math_errors
print(json.dumps({"lesson":d,"flow":flow,"coverage":coverage,"errors":errors,"math_errors":math_errors,"math_warnings":math_warnings},ensure_ascii=False))`,
  ], { input: JSON.stringify({ lesson: current, book: root, boundaryBlocks }), encoding: 'utf8' }));
  assert.deepEqual(result.errors, []);
  result.coverage.forEach(block => {
    assert.equal(block.normalized_math_signature_preserved, true);
    assert.equal(block.nonmath_number_signature_preserved, true);
  });
  for (const binding of unchanged) assert.deepEqual(await bind(binding.path), binding);
  assert.deepEqual(result.lesson.source, before.source);
  for (const key of Object.keys(before).filter(key => !['prose', 'section_breaks'].includes(key))) {
    assert.deepEqual(result.lesson[key], before[key]);
  }
  result.lesson.prose.forEach((block, index) => {
    for (const key of Object.keys(before.prose[index]).filter(key => !['text', 'changes'].includes(key))) {
      assert.deepEqual(block[key], before.prose[index][key]);
    }
    if (block.kind !== 'p') assert.deepEqual(block, before.prose[index]);
  });
  // Mechanical native layout normalization and adjacent anchors only.
  await fs.writeFile(templatePath, JSON.stringify(result.lesson, null, 2) + '\n');
  const report = {
    ticket: 'STEMROBIN-181', lesson: id, status: 'author-frozen-awaiting-independent-science-review',
    template: await bind(templatePath), source: sourceBinding, before: await bind(beforePath),
    authorHelper: await bind(`${work}/freeze-9p-n${number}-prose.mjs`),
    nativeCheckHelper: await bind(`${work}/freeze-9p-n50-prose.mjs`),
    sourceBlocks, normalizedParagraphs: result.flow.paragraphs.length,
    mathFragments: result.coverage.reduce((sum, block) => sum + block.math_fragments, 0),
    tasks: 0, figurePlaceholders: result.lesson.figures.map(figure => figure.id),
    boundaryCount: result.flow.boundaries.length, sectionBreaks: result.lesson.section_breaks,
    resolvedBoundaries: result.flow.boundaries,
    coverage: result.coverage.map(block => ({ ...block, topic: topics[block.index] || `Original ${block.kind} ${result.lesson.prose[block.index].id || result.lesson.prose[block.index].label} unchanged.` })),
    sourceSnapshotIdentityRefsAndOrderUnchanged: true,
    normalizedMathAndNonmathNumberSignaturesPreserved: true,
    sourceErrataAdded: [], sourceMathChanges: [], notationChanges,
    sourceRisksForMainSCI: risks,
    unresolvedSourceMathRisk: number === 50,
    unchangedBindings: unchanged,
    fullAuthoritativeTextSha256: hash([result.lesson.printed_title, ...result.lesson.prose.map(block => block.text)].join('\n\n')),
    nativeAuthorCheck: {
      status: 'pass',
      scope: 'One native author check for this card: normalize_lesson_layout; native adjacent prose_flow anchors; all source-bound validate_text signatures; source/errata binding; math parsing. A native pass is not SCI approval.',
      errors: result.errors, mathErrors: result.math_errors, mathWarnings: result.math_warnings,
    },
    figuresStatus: 'All original figure/caption placeholders and figure/exercise templates unchanged. No source-pixel review, figure context/spec/render work.',
    limits: 'Author-only normalized prose freeze. No repeated adapt-prepare, SCI self-approval, source edit/rereview, figure review/finalize, promotion, app/shared-tool/dependency/charter/DB/git/network/browser/other-chat action. Unapproved source mathematical risks are reported, never silently corrected.',
  };
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify({
    freeze: await bind(reportPath), template: report.template, source: report.source,
    sourceBlocks, normalizedParagraphs: report.normalizedParagraphs, mathFragments: report.mathFragments,
    boundaries: report.boundaryCount, tasks: 0, unresolvedSourceMathRisk: report.unresolvedSourceMathRisk,
    nativeAuthorCheck: report.nativeAuthorCheck, independentSCI: 'pending', figures: 'not-authored',
  }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await freezeProse({
    number: 50, expectedSourceSha: 'a3943b9999b0146e1c1b2921643da681b16b39c66428b3e9feae9906662599f2',
    sourceBlocks: 26, boundaryBlocks: [6, 7, 13, 17, 21],
    topics: {
      0: 'Basic tension/compression and shear distinguished from combined bending/torsion.',
      1: 'Uniform axial bar, absolute/relative length change, source DeltaL/Deltal mismatch explicitly identified without changing formula; reversible elastic scope not guaranteed solely by small strain.',
      6: 'Section internal force and mean axial stress F/S; small-area-change and uniform-stress conditions, stress distinct from prior surface-tension sigma.',
      7: 'Source grade8 Hooke reference and magnitude law retained; homogeneous constant-section uniaxial small-strain linear-elastic fixed-temperature scope.',
      8: 'Material/geometric stiffness, length and area trends, k=ES/l0; constant-section bar and no arbitrary bending application.',
      9: 'Young modulus is the single-axis elastic modulus used here.',
      10: 'Steel/aluminum source values and units retained, aluminum quantity explicitly not accepted as verified; source F/S/final-l comparison quoted while initial-length requirement stated.',
      11: 'Original equation6-3 into6-2 and6-4 relation, original symbols/order unchanged.',
      12: 'Original equation6-5 uses stress magnitude and absolute strain, not signed-positive compression.',
      13: 'Axial compression fig84 and equations6-1..6-5 within stable, uniform small-strain linear elasticity.',
      16: 'Transverse change/rubber-ring example; ordinary positive-Poisson isotropic free-side conditions and small-area-change approximation, not universal nor large-rubber Hooke claim.',
      17: 'Simple shear rubber-grid/top plate fig85a/b, parallel ab/cd layers and angle alpha preserved, finite rheology not assumed linear.',
      18: 'Both source1-times increases retained as approximate small-angle linear-elastic proportionality, not a general exact finite-angle rule.',
      21: 'Spring-connected parallel-board fig86a/b and shear-volume idealization; real small-strain first-order volume scope, beams/rivets/bolts fig87 retain combined-load qualification.',
    },
    notationChanges: [
      { target: '/prose/17/text', source_refs: ['p0126#8'], from: 'fig85 Cyrillic а/б', to: 'Latin a/b', method: 'Existing subfigure convention; all math points/alpha unchanged.' },
      { target: '/prose/21/text', source_refs: ['p0127#3'], from: 'fig86 Cyrillic а/б', to: 'Latin a/b', method: 'Existing subfigure convention.' },
    ],
    risks: [
      {
        target: '/prose/1/text', source_refs: ['p0124#7', 'p0125#5'],
        original: '$\\Delta L=l-l_0$ followed by $\\varepsilon=\\frac{\\Delta l}{l_0}$ and $\\Delta l\\ll l_0$',
        issue: 'Capital DeltaL versus lowercase Deltal is inconsistent within the source length-change notation.',
        disposition: 'All source math retained; prose makes the intended common physical length change explicit. Main approval and source-bound erratum are required before any formula-symbol replacement.',
      },
      {
        target: '/prose/10/text', source_refs: ['p0126#1'],
        original: '$E=7\\times10^7$ 牛顿/米$^2$',
        issue: 'Main-provided risk context is approximately70GPa for aluminum versus this70MPa source value, a factor1000 discrepancy. This author has not performed external material validation.',
        prospectiveCorrectionForMainOnly: '$E=7\\times10^{10}$ 牛顿/米$^2$',
        disposition: 'Not substituted or accepted as a reliable modern constant. Original value remains explicitly source-attributed and questioned; main must confirm/register a source-bound erratum before correction.',
      },
      {
        target: '/prose/10/text', source_refs: ['p0126#1'],
        original: '相同($F$、$S$、$l$ 相同)',
        issue: 'Source l was defined as final length; the stiffness comparison using k=ES/l0 requires a fixed initial length.',
        disposition: 'All tokens/order preserved; initial-length condition is clarified in prose while original final-l comparison remains quoted. No silent l->l0 change.',
      },
    ],
  });
}
