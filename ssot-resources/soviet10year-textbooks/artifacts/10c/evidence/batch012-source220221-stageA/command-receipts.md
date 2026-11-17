# Actual Stage A command and image receipts

Ticket: STEMROBIN-184, SessionB.
All shell commands below used cwd /Users/yong/.codex/worktrees/a07e/lemmadeck.
Receipt identifiers are the actual tool output chunk IDs where available.
No shell-output file existed previously; this is a textual transcription of returned tool evidence.

## Instruction reads

Executed with functions.exec_command:

- `sed -n '1,240p' .intentfold/readme.md` -> chunk 4d521e, exit 0.
- `sed -n '1,260p' .intentfold/charter/engineering.md` -> chunk 131ed8, exit 0.
- `sed -n '1,260p' .intentfold/charter/product.md` -> chunk 0390ec, exit 0.
- `sed -n '1,300p' .claude/skills/ld-s10y-lesson/SKILL.md` -> chunk dfdbe5, exit 0; includes single-page source-recognition guidance.
- `sed -n '1,300p' .agents/skills/ld-s10y-image/SKILL.md` -> chunk bd8401, exit 0; includes Image batches.
- `sed -n '1,260p' /Users/yong/.agents/skills/intentfold/SKILL.md` -> chunk 373638, exit 0; routing read only, no capability execution.
- `sed -n '1,280p' .intentfold/charter/operations.md` -> chunk bdd203, exit 0.
- `sed -n '280,340p' .intentfold/charter/operations.md` -> chunk f7a33c, exit 0; completes Redlines.

Independent eligible reads were parallelized with multi_tool_use.parallel; no author/canonical/count/layout paths were included.

## Source byte hashes

Actual command:

```sh
shasum -a 256 .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221/10c/pages/0220/page.png .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221/10c/pages/0221/page.png
```

Actual output, chunk 37be48, exit 0:

```text
71f147a2fb3bfc311d2055b56a9d9bc5ffdd10588f69b74d464ee9c1382ce060  .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221/10c/pages/0220/page.png
a79759b0e7604817cba38821dcef150473b335c335eb88e45a955011cc7408b8  .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221/10c/pages/0221/page.png
```

## Native file metadata

Actual command:

```sh
file .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221/10c/pages/0220/page.png .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221/10c/pages/0221/page.png
```

Actual output, chunk e23039, exit 0:

```text
.intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221/10c/pages/0220/page.png: PNG image data, 1695 x 2580, 8-bit/color RGB, non-interlaced
.intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221/10c/pages/0221/page.png: PNG image data, 1695 x 2580, 8-bit/color RGB, non-interlaced
```

This metadata operation did not load pixels into the visual context or resize a source.

## New ownership-directory check

Actual command:

```sh
stat -f '%N | bytes=%z | modified=%Sm' .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review
```

Actual output, chunk d91535, exit 1:

```text
stat: .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review: stat: No such file or directory
```

This is the observed pre-write absence of the exact new review directory, not a product failure. No neighboring/author directory was listed or inspected.

## Actual native image events

A1 was functions.view_image with:

```json
{
  "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221/10c/pages/0220/page.png",
  "detail": "original"
}
```

Actual outcome: original page image returned and observed, printed 214 visible. Permanent image load changed 0 -> 1.

A2 was functions.view_image with:

```json
{
  "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221/10c/pages/0221/page.png",
  "detail": "original"
}
```

Actual outcome: original page image returned and observed, printed 215 visible. Permanent image load changed 1 -> 2.

No tool-provided chunk ID or timestamp was returned for these image events; none is fabricated. There was no crop, resize, reopen, third image, OCR, page-grid access, or image payload in the textual handoff.

## Scratch writes

Actual first functions.apply_patch outcome: exit 0, Success. Added only these six new files under the exact owned review directory:

```text
inventory-0220.md
inventory-0221.md
image-ledger.json
source-bindings.sha256
report.md
command-receipts.md
```

This receipt is appended with apply_patch inside the same owned directory. No original, canonical, author, previous-page, Charter, or other existing file is modified.

## Source-byte binding recheck

Actual command:

```sh
shasum -a 256 -c .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/source-bindings.sha256
```

Actual output, chunk 24803b, exit 0:

```text
/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221/10c/pages/0220/page.png: OK
/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221/10c/pages/0221/page.png: OK
```

This byte-hash recheck is not an image reopen or a source-content review.

## Frozen evidence byte hashes

Actual command:

```sh
shasum -a 256 .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/inventory-0220.md .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/inventory-0221.md .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/image-ledger.json .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/source-bindings.sha256 .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/report.md
```

Actual output, chunk 5c8aba, exit 0:

```text
af891f0ade414291425c0083823a0bec0b0ad145c3c13a71260471a69cec806c  .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/inventory-0220.md
5225afd2bdf74cbe6cc2cc6e5752da77924d29b69a82bf9f8fc0ee708e6f5baa  .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/inventory-0221.md
9cdefe92ed8558bdc6c837b346a7770b2a1f7edec7f3eb0e472443404148c074  .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/image-ledger.json
6ddd806c4e3f6a1362514bf7539712b1779c32a59e818870feae38a32b7a0585  .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/source-bindings.sha256
25fcdd00451185c49c7907fea82d59a8a111021a05d397bb5356e8e270e83470  .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/report.md
```

Self-sealing note: the final digest of this receipt cannot be included in its own bytes. Its actual subsequent hash output belongs to stage-a-bindings.sha256 and the final text handoff, as does the binding manifest's own digest. The inventories, ledger, source bindings and report are not rewritten after the hashes above.
