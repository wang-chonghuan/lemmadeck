# Independent Modern Text Review: phy6-c3-s32

2026-11-15. STEMROBIN-180. **PASS: current frozen s32 text, all9 blocks/all2 original tasks.** Independent substantive text comparison once; no author self-approval, figure approval, adapt-finalize or whole-lesson approval.

## Scope and Frozen Inputs

Read the actual s32 `author-handoff.json` and `author-notes.md` to identify the frozen candidate, then independently read complete approved raw lesson/exercises and every modern block/task. Author checks were not rerun or substituted for this review. No s31/s33 text, answers, choices, figure90/91 output or source pixels were reviewed.

Authoritative approved raw:

`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/approved-through-120/artifacts/6p/lessons/phy6-c3-s32/`

Candidate:

`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c3-s31-s33/adapt/6p/modern-us-neutral/lessons/phy6-c3-s32/`

Read-only byte comparison confirms both approved raw JSON files equal their already-promoted durable counterparts under `ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c3-s32/`. No reassembly or source-page approval was repeated.

| File | Actual byte SHA-256 |
| --- | --- |
| [lesson.template.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c3-s31-s33/adapt/6p/modern-us-neutral/lessons/phy6-c3-s32/lesson.template.json) | `3c0705f0dd1ce7ead275356b2a51ead00d3dd91dd23156922c594247e764b9b9` |
| [exercises.template.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c3-s31-s33/adapt/6p/modern-us-neutral/lessons/phy6-c3-s32/exercises.template.json) | `e01cf9c570ae8a6b58ca1fdb78162ad9acfc1b4397cf90a3f25304f13ed75e8b` |
| Approved raw and durable `lesson.json` | `b2aa2ea7aa3ab6a16a988d6489450d5ea0c04dac79f101ae2727d9235d98f81f` |
| Approved raw and durable `exercises.json` | `f34b67f16496049188ecf8861822ad033fa78f95b05970e6331f0c079c1554aa` |
| `author-handoff.json` | `2e439f377d3b59899911aceb6df78b23afe7fb5ceb316984ab41bdd765ff16fb` |
| `author-notes.md` | `79e93c94b50fc51807d5ba087020280ae20912c45f514164548971616e9ffabc` |

The complete embedded `source.data`, source paths and hashes match the approved raw, not another lesson or an answer-derived rewrite. Lesson/card identity `phy6-c3-s32`, chapter `运动和力`, printed section46/title `气体的压强`, start physical112/printed101, figure IDs/order and exercise count2 are unchanged. All block kinds, labels, IDs, printed pages and ordered source references are preserved. Each `source_text` exactly equals its approved raw counterpart.

Actual counts: 9 blocks =5 `p` +2 `fig` +2 `cap`; 2 original open-response tasks. Final normalized prose has10 paragraphs, a distinct count from source blocks.

## Complete Block Comparison

Indices are zero-based source/modern block indices.

| Block | Source references | Independent finding |
| --- | --- | --- |
| 0 `p` | p0112#7 | PASS: gas filling its container, examples gas bottle/car inner tube/volleyball, and gas pressure on contacting container walls are retained. Streamlining the wall examples does not remove the lesson's containment/pressure concept or claim gases act only downward. |
| 1 `p` | p0112#8, p0113#1 | PASS: tied balloon with little internal air, initial non-spherical state, bell jar/pump, progressively rarer surrounding air and expanded spherical state all retained across the source boundary. Explicitly pumping the air outside the balloon clarifies the existing setup rather than reversing it. Figure90 source Cyrillic a/b roles become Latin a/b in the same order. |
| 2 `fig` | p0112#9 | PASS text identity: figure90, label and page retained; no visual approval implied. |
| 3 `cap` | p0112#10 | PASS: full figure90 caption retained. |
| 4 `p` | p0113#2, p0113#5 | PASS: explanation prompt, rapid random molecular motion, mutual and wall collisions, large molecular population, normal/uncompressed-air context,1second/1square-centimetre collision example, twenty-three-digit count, and millet/nearest-star/hundred-round-trip analogy all retained. No cross-figure continuation omitted. |
| 5 `fig` | p0113#3 | PASS text identity: figure91, label and page retained; no visual approval implied. |
| 6 `cap` | p0113#4 | PASS: full figure91 caption retained. |
| 7 `p` | p0113#6 | PASS: weak individual impacts versus significant aggregate action retained; the clarification links average wall-normal force per unit area to pressure rather than treating raw collision count or total force alone as pressure. |
| 8 `p` | p0113#7 | PASS: internal/external impacts, decreasing external gas, unchanged sealed internal molecular total, expansion and membrane balance, spherical-shape illustration, directional equality and its random-motion explanation are all present. Added conditions prevent fixed molecular total being mistaken for fixed density/pressure or internal pressure alone being balanced against the membrane. |

