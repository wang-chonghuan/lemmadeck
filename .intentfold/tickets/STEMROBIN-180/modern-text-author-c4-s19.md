# phy6-c4-s19 Modern TEXT Author Freeze

Complete author-only candidate, pending independent full TEXT review. No
self-review approval, modern figure approval, safety certification, adapt-finalize,
durable promotion, answer or choice authoring.

## Exact Frozen Files

Root `.tmp/ld-s10y-lesson/text-author-c4-s19`.

- `author-handoff.json`: `ccc5371642afaf8a068daee6f54aca53102822aea081cd30a137b36e484523ee`
- `frozen-manifest.json`: `7bdce139a2e84669dc55346635c8d43031067f2a8aaacd085e55830f3fd95c79`
- Complete `author-context.json`: `ea2c53305ba10d26a1f528f8f3e1dfae5d81c5f99b76d09bf1bb2b7c01ee96f2`
- Complete readable `author-context.md` and per-target `author-change-log.json`
  are hash-bound in the manifest.
- Candidate: `adapt/6p/modern-us-neutral/lessons/phy6-c4-s19`
- `lesson.template.json`: `35d874c6da6b4de3eb10f1bb61994c6aabaf018ce8c89a8c287ccc231b72d90b`
- `exercises.template.json`: `89f494c88d4241376dabd8573d346f965664c07b35717d9a58736b2f63e30860`
- `figures.template.json`: `a1374ff1a9878a1be28f1636fc3de9598986de69ad5e644d583df7f786b2be8f`

Counts:6 original/modern prose blocks,7 original/modern task objects
(g1:4; g2:2; g3:1 unnumbered `q1` with both original numbered subparts),1 original
figure172 template,9 actual final prose-flow paragraphs,2 adjacent-text anchors.
No blank task, invented question, deleted practical task, answer or observed data.

## Complete Source Context

Read full approved raw lesson.json, lesson.md, exercises.json; full modern
candidate and metadata. Original172 PNG was actually opened for text semantics
only, not a source re-review or modern figure gate. It shows two different
hydrometers in water, each with1000 at the waterline, distinct stem/ballast
positions and original а/б panel identities. Modern q1 maps а/б to a/b only,
preserving both instruments' roles,1000, original formula bytes and both
principle/construction subparts. No extra scale unit or calibration was inferred.

Raw bindings:
- lesson.json `9d156964051e64d7133df84c80ad5577041e37ddcb2e88162c9849b7161cca6d`
- lesson.md `5ec759641269bf6172d1662bea141491dd70404d5597f77d2e20b6474505c74d`
- exercises.json `155f6cba8bcf866e58c91db6b26675882d6b3177cc85c32c2de5a167b107920c`
- Original172 PNG `fdef541571f3896f5e099b0c14a08086d7895347aaf7e8fc1ef0e451669055c8`
- Original172 SVG `4a579e03217dcc96bb5d17e3d0318088fb53c7f21c9c33720a99f80e3507bb9d`

All source snapshots, block refs, printed/title identity, task numbers,
source_number, groups, pages and figure ownership remain unchanged.

## Explicit Authorial Limitations

Preserved steel hull, metal supports, dozens of constituent materials and both
density categories; retained the original explanatory question. Static floating
and negligible air buoyancy qualify the source's air-weight/total-gravity relation.
Source section reference remains `§65`, displayed as `前一节（§65）`.

Draft depth, red maximum-permitted loadline and the source's displacement definition
remain. **Displacement here is the WEIGHT of water displaced at the maximum
permitted loadline, not volume or tonne mass.** It is marked as the textbook's
definition, not silently replaced by modern maritime terminology/regulations.

5000000千牛顿 and500000吨 both remain exactly. Original “now being built” is
explicitly textbook-time narrative, not a current shipbuilding claim. The added
declared model explanation is that each kilogram has approximately ten newtons
of weight (`g` approximately10N/kg), explaining only that paragraph's rounded
equality. No9.8 substitution or source-data change.

g2-2 retains100000千牛顿 and asks displaced water volume; only static-floating
condition is added. **Water density and `g` are still unspecified in that prompt.**
The prose example is not silently promoted into given question data; later
independent answer authoring must distinguish missing conditions from stated ones.
g2-1 adds constant ship/load total gravity for the original river-to-sea comparison,
without giving its direction or answer.

Culture rewrite is openly a generic scene, not purported US/current fact:
the source region/regime and five named seas map to “某地区/五个海域”.
Navigability, multi-canal five-sea connection, international trade, relatively
cheap freight and developing inland/ocean fleets remain. Exact mapping and scope
are in `author-change-log.json` and handoff declarations; no historical exemption
or new geographical fact is claimed. Independent reviewer must judge this
explicit cultural adaptation, not treat it as unchanged source text.

## Calls and Preserved Failures

Every exact argv, exit and stdout/stderr hash is in `evidence/*.call.json`.
Shared Python used with `PYTHONDONTWRITEBYTECODE=1` and `-B`.

1. Official `p2c.py adapt-prepare --book 6p --edition modern-us-neutral
   --lesson phy6-c4-s19 --root ssot-resources/soviet10year-textbooks/artifacts
   --work .tmp/ld-s10y-lesson/text-author-c4-s19`: exit0. `--books` left default.
   Untouched initial templates preserved in isolated `prepared-01`.
2. Structured author overlay and canonical lesson/exercise normalization: exit0.
3. Actual `prose_flow.mjs` once: exit0; exact adjacent boundary objects copied.
4. One full text-only mechanics check: exit1, exactly one error,
   `lesson.prose[2] 的非公式数字变化未被准确声明: want=['65'], got=[]`.
   No other errors or KaTeX warnings. First full report SHA
   `3a43d497ce4a18baf95cb654f2c9fd646ac144b11fff4d20a69d8fae276a36dc`.
   Rejected MD-equivalent template JSONs/report and pre-repair author helper are
   preserved under `first-failure`.
5. First affected reference attempt (`第65节` to unparenthesized `§65`): exit1,
   same error. This command, stderr and helper snapshot remain immutable.
   Initial causal interpretation was corrected after reading the actual NUMBER
   regex: Chinese-adjacent digits are not standalone numeric tokens.
6. Final narrow reference spelling `前一节（§65）`: canonical
   `edition.validate_text` affected-only exit0. Structured comparison proves
   lesson.prose[2]'s reference spelling is the sole delta from rejected candidate;
   exercise/figure bytes and all source snapshots unchanged. Both source and
   modern numeric signatures retain65.
   `affected-reference-repair.json` SHA
   `d92246d69bf1adc1abee4dddfddd353a9adee84b39e42b725276c2adcabf6054`.

Full mechanics was run exactly once and **not rerun**. No final full-gate PASS
is claimed; final reference encoding has affected-only PASS and complete
hash-bound context for independent review. No fake data, numeric change declaration,
counter patch, source edit, stable skill/tool change or bypass.

No modern172 drawing was started. Source approvals reused, no source gate or
pixel review repeated. No private main solutions, answers/choices, DB/Git,
app/dependency/schema/service changes. Main owns independent text review,
figure assignment, approval and eventual official finalize.
