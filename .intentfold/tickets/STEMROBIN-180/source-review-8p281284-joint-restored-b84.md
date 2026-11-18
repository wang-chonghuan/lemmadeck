# STEMROBIN-180 Joint Boundary-Identity Review

Date: 2026-11-18. C, same invocation; cwd `/Users/yong/.codex/worktrees/0f12/lemmadeck`. Author root is `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b60-elastic`; the durable SSOT page tree is NOT the target of this review.

ONLY physical 8p 281->282 and 283->284 were reviewed. No repeated full SOURCE review, whole-page prose/formula/footer/figure recertification, scientific assessment, artifact repair, pipeline/check/retry, Git, DB, publication, deployment, setup, freshness, usage or checkpoint action was performed. Other workers' files were preserved. The required record-step command receipts are recorder-owned; manual writes are limited to this joint review's inventory/report/bindings.

## Verdicts

| Boundary | Stable Block References | Independent SAME-Object Identity | Current Boundary Verdict |
| --- | --- | --- | --- |
| 281->282 | `p0281#12` -> `p0282#1` | CONFIRMED, one prose paragraph | **PASS** |
| 283->284 | `p0283#6` -> `p0284#1` | CONFIRMED, one solution paragraph including its displayed equation | **HOLD**, solely because `p0284#1.cont` is currently false |

Identity is decided from this reviewer's own original pixels, not the example's science, neighboring reports or plausible meaning. All references are one-based block positions in the bound page JSON and corresponding MD block order.

## Source-First Order

1. Read session entry, lesson rules, image-batch rules, IntentFold routing and routed charter redlines.
2. Independently opened WHOLE originals 0281, 0282, 0283, 0284 sequentially, one image per tool call.
3. Persisted `inventory.md` before reading ANY author artifact or review report. Its frozen SHA256 is `e70ee4f318a5d8eb7007a7f49e12164e4209e121116eb7b11df015c2cf3a7060`.
4. Only then read the two specified inherited SOURCE reports and took one current snapshot of the four author MD/JSON/audit triples. Only the four boundary blocks and their next block headers were exposed for comparison; full-page audit counts were not re-certified.
5. Inspected ONE source-only crop of the physical-281 boundary paragraph to resolve a reviewer-inventory punctuation discrepancy. The initial inventory is preserved unchanged; the addendum below is authoritative for that observation.

Image count: **5/8 TOTAL**, comprising 4 whole originals + 1 needed boundary-source crop; 0 reopens, grids, author images, figures or other screenshots. Crop rectangle is `(230,2100,1550,2265)` in original physical-281 pixels, with no resizing. Its PNG SHA256 is `651a54288050f298cacc3c7260c668b0660adf1469e7dbcb3a2783f966b0b320`. It was produced in memory from the bound original with the authorized Python executable and `-B`, invoked through recorder label `b70-joint281284-boundary-source-crop-15`; no separately authored crop file was written.

Failures: 0. Retries/alternate failed branches: 0. All shell/subprocess commands used `node .intentfold/tickets/STEMROBIN-180/tmp/record-step.mjs` with unique `b70-joint281284-` labels.

## Preserved Inventory Addendum

The pre-author inventory transcribed the INTERNAL punctuation after `举高的功` as a full stop. My own source-only crop confirms that the printed glyph is a comma: `举高的功，对于机床来说`. Both current MD and JSON already contain the correct `，`. This is a correction to this reviewer's observation, NOT an author defect, NOT a page-281 row correction, and NOT grounds to duplicate the separately running affected review.

For exact current-artifact literals below, preserve the author's ASCII full-stop joining spaces, fullwidth `：`, Markdown emphasis and TeX delimiters. Those representation details do not alter the independently observed boundary identity. The source inventory's simplified punctuation/TeX notation is not an instruction to rewrite current rows.

## 281->282: PASS

Physical 281's final paragraph is indented at its start and has two printed rows. Its final characters are `克服` with NO following punctuation. Physical 282 begins with the continuation line `加工件和车刀的摩擦力所做的功，等等.`; there is no new item label or heading. Its baseline full-stop dot after `等等` closes the same paragraph. The following indented `但是，` is a new paragraph.

Current flags:

- `p0281#12`: kind=`p`, open=true, cont=false; MD `<!-- p open -->`.
- `p0282#1`: kind=`p`, open=false, cont=true; MD `<!-- p cont -->`.

Exact literal joined object, formed by removing only the printed row breaks between the bound JSON `lines` arrays:

```text
有用功是利用机器完成工作的功. 例如，对于起重机来说，有用功是把重物举高的功，对于机床来说，有用功是克服加工件和车刀的摩擦力所做的功，等等.
```

Exact boundary: `克服加工件`, no inserted separator or punctuation. SAME-object identity, kind, both flags and closing punctuation all agree. Frozen repair: **NONE**. This PASS certifies only this boundary and joined object, not page 281's other rows or its finalized 25/25 evidence.

## 283->284: HOLD

Physical 283 starts the example-2 solution as an indented paragraph with `解:`; its last row ends `所有损失的势能都转换为内能，即`, with NO punctuation after `即`. The FIRST content on physical 284 is the centered equation `Q=m|vector g|(h_1-h_2)`, followed by a printed baseline full-stop dot. There is no new heading, item label or prose lead-in before the equation. The next indented line `把已知数据代入，则得` is a NEW paragraph.

