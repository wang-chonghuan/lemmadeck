# n112 ANSWER SOURCE independent solutions, b98

- Workdir for every command: `/Users/yong/.codex/worktrees/stemrobin-180-six/lemmadeck`.
- Frozen question authority: `n112-text-author/{lesson,exercises,figures}.template.json`; supplied manifest SHA-256 `acec8b35104e3579f1deca7198a9d7f9b9cb1089611121965c6785b420c934a5`, all 9 current bindings verified.
- Result: **PASS for independent ANSWER SOURCE solving only**, 2 original tasks, q1's 4 definition facets and q2's 3 report facets covered, **0 HOLD facets**.
- No author answer, CHOICE author key/internal material, old interactions, old question package or old reviewer was consulted. No comparison with a canonical/author answer took place.

## Identity and grading

| Task | Source identity | Independent content | Recommendation |
| --- | --- | --- | --- |
| q1 | explicit `source_number=q1`, `g1`, `p0285#13` | Useful work divided by total energy released by complete fuel combustion; numerator/denominator order, percent convention and dimensionless ratio all stated, with a readable formula. | `ungraded`: this is a determinate definition, **not** an open report, but the current deterministic judges cannot reliably judge arbitrary correct prose. |
| q2 | internal `q2`, `source_number=null`, `g2`, `p0286#2` | One original report task containing 3 topics. Each has a substantive reference narrative, verified historical milestones/technical examples and source bindings. | `ungraded`, `openEnded=true`: reference reports may choose other documented examples; not a unique string or numeric answer. |

`independent-solutions.json` uses the existing lesson-answer shape (`answers`, `grading`, `source=derived`, `displayAnswer`, `parts`) with independent-review/facet/source metadata. It is deliberately not a published canonical key. `parts=[]` for both ungraded items; there is no invented automatic grading key or borrowed `bookRaw`. q2 has a complete report reference, not merely advice to research, an empty outline, or three new exercises.

## Substantive coverage and primary evidence

The complete reference answers are in:

`/Users/yong/.codex/worktrees/stemrobin-180-six/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6/n112-independent/independent-solutions.json`

q2 topic (1) describes the 1712 Newcomen engine near Dudley, its steam-condensation/partial-vacuum/atmospheric-pressure pumping mechanism, and Watt's 1763–1765 model research leading to a separate condenser. It distinguishes first-machine dates from the 1791 surviving museum engine and the 2010–2011 replica. Reduction of repeated cylinder cooling is explicitly a physical explanation derived from those mechanisms, not an invented historical date or efficiency measurement. It does not claim Watt invented all steam engines from nothing, or invent an unverified patent year.

q2 topic (2) describes Parsons' 1884 multistage turbine-generator prototype, the museum's specific 18000 rpm figure, De Laval's **1889 expanding-orifice** development and impulse-wheel route, and Parsons' **1894 Turbinia** application. The date for the De Laval detail is the actually verified 1889 claim; an unverified 1883 shorthand is not substituted. Prototype speed is not presented as universal speed or thermal efficiency. The narrative does not claim one inventor created all turbine forms.

q2 topic (3) uses the official LMZ museum's Soviet-period manufacturing examples: **1924, own-design 2 MW steam turbine; 1934, 1500 kW turbines for the Kayseri textile works in Turkey; 1938, 100 MW high-speed steam turbine, exhibition model designation AK-100-1, for Stalinogorsk station**. It explains design/manufacturing/export/unit-capacity development, distinguishes power from efficiency and steam turbines from hydraulic turbines, and keeps the original Soviet technical-history scope. It omits political praise, world/European rankings, modern market shares, and post-Soviet equipment as substitutes for Soviet evidence.

Primary webpages were actually read with `cloak-fetch`; all five supporting pages returned **HTTP 200**. The corresponding raw stdout and command metadata are retained under the independent directory's `commands/`:

