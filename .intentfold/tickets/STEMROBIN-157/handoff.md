# Handoff

## What changed

- Added one shared lexical exact-answer matcher that canonicalizes MathLive LaTeX before comparison,
  and routed textbook `exact` judging through it without changing numeric or expression semantics.
- Added a real-MathLive contract checker to answer finalization, with reusable positive and negative
  cases. Mechanically valid `exact` interactions no longer receive a misleading `needsAuthoring`.
- Made `htmlfrag.js` the canonical prose-flow and section-boundary implementation. New edition
  templates use semantic `{before, after}` anchors, and Python validation calls the same JavaScript
  path used by rendering and publishing.
- Added page-level mathematical errata metadata and propagated source references through assembly.
  Edition preparation binds each correction to the source page, page JSON hash, block, original
  expression, and target; finalization permits only that registered correction.
- Replaced the obsolete absolute formula-change prohibition in both lesson and answer skill
  instructions, gates, tools, examples, and tests. Existing edition snapshots remain compatible
  when their only difference is the newly added `source_refs` field.

## AC results

1. **MathLive exact answers: passed.**
   - Headed Chromium instantiated the real MathLive component for all six required forms:
     `\text{是}`, `\pm\frac{2}{5}`, `x\ne\frac12`, `\mathbb{R}`,
     `\left\{1,2,3,6\right\}`, and `\pm6`.
   - All six emitted values matched their existing exact answer sets, and all six paired wrong
     inputs were rejected. Report:
     `.intentfold/tickets/STEMROBIN-157/tmp/mathlive-report.json`.
   - The 99-test app suite also passed the existing numeric and expression equivalence controls.

2. **Faithful source and bound correction: passed.**
   - A retained synthetic PDF was rebuilt through page finalization, assembly, edition preparation,
     edition finalization, answer preparation, and answer finalization.
   - The faithful lesson retained `$1+1=3$`, its `p0001#2` source reference, and the page-level
     concern. The modern lesson changed only the registered expression to `$1+1=2$`.
   - `adaptation.audit.json` passed with one erratum, no errors, and the semantic boundary resolved
     between the complete three-line derivation paragraph and the corrected paragraph.

3. **Mechanical rejection: passed.**
   - Seven isolated negative cases were rejected: missing erratum, unregistered formula change,
     unchanged propagation of the known error, wrong page, stale page hash, original-expression
     mismatch, and incorrect semantic boundary.
   - The same script restored and revalidated the positive edition afterward. Report:
     `.intentfold/tickets/STEMROBIN-157/tmp/sample-negative-report.json`.
   - Focused content suites passed: 66 lesson-tool Python tests, the JavaScript `htmlfrag` test, and
     14 answer-tool Python tests.

4. **Product and repository: passed.**
   - Mechanical defence passed:
     `python3 ssot-resources/audit.py`;
     `python3 ssot-resources/soviet10year-textbooks/validate.py`
     (16 PDFs, 17 catalog volumes, 510 lessons, 407 figure records);
     `cd app && npm run test && npm run build`.
   - Headed browser checks passed at `1440x960` and `390x844`. Four real MathLive fields submitted
     successfully at each viewport; initial responses contained no `answerKey`, `displayAnswer`,
     `expected`, or known standard-answer text. There were no console/page errors or horizontal
     overflow. Evidence:
     `.intentfold/tickets/STEMROBIN-157/tmp/browser/`.

## Deviations

No scope deviation. Two compatibility paths were retained deliberately: existing numeric
`section_breaks` remain readable while new templates author semantic anchors, and old edition
snapshots missing only newly assembled `source_refs` remain valid.

## Environment

- Local app: `http://localhost:52157`
- Environment keys added, changed, or removed: none
- No dependency, database schema, production data, Charter, deployment configuration, merge,
  publication, deployment, or ticket closure was performed.

## Residual

- STEMROBIN-151 still needs to consume this shared fix when it performs its final two-lesson
  generation and real answer-chain verification. Its content artifacts remain outside this ticket.
