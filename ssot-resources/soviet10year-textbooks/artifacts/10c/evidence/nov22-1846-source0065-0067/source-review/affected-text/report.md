# Affected-only TEXT comparison: 0065-0067

Date: 2026-11-22. One newly released changed candidate comparison, not another whole PhaseB/source review.

## Limited Verdict

**ACCEPTED within the affected scope:** the three authorized punctuation substitutions, the two exact 0066 counting-copy rectangles/reasons, native propagation, the 0066/0067 limitation notes, and otherwise unchanged body/blocks/ownership/samerow/declared geometry.

**HOLD on one new metadata phrase:** the 0065 appended historical note incorrectly describes the semicolon as the end of its first printed row. The punctuation edit itself is correct. This is a finding about the new note and the designated changed row, not a source re-review.

All pre-existing source-glyph, precise-crop and typography UNKNOWN/HOLDs remain. No whole-page, figure, source, N87/N88, lesson or course PASS.

## New Note Finding and Exact Repair

Target: `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/source10c5255-work/artifacts/10c/pages/0065/page.md:26`, JSON `meta.notes[3]`.

Current new phrase:

```text
Property 4 ends its first row with a semicolon
```

The designated corrected row, current MD line 66 / JSON `blocks[6].lines[0]`, is:

```text
4. 正切是具有最小正周期$\pi$的周期函数；对于所有的
```

Its semicolon is between `周期函数` and `对于所有的`; the printed row ends with `对于所有的`, not the semicolon. The same row is already frozen in PhaseA; no new pixels are used.

Recommended smallest affected repair: replace only that phrase with:

```text
Property 4 has a semicolon after 周期函数 within its first printed row
```

Keep the rest of this one appended note, every old historical note, both punctuation corrections and all body rows/flags unchanged. Do not append a second historical note or edit the source body to make the inaccurate description true.

No candidate edit or producer was performed. A later exact changed-note release is required for comparison; no rerun is authorized here.

## Exact Affected Deltas Compared

Baseline: only `W/receipts/nov22-finalize-p0065-01/output-*`, `...p0066-01/output-*`, `...p0067-01/output-*`.

New snapshots: only `W/receipts/nov22-affected-finalize-p0065-02/output-*`, `...p0066-02/output-*`, `...p0067-02/output-*`, their released text inputs/receipts/streams, and corresponding current MD/JSON/AUDIT.

| Page / affected field | Observed delta | Disposition |
| --- | --- | --- |
| 0065 `blocks[6].lines[0]`, current MD line 66 | `周期函数：对于所有的` -> `周期函数；对于所有的` | ACCEPTED, exact semicolon-category repair |
| 0065 `blocks[10].lines[0]`, current MD line 79 | terminal `有导数。` -> `有导数：` | ACCEPTED, real source colon retained |
| 0065 `meta.notes[3]`, current MD line 26 | Exactly one appended note; old notes unchanged | Limitation/omission statement accepted; row-end phrase above HOLD |
| 0067 `blocks[3].lines[1]`, current MD line 65 | terminal `是负的，` -> `是负的。` | ACCEPTED, period-category repair only |
| 0067 `meta.notes[4]`, current MD line 27 | Exactly one appended historical/typography limitation note | ACCEPTED, no glyph/crop claim added |
| 0066 `meta.count_exclusions` | Exactly the two approved rectangles with counting-copy-only/physical-origin-UNKNOWN reasons | ACCEPTED, no internal or extra isolated-mark exclusion |
| 0066 `meta.notes[5]`, current MD line 28 | Exactly one appended historical-limitation note | ACCEPTED, original surplus cause remains UNKNOWN |
| 0066 audit | `lines_printed` 24 -> 23, same `lines_md` 23; previous error removed; two exclusions propagated | Verified new changed-input mechanical result, not source/cause approval |

0066 reasons, compared literally between MD meta, JSON meta and audit:

```text
[145,0,973,4]
Independent original-first p0066 freeze and affected text classification: pure upper-edge ink is detached from all observed body and footer content; counting copy only, physical origin UNKNOWN.

[0,2482,1125,11]
Independent original-first p0066 freeze and affected text classification: pure sparse lower-edge fragments lie below all observed body and footer content; counting copy only, physical origin UNKNOWN.
```

Both entries are `kind: scan-artifact`, exactly `[x,y,w,h]` as classified. No tighter envelope, expansion, extra dot, internal rectangle or causal attribution.

## Unchanged Material: Delta Proof, Not New Review