| ID | Official primary page | Retained observation |
| --- | --- | --- |
| H1 | Science Museum Group, [Newcomen Atmospheric Engine](https://collection.sciencemuseumgroup.org.uk/objects/co50900/newcomen-atmospheric-engine) | `primary-newcomen-engine.stdout.txt`, lines 25 and 27: mechanism and 1712 near Dudley. |
| H2 | Science Museum Group, [Replica of model of Newcomen engine](https://collection.sciencemuseumgroup.org.uk/objects/co8231705/replica-of-model-of-newcomen-engine) | `primary-watt-condenser.stdout.txt`, line 21: study in 1763–1765 leading to separate condenser; replica chronology is distinct. |
| H3 | Science Museum Group, [Parsons' steam turbine generator, 1884](https://collection.sciencemuseumgroup.org.uk/objects/co51109/parsons-steam-turbine-generator-1884) | `primary-parsons-generator.stdout.txt`, lines 17 and 27: 1884 prototype, stages, 18000 rpm and 1894 Turbinia. |
| H4 | Science Museum Group, [De Laval's patent steam turbine](https://collection.sciencemuseumgroup.org.uk/objects/co51110/de-lavals-patent-steam-turbine) | `primary-laval-turbine.stdout.txt`, line 21: 1889 expanding-orifice and impulse-turbine development. |
| H5 | Power Machines official museum, [LMZ historical exhibition](https://museum.power-m.ru/ehkspozicii/2017/165-let-leningradskomu-metallicheskomu-zavodu/) | `primary-lmz-exhibition.stdout.txt`, lines 78, 81, 89, 91–92: 1924/1934/1938 steam-turbine examples. Manufacturer museum statements about its own records are used; its rankings and political language are not. |

The original definition/percent convention is bound to approved source lesson `prose[1–2]`, `p0285#10–11`, SHA-256 `640b7b76ea92233d926ea9214d7713f866d41b25bf7df55ed8501e687b0675bf`. No original source-page image was reread.

## Actual command result

Executed in the workdir above:

```text
node .intentfold/tickets/STEMROBIN-180/tmp/resume-180-6/n112-independent/capture.cjs answer-source-final-check node .intentfold/tickets/STEMROBIN-180/tmp/resume-180-6/n112-independent/validate-solutions.cjs answer-source-structure-final-result.json
```

Exit **0**; **20 exact line/token assertions passed across 5 primary sources**; **7/7 specified facets covered**, **2/2 original tasks independently solved**; shared fragment math errors **0**, final stderr **0 bytes**; browser DISPLAY checks **0**, canonical finalize **false**. The token assertions bind the already-read and semantically reviewed primary passages to reproducible evidence; they are not used as a substitute for historical reasoning.

The first answer check also exited 0 but produced 8 KaTeX `unicodeTextInMathMode` warnings for Chinese subscripts in the reviewer's own `\mathrm{...}` notation. Its stdout, stderr and initial structure result remain intact. The independent reference answer was changed to `\text{...}` and the final check ran cleanly; no author candidate or shared helper was edited. Treat `answer-source-structure-final-result.json` as the current result, not the retained pre-repair result.

One guessed Science Museum story URL returned **404** and is retained as non-evidence. The manufacturer's old `/company/history/` path returned the homepage; it is discovery/non-evidence, not a milestone source. Search snippets were never used as historical authority. No genuine quota/HTTP 429/seat-busy failure occurred, and no retries or paid-service calls were made. Each `cloak-fetch` process completed and closed its browser; there was no browser DISPLAY session or screenshot.

## Boundary and inventory

The independent directory's `manifest.json` inventories explicit input files and all payload output paths with bytes/SHA-256 and is mode **0444**. Its own non-self-referential integrity binding is `manifest.sha256` and the final reported digest. Both durable reports are also bound as outputs in that manifest.

This PASS is neither an original-page SOURCE285/286 review nor a TEXT/CHOICE/DISPLAY/interaction/canonical-answer approval. No canonical finalize, author comparison, full-project check, DB connection/write, merge, push, deployment, new worktree/chat, peer message or descendant was performed. This session stops after the requested stage and awaits the caller's next instruction for this same reviewer; it does not prefetch another stage.
