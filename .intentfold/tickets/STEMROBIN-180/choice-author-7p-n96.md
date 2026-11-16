# STEMROBIN-180/C: n96 Offline Choice Author Handoff

Status: **awaiting independent blindFIRST**. Author-only; no semantic approval,
self-review, independent reviewer or review-checker call. No in-flight jobs.

All four original written tasks remain in the prepared seed and unchanged
lesson. Three choice additions cover written tasks 1, 3 and 4. Task 2 is wholly
deferred for choice: its open practical-significance explanation is not replaced
by generic recognition or a newly invented application problem. Recognition
losses for the other tasks are explicit in the draft and author evidence.

## BlindFIRST Input

Give the separately authorized independent reviewer only
[learner-view.FIRST.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/choices/phy7-c1-s2-n96/learner-view.FIRST.json)
and its identity hashes first. It is a pure array of `{id, view}` objects, with
no source mapping, key, author solution, rationale or internal field.

- Complete file byte SHA-256: `d07a951a7cdad9d5458e0a9a67d24024e77537961c9e556e6f6c00a503fffa82`.
- File bytes: `2123`.
- Canonical JSON SHA-256: `d8d13027c8b34838c424871c7f7940a76da10ddd5bf9dc4aa6e382c234a376fa`.
- This canonical hash equals the draft's projected `{id, view}` array hash.

The independent reviewer must freeze its visible-only blindFIRST judgments
before author-internal disclosure. After that freeze, disclose the seed for
independent full-source/fidelity reasoning; author solutions and correct sets
come last for comparison. This note and the manifest are not initial blind input.

## Frozen Package

[handoff-manifest.FIRST.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/choices/phy7-c1-s2-n96/handoff-manifest.FIRST.json)
lists all 11 component paths, byte hashes, byte counts and disclosure roles.

- Manifest complete-byte SHA-256: `b5e7e73238e276f3baef41e8a2c9db8b4ba81780c96d53bd92410051fa6ec084`.
- Manifest bytes: `7799`; its 11 components total `68745` bytes.
- Seed canonical SHA-256: `014fe24739e243d64a6e032ebe8f9d338b473bbbfb2007cb4d0fc0cd2d3f885e`.
- Internal draft canonical SHA-256: `7ccd40745b31bc345fde23c2ad26e9df00cee56c6f14675191f54da8f22f72c2`.
- Independent pre-option solution FIRST byte SHA-256: `aaefe869b6bdcd2b99efe00e482690ee62c4d5c6ce09fabe0ddba0455aee762c`; `7631` bytes, frozen before draft construction.

Canonical JSON is exactly SHA-256 of
`json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":")).encode("utf-8")`.
Hash the entire parsed value, preserve array order, sort object keys, use ASCII
escaping and add no newline. File-byte hashes instead include the actual file's
terminating newline. Definitions are full zero-based paragraphs `0,3,4,5,6,7`.

## Binding Update

The relevant raw-book n96 canonical projection remains
`eed5d40f05e07c90d2001eed6e69bd6211ba839b376509aeffe60ba3859f7c67`.
It binds `{book, exercise_numbering, lesson:<complete n96 entry>}`, not the
whole book. Both historical and newer whole-book observations are retained in
`bindings.FIRST.json`; neither is a current global equality constraint. The
SOURCE99/100 metadata-only update changed no candidate or FIRST solution, and
no successful author check was rerun.

## Receipt and Stop

One inspect, one prepare and one structural check without `--review` completed.
Exact command, output, exit status and budget are in `call-receipts.FIRST.json`.
The structural checker exited `0`: `mechanical checks passed; semantic review still required`.
Repair budget is `1/1`, mechanical-inclusive; zero repairs used, FIRST preserved,
no loops. No full tests, modern render, reviewer, review checker or publishing.
Detailed author decisions and misconception derivations are in
`authoring-evidence.FIRST.md`; file/tool/prompt/index/paragraph bindings are in
`bindings.FIRST.json`. Those materials remain withheld until blindFIRST freezes.