- Replacing only the three designated strings reproduces new MD bodies exactly from first outputs. 0066 MD body is byte-identical to its first output.
- Applying only those punctuation edits to baseline JSON blocks reproduces the new blocks exactly. All other block fields are deep-equal.
- 0066 all 29 blocks, all 22 tasks 182-203, four owner request arrays and all open/cont/samerow flags are deep-equal to its first output. No request, task or real printed row was added, removed or altered.
- Removing one appended note per page and, only on 0066, the two new count_exclusions restores each baseline metadata object exactly.
- 0065 and 0067 AUDIT bytes are identical to their first outputs; no errors, normalization, count, figure or exclusion delta.
- 0066 audit differs only in the observed printed count, error array and the two approved count exclusions. `normalizations=[]`; every other audit field is unchanged.
- New MD frontmatter equals new JSON meta on all three pages. Each new input/output body and parsed meta is equal.
- 0065/0067 input and output MD bytes are equal. 0066 native output expands metadata array formatting by 80 bytes; body and parsed meta are unchanged from input.
- Figure 38 declared box `[613,1458,525,685]`, figure/caption ownership, IDs and all other geometry declarations are unchanged. Actual crop/source bytes, headers and glyphs were NOT read or hashed.
- 0065 property 8 still ends with the real colon and still has no derivative. No formula, fake open/cont, empty row, new erratum or solver result was introduced.
- Old author completeness claims stay historical; the appended note otherwise explicitly preserves the unresolved omission and rejects a complete-sentence/invented-formula claim.

## Native Propagation and First Failure

| New recorded stage | Actual exit | Printed / authored | Normalizations | Errors |
| --- | --- | --- | --- | --- |
| nov22-affected-finalize-p0065-02 | 0 | 23 / 23 | 0 | [] |
| nov22-affected-finalize-p0066-02 | 0 | 23 / 23 | 0 | [] |
| nov22-affected-finalize-p0067-02 | 0 | 13 / 13 | 0 | [] |

One read-only TEXT binding/delta check verified exact cwd/argv/exit, all released input/output/stream byte lengths and SHA-256, and current-output byte equality. This reviewer ran no producer/counter/diagnostic.

The original 0066 first receipt is still hash-bound to `586664d1ca34cf4af9c31869f75989cd44afe529a544d81d8e20f121661858ad`, exit 1. Its first output MD/JSON/AUDIT and stdout/stderr bindings still match; original audit remains 24/23, count_exclusions=[], with the original count error.

The new changed-input count is mechanically successful. This does not erase the historical first failure, prove the physical origin of ink or identify which original artifact caused the surplus. Those causes remain UNKNOWN.

The provided 65/67 executor report's statement that 66 was still unchanged/24-23 is historical to that earlier executor stage. The separately released later 0066 receipt now records 23/23; the chronological statements are not conflated.

## Actual Faults and Limits

- Reviewer execution faults: NONE; the read-only verifier exited 0. Every completed reviewer exec exited 0; all sessions exited.
- No shell diff ran in this review. Structured byte/value deltas are expected changed-candidate differences, not an exit-1 execution failure. No unobserved diff exit is invented.
- All three NEW stderr streams actually retain the ignored logging/instrumentation shutdown `AttributeError: 'NoneType' object has no attribute 'startswith'`, via logging `_removeHandlerRef` and the named instrumentation `profile` at line 18. They are separately reported, not suppressed or confused with successful child exits.
- Original 0066 exit 1 at 24/23 is a preserved historical producer failure, not a failed new reviewer command.
- The hash-bound 65/67 executor REPORT additionally reports a preflight Node parse error (extra closing parenthesis) and ENOENT for the absent 65 figures directory. These are EXECUTOR-REPORTED read-only preflight faults; this reviewer did not reproduce them or read unrelated directories/crop bytes. The report says neither triggered a producer retry or source edit.
- Broad old-stage/page manifests, source/crop hashes and image-trace/codec counts in supplied executor reports remain executor claims outside this delta verification. They were not independently reopened or gated.
- New model images/ROI/reopens/image decode/source or crop byte/hash/header reads: ALL 0. Native producer, counter, diagnostic, solver, skills/Git/backend/DB/network/paid job/browser/CUA/peer messages: ALL 0.
- Prior PhaseA model usage remains 3/8 batch and 3/24 context, no reset. Parent remains permanently 24/24 exhausted. Exact model/provider/tool monetary charges UNKNOWN; new deliberate paid-service calls 0.
- Physical ink origins, precise crop/glyph/typography and any unrelated source HOLD remain UNKNOWN/unresolved; upper-right/internal isolated marks remain protected.
- N87 source closure at 0066 is not N87 course PASS; N88 remains start-only on 0067, not complete.
- All writes were apply_patch under ONLY the NEW reviewer `affected-text/` root. Originals, earlier reviewer evidence, receipts, candidates and all other dirt were not edited.

Full exact current/receipt bindings are in sibling `bindings.md`. Stop after this affected-only comparison. No further source/figure/course review or candidate change.
