# STEMROBIN-180 b58 Angular-Speed Line: Affected-Only Review

Date: 2026-11-17. Same reviewer and invocation, cwd `/Users/yong/.codex/worktrees/0f12/lemmadeck`.

**Limited PASS for the F1 metadata repair only. No remaining defect in the affected scope.** This is not a new full text/scientific review, FIRSTPASS, pipeline acceptance or downstream authorization.

## Exact Affected Change

The sole changed field is `/exercises/3/lines/0`, line 71 of:

`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b58-angular-speed/work/adapt/8p/modern-us-neutral/lessons/phy8-c1-s3-n19/exercises.template.json`.

```text
Before: 4. 如果克里姆林宫钟楼自鸣钟的分针长度为 3.5 米，那么，分针针尖的线速度等于多少？试把这个分针的角速度与手表的分针角速度进行比较.
After:  4. 如果一座钟楼的分针长度为 3.5 米，那么，分针针尖的线速度等于多少？试把这个分针的角速度与手表的分针角速度进行比较。
```

The after-value exactly equals both frozen and current `/exercises/3/text`; that canonical text was not changed. The generic tower wording and Chinese final period now agree in the duplicate line. `3.5 米`, both tasks, numbering/group/binding, historical `source_text`, full `source.data`, all other fields and every other byte are unchanged. No new named tower was introduced.

Independent read-only verification, not reliance on the auxiliary PASS:

- All six frozen-copy SHA256 values match their manifest entries.
- Replacing only that field in a parsed copy of the frozen affected JSON yields an object deeply equal to current JSON. A complete line comparison identifies only line 71.
- Whole-file byte proof also passes: the frozen file is exactly its two-space JSON serialization plus final newline; the same serialization with only `lines[0]=unchanged text` exactly equals current bytes. No extra formatting or hidden changes are present.
- The other five current inputs are byte-identical to their frozen copies.
- FIRST report equals the freeze's `reportSha256` and is byte-identical to its existing FIRST snapshot.

The full affected diff and independent checks are stored only in the new evidence subdirectory:

`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-angular-speed-text-review/line-affected/`.

## Exact Hash Bindings

Freeze: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-angular-speed-before-line-repair/manifest.json`, SHA256 **`38ef916bceb0942ec9c9914a49aebfe879b8f0a7f5f96e4413fd9b6b977f1ac4`**.

| Current Input | SHA256 | Relation To Freeze |
| --- | --- | --- |
| Raw `lesson.json` | `470bd3e2710678aa4f8d6decbafe1dde48a83570d8a5bfd3b0c0341477c01742` | Byte-identical |
| Raw `lesson.md` | `6bc5c17ca7767ab72d6b521a3994ee081d9e8420b29b610ce99dae0fc9f47595` | Byte-identical |
| Raw `exercises.json` | `74e10c93f7da64ebafafc4feffb74f1e48138a500294fb721149851d1c4b84cf` | Byte-identical |
| Modern `lesson.template.json` | `e48ce60882300cf31b3bdcade214d291860fa5bb18b27534c0186edbb735ca2a` | Byte-identical |
| Modern `exercises.template.json` | `e08590dde43060a380f43e0db63a8dbb1ad1a216e9efe9ec633b0a3f3cede6fe` | Only F1 field |
| Modern `figures.template.json` | `333e82eda65dd362210bfa3290a4d130f4c22cf683258be0af2145b8df7e4a24` | Byte-identical |

The affected file's frozen SHA256 remains `ff94b64e83ed7a0ff46d689893ae4cb49dc5b87bca7e661101401b75faaf22e6`. Exact current/frozen paths and hashes, including all six copies, FIRST and receipt files, are in `line-affected/input-bindings.sha256`; measured values were rechecked during verification.

Immutable FIRST report:

`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/modern-text-review-angular-speed-b58.md`.

SHA256 remains **`868a018a020adcc1bc9abedf03f35368f45e4844e7fe8884a28bdbf853911441`**, equal to the manifest binding and existing `FIRST-review.md` snapshot. Its **FIRST REVISE / P3 F1** verdict is retained, not rewritten.

## Existing Receipt

Only the supplied `b58-angular-speed-line-repair-exact-binding` call/stdout/stderr were read under:

`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/commands/`.

| Receipt File | SHA256 |
| --- | --- |
| `.call.json` | `fafb5d3563eb2bf53c3a8e7f6fa71531f78e369657cd441a4e8cdbcea337b78c` |
| `.stdout` | `25e749e8458a2daacae4d675511d669c3f753d0632a0440e4a8dce08f14d6fe0` |
| `.stderr` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |

The call records exit 0, null signal, 90-byte stdout and empty stderr. Both recorded stream sizes/hashes match actual files. Recorded command: `node .intentfold/tickets/STEMROBIN-180/tmp/repair-b58-angular-speed-line-binding.mjs verify`, in the exact cwd above, from `2026-11-17T15:53:27.258Z` to `2026-11-17T15:53:27.300Z`. It was **not rerun**. Its assertion that only ex4's line changed agrees with this reviewer's independent object, byte and hash comparisons.

## Preserve And Stop

All prior full-review PASS observations remain intact as historical observations: 7/7 complete prose coverage, 4/4 question coverage, formula/number/task preservation, canonical-text scientific and ordinary-model solvability conclusions, original data and generic scene. They were **not re-reviewed or newly certified** here. The old FIRST REVISE and its first comparison failure remain unmodified; this separate limited PASS records resolution of F1, not replacement of history. All historical HOLD states and other workers' edits remain untouched.

Repair budget: **1/1 used, 0 remaining**, as explicitly reported by the parent. The frozen manifest correctly records the pre-repair budget `used: 0, max: 1`; it was not changed into a current-status file.

**Images: 0.** No science/network/full review, old answer/choice/interaction inspection, source/template edit, repair, gate, finalize, assemble, promotion, DISPLAY, backend, Git or DB operation was performed. Writes are only this new report and new `line-affected/` files. This report's external hash seal is `line-affected/report-seal.sha256`.

**Limited PASS for F1 only; remaining affected defects: 0. Text-only return, then STOP.**