No figure source was substituted, regenerated or approved. The text retains both figure90 stages and figure91's collision reference. The rejected figure83 issue is not bypassed by a figure claim in this report; s32 is reviewed on its own approved source/text identity.

## Substantive Clarifications and Limits

The full gas-pressure mechanism survives: moving molecules collide with walls; averaging the combined normal force over wall area gives pressure. The added unit-area/average language is explanatory, not a changed formula, unit or numeric exercise answer.

For the bell-jar experiment, the candidate correctly distinguishes the external gas from gas trapped in the tied balloon. The nonleaking condition supports fixed internal molecular total. At the early stage before appreciable expansion, lowered external pressure increases the pressure difference; during subsequent expansion internal density/pressure can change. It does not silently assume fixed internal pressure just because molecule count is fixed.

Final balance is stated as internal/external gas-pressure forces opposed by membrane elasticity. Read in this membrane context, it concerns local normal loading/pressure difference and elastic response, not a claim that the globally summed vector force over a closed spherical balloon alone determines its radius. No pressure-radius law, vacuum endpoint or numeric result is invented.

The candidate retains the spherical balloon as the source's qualitative demonstration, conditioned on approximately uniform membrane properties and static gas equilibrium. It does not supply a general proof that every balloon shape must be spherical under all loading or gravitational/material conditions. The final emphasized statement explicitly concerns isotropic pressure **at the same position in static equilibrium**, not equality at all heights or in a moving gas. Replacing equal collision counts with equal average collision action preserves the relevant mechanism without conflating counts and transferred momentum.

The original1second and1square-centimetre expressions remain exact mathematical substrings; `厘米$^2$` remains area, not length. The twenty-three-digit count and hundred round trips are preserved in words, not replaced with a made-up scientific dataset, chosen exact integer, grain size or stellar distance. The analogy remains expressly illustrative. All figure numbers/digit tokens and existing numeric signatures match source; no hidden number change requires a fabricated `numeric_changes` declaration.

Modern transformations are declared `wording`, `clarification`, `enumeration` and/or `layout` at the corresponding blocks. The source emphasis's fragmented delimiters are consolidated without changing the final random-motion principle. No fictional names, currency, Soviet institution or modern geographic data were inserted. All modern text passes the current profile forbidden-term/person-name and Cyrillic scan; `numeric_changes`, `historical_entities` and `errata` remain empty.

## Both Original Tasks

| Stable/printed ID | Source identity | Independent finding |
| --- | --- | --- |
| 1 /1 | `g1`, `问题`, p0114#2 | PASS: still asks how to demonstrate experimentally that gas exerts pressure on container walls. Shorter wording preserves the experimental action and target claim; no answer or apparatus result is supplied in the prompt. |
| 2 /2 | `g1`, `问题`, p0114#3 | PASS: still asks for evidence of equal pressure in different directions. “从什么实验现象” makes the existing experiment/observation demand explicit; static-equilibrium qualification avoids overgeneralizing the original statement. It does not replace the evidence request with a yes/no definition or disclose which observation to cite. |

Both `number`, `source_number`, group and source pages remain intact. Empty source exercise figure refs/display figures remain empty; prose-owned figures are not fabricated as exercise attachments. Modern `lines` equal the complete prompt's `splitlines()`, while embedded source snapshots preserve the original visual-line wraps. No question, subclause, unit or open-response ability is removed or converted to scalar auto-grading.

## Actual Shared-Normalizer Anchors

In the existing shared project Python runtime, with `PYTHONDONTWRITEBYTECODE=1` and `-B`, imported this checkout's actual `edition` module. No browser was required.