Consequently the displayed equation completes the still-open solution paragraph. Its centered layout does not create a new object. Both fragments remain kind `p`. Required pair: `p0283#6` open=true/cont=false -> `p0284#1` open=false/cont=true.

Current left fragment already agrees: MD `<!-- p open -->`, JSON kind=`p`, open=true, cont=false. Current right fragment is MD `<!-- p -->`, JSON kind=`p`, open=false, cont=false. Its body and terminating punctuation agree with source, but its missing continuation flag prevents approval of the current boundary.

Exact literal joined object IF the frozen continuation flag is applied, with all existing content preserved:

```text
**解**：假如不制动，则势能的减少等于动能的增加量. 但是，因为汽车是以恒定的速度运动，所以在滑下时动能并不增加. 因此，所有损失的势能都转换为内能，即$Q=m|\vec{g}|(h_1-h_2)$. 
```

The final row above ends with exactly ONE ASCII space after the period, inherited from the current equation row. Exact JSON-string form, including that trailing space:

```json
"**解**：假如不制动，则势能的减少等于动能的增加量. 但是，因为汽车是以恒定的速度运动，所以在滑下时动能并不增加. 因此，所有损失的势能都转换为内能，即$Q=m|\\vec{g}|(h_1-h_2)$. "
```

Do not add a colon, comma or period after `即`. Do not remove the equation's terminal period. Keep the right fragment closed (`open: false`); do not absorb `把已知数据代入，则得` into this object.

## Exact Frozen Repair: Parent Only, NOT Executed

Sole repair is the continuation flag in the two existing representations of `p0284#1`. This report does not execute it or prescribe a pipeline replay. No other row, flag, block, metadata or audit change is authorized by this finding.

MD target:

```json
{"path":"/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b60-elastic/artifacts/8p/pages/0284/page.md","sha256":"9f5a098ab4f29c8789dea157810ede26f619e06b5b9844d66e18e51df23600f0"}
```

Location: FIRST block header, stable reference `p0284#1`. COMPLETE old/new flag rows:

```text
OLD: <!-- p -->
NEW: <!-- p cont -->
```

COMPLETE associated body row, UNCHANGED, encoded as a JSON string so its trailing space is explicit:

```json
"$Q=m|\\vec{g}|(h_1-h_2)$. "
```

JSON target:

```json
{"path":"/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b60-elastic/artifacts/8p/pages/0284/page.json","sha256":"0e61e6169b468af40725a48c1c73f46b989c489852b91f67b713bab68fb01b4b"}
```

Location: `blocks[0]`, stable reference `p0284#1`. COMPLETE old block:

```json
{
  "kind": "p",
  "label": null,
  "box": null,
  "owner_exercise": null,
  "cont": false,
  "open": false,
  "samerow": false,
  "lines": [
    "$Q=m|\\vec{g}|(h_1-h_2)$. "
  ]
}
```

COMPLETE new block:

```json
{
  "kind": "p",
  "label": null,
  "box": null,
  "owner_exercise": null,
  "cont": true,
  "open": false,
  "samerow": false,
  "lines": [
    "$Q=m|\\vec{g}|(h_1-h_2)$. "
  ]
}
```

Only `cont: false` -> `cont: true` changes. Kind, open, samerow, label, box, owner and exact body row stay unchanged. No physical-281 correction is proposed. Repair execution and any further authorized action belong to the parent.

## Inherited Evidence And Limits

- Inherited original SOURCE review for 282/283: {"path":"/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b70-source-review282283/report.md","sha256":"ad7cc8585e4dfb806d2bbdd4670570172a787bb2304ca6e75f70fff5cecf444b"}. Its full SOURCE PASS remains inherited; its UNKNOWN incoming 281 and outgoing 284 identities are the ONLY gaps addressed here. Its 282->283 local join is not re-reviewed.
- Inherited original SOURCE review for 284: {"path":"/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b70-source-review284/source-review.md","sha256":"b72014d51a145857c2e0525302170d6b60e423cbc600f4838b3071894e60653b"}. Full SOURCE PASS remains inherited; the previously UNKNOWN incoming 283 identity is now confirmed but current boundary approval is HOLD pending the sole flag repair. Its outgoing 285 hold is untouched.
- Physical 281's sole ten-row correction and finalized PASS 25/25 are user-provided inherited facts, NOT re-certified here. `tmp/b70-source280281-affected-review` was not read, duplicated or modified.
- No unresolved pixel uncertainty remains in these identities, boundary words, absent boundary punctuation, or terminal full stops after the reviewer-inventory clarification. No claim is made about science, assembly, adaptation, rendering, publication, unreviewed neighbors, or edits made by others after the recorded snapshot. All frozen repair targets are bound to the exact observed hashes.

`bindings.json` contains explicit exact `{path, sha256}` entries for all 4 observed originals, all 12 current author MD/JSON/audit files, both inherited reports, the frozen source-first inventory and this report. It excludes its own hash; that hash is returned separately. Review-owned output is text only.
