# phy6-c4-s10 Text Author Freeze

Status: **FROZEN FOR INDEPENDENT REVIEW / FIGURE AUTHORING**, not independent approval.
Role: text author only. All changes and evidence are under this s10 scratch root.

## Inputs and Frozen Candidates

Full raw `lesson.json`, `lesson.md`, and `exercises.json` were read before authoring.
Official `adapt-prepare` succeeded once using the existing project Python environment;
two earlier import failures occurred before preparation and are retained in
`prepare-attempts.json`. No dependencies or stable tools were installed or changed.

| File | Actual byte SHA-256 |
| --- | --- |
| raw lesson.json | `619917c49345fe391f3eea68fcae42629db04153cdfc018dbbb9f4a1f1dc46b4` |
| raw lesson.md | `f91bfa85aaa47078176d7851e2c13cbd1927f83de55de0ef43ddaf52f61e1205` |
| raw exercises.json | `c76895cc4783a11a3172fdc63a48baaf9657a72fe25166f081f3141f1a173d2a` |
| candidate lesson.template.json | `e95a07bf87a15a40221320ed95cac25703eb19d375b9c2ebf3be16a33f3cb24d` |
| candidate exercises.template.json | `0be321f8378b3fa1e0f6715d60a73c81d3384fc605e25be5049bb5b160141e35` |
| untouched prepared figures.template.json | `28f4b56f321c8b4a5625af49457786dcdd3dcd97970ddb1056e3f18dd43ef11a` |

Candidate directory:
`.tmp/ld-s10y-lesson/text-author-c4-s10/adapt/6p/modern-us-neutral/lessons/phy6-c4-s10`.
Its `author-handoff.json` binds the complete modern templates and evidence.
`text-bindings.json` contains every modern block and prompt with its original references
and independent text-byte hashes, for complete figure-author context rather than excerpts.

## Preserved Content

The 7 raw blocks remain 5 prose blocks, 1 figure block and 1 caption; all 7 original tasks
remain in their original order and groups. Source snapshots, source_text, identities,
source_refs/pages, original math and numbers, figure references and ownership are unchanged.

| Unit | Source binding | Modern scope / preserved task |
| --- | --- | --- |
| prose 0 | p0148#8 | Gas molecules are attracted by Earth. |
| prose 1 | p0148#9 | Unceasing random motion, gravity, `11.2` km/s and *第二宇宙速度*; average speed and predominant-molecule qualification. |
| prose 2 | p0148#10 + p0149#1 | Atmosphere maintained near Earth by molecular motion and gravity in the lesson's simplified description. |
| prose 3 | p0149#2 | Exact `$5.4$`, `$\frac{1}{2}$`, `$11$`, `$\frac{1}{4}$`; decreasing density, gradual upper transition and no sharp boundary; fig142. |
| prose 4 | p0149#3 + p0149#6 | Static gas under gravity: lower density/pressure greater; many small-container differences negligible, atmospheric differences important. |
| prose 5 / 6 | p0149#4 / #5 | Original fig142 identity and caption unchanged. |
| g1:1 | p0149#8 | Explain why molecules do not all fall to the surface. |
| g1:2 | p0149#9 | Explain why predominant molecules remain near Earth despite random motion. |
| g1:3 | p0149#10 | Atmospheric density versus height. |
| g2:g2-1 | p0150#2 | Fig143 pipette: insertion, finger closure, lifting, opening; perform the experiment and explain. |
| g2:g2-2 | p0150#9 | Fig144 rubber-bulb dropper: perform dripping experiment and explain. |
| g2:g2-3 | p0150#10 | Physical phenomenon in filling a fountain pen. |
| g2:4 | p0150#11 | Fig145 inverted bottle/trough and submerged mouth; explain stable no-flow, renewed flow when exposed, and stopping again. Stable internal number remains `4`. |

## Modernization Boundaries

Punctuation and sentence/short-paragraph layout are modernized, with no new numerical data
or mathematical correction. `11.2` is explicitly the textbook's idealized near-surface,
gravity-only comparison; it is not an assertion of one universal escape threshold at any
height. The average-speed argument retains **绝大多数**, not an absolute ban on escape.
Density ratios and the upper atmosphere account are explicitly textbook approximations,
not newly verified universal measurements. The small-container comparison retains
“许多情况下” and is scoped to the lesson's static-gas/gravity model.

The waterer adds only “在装置稳定后” to distinguish the stated stable condition from a
placement transient; all three explanations remain requested. Experimental performance
and open explanations are retained, not replaced with answers. No historical identity,
answer key, choice, source solution, interaction or author-answer material was read.

## Actual Mechanics and Limits

One text-only mechanics batch: **exit 0, 100 checks PASS, 0 errors**.
Existing `validate_source`, identity/text/subpart/figure-reference helpers and KaTeX were
used; 5 source-preserved formula spans passed. This is mechanical evidence, not self-review.
Discovery `prose_flow.mjs` ran once after normalization; 9 actual text paragraphs.
Two exact tool-reported adjacent anchors were copied; shared-parser verification resolved
them at boundaries 5 and 7. No hand-counted anchor or second discovery loop.

Evidence: `text-mechanics.json` SHA `75c6956485d03e63f4b595feb97bcc64a3b135ae3ed9b6884a0d240e3edd176e`;
`text-bindings.json` SHA `c71d6c6a5ab62e0dd661338ba566868b966e094e0bf55f9fc3c2e78475bc4da3`.
Commands, normalization hashes, prepared snapshots, CLI output and final parser output
are retained beside them. The mechanics batch did not rewrite candidate files.

Original figure PNG/SVG hashes were checked against prepared bindings, but no original
figure pixels or modern figure outputs were visually reviewed in this TEXT task.
Fig142 belongs to prose; fig143, fig144 and fig145 belong to their respective exercises.
Their apparatus/object inventories and full rendered fidelity require the separate figure
authors and independent reviewers. No figure, full-lesson or publication PASS is claimed.

No adapt-finalize, source/edition edits, DB, Git, browser, network or model-service calls.
Only this scratch candidate, preparation snapshots, author scripts and evidence were written.
Exact model deployment, reasoning setting, tokens and cost are unknown; no usage meter was
available. Figure121/122 freezes were not reopened or rerendered.

After this freeze, s10 templates remain unchanged. Main may dispatch142–145 from this
complete context. Fig123/124 authorship waits for main's exact frozen sea-context path;
s10 choice authorship is not started.