1. Deep-copied the frozen candidate and called `edition.normalize_lesson_layout` in memory.
2. Called `edition.prose_flow_contract(normalized.prose, [])` to obtain the actual anchor-free outline through the existing `prose_flow.mjs --stdin`/`htmlfrag.js`.
3. Parsed that same normalized prose with current anchors. Required no errors, identical outlines and exactly one matching adjacent paragraph pair per anchor.
4. Confirmed the frozen candidate is already normalized, repeated normalization is idempotent, and each final paragraph has balanced emphasis with no standalone `**`.

The actual outline contains10 paragraphs. Current `section_breaks` resolve uniquely to `[3,7]`:

| Boundary | Actual adjacent paragraphs | Conceptual transition |
| --- | --- | --- |
| 3 | 2→3 | Completed pump/balloon observation → random-motion/collision explanation. |
| 7 | 6→7 | Completed aggregate collision/pressure explanation → applying internal/external impacts to the balloon. |

These are parsed final paragraph indices, not source-block or blank-line counts. Exact resolved anchors:

```json
[
  {
    "index": 3,
    "before": "开动抽气机，抽走钟形罩内、气球外的空气。\n随着周围的空气越来越稀薄，气球逐渐鼓起来，成为球形（图 90，b）。",
    "after": "怎样解释这个实验呢？\n气体分子以很大的速度做无规则运动。\n运动中，分子相互碰撞，也不断撞击容器壁（图 91）。"
  },
  {
    "index": 7,
    "before": "单个分子撞击器壁的作用很微弱，但大量分子不断撞击器壁，合起来的作用就很显著。\n器壁单位面积所受到的这种平均压力，表现为气体的压强。",
    "after": "在上面的实验中，空气分子不断从气球内外撞击气球壁。\n抽气使钟形罩内、气球外的空气分子逐渐减少，外部压强减小；\n扎住口、不漏气的气球内，分子总数却不变。"
  }
]
```

Both `after` anchors include the actual third sentence. No abbreviated two-sentence anchor or orphan delimiter remains.

## Preserved First Rejection and Sole Body Repair

The author first bold-layout rejection remains at:

`.tmp/ld-s10y-lesson/text-author-c3-s31-s33/failure-01-s32-bold-layout/`

| Preserved file | Actual byte SHA-256 |
| --- | --- |
| Rejected `lesson.template.json` | `ccf182a1f33302adef4bdc4877a9bb6ddf3b51be9531012dd4d02c220dbb4fc7` |
| `first-failure.md` | `d1386b60294cbfa2c1045e11823b64eac4dadd0a329f04edc6c5c5dd66836dc1` |

Actual structured comparison shows the sole changed body unit is `/prose/8/text`: the ending `结果。\n\n**` becomes `结果**。`. The closing bold delimiter now precedes terminal punctuation; physical meaning, formulas, numbers, tasks and source snapshots are unchanged by that repair. The failed snapshot also had `section_breaks:[]`; the final candidate separately contains the two completed actual-flow anchors above. No other JSON field differs between those full lesson snapshots.

The first read-only reviewer diagnostic exited1 because its final assertion incorrectly expected only one changed JSON field; it had already successfully checked source bindings, counts, formulas/numbers, current normalization, anchor uniqueness and repaired emphasis. The actual diff exposed the additional final anchor field. A targeted diff-only follow-up confirmed exactly the body delimiter repair plus two final anchors, with no artifact edits or repeated substantive review. This diagnostic assumption failure is not concealed as a content FAIL or used to weaken the text criteria.

Repair consumption remains1/1 for the author's bold-layout unit. This reviewer neither repairs it again nor removes/overwrites the first rejected bytes. The current candidate has no essential remaining defect; no new first FAIL or REVISE unit is invented.

## Closure

**s32 modern TEXT PASS, all9 source blocks/all2 original tasks and both actual normalized anchors covered.** The four source/template byte bindings above define the approved text snapshot for subsequent figure context. Figures90/91 remain separately owned and unapproved by this report; text PASS is not whole-lesson readiness.

Only this report is written. No s31/s33, prior s27/s28 text or batch6 answer review; no source-page pixel check, answer/key/choice read, author edit, figure action, adapt-finalize, promotion/publication, browser/app/DB/Git/dependency/charter/service action. Stop at this report.
