# Actual sole Stage B receipts

STEMROBIN-184, SessionB. Cwd for every shell command:
/Users/yong/.codex/worktrees/a07e/lemmadeck

The exec tool returned an exposed Output stream and an exit code; it did not separately expose stdout versus stderr. The records below preserve that distinction honestly. A referenced complete file output is bound to its unchanged bytes, not a newly authored paraphrase. No fabricated empty stderr, timestamp or undisclosed command is asserted.

## Initial authorized input and scratch inspection

1. Command:

```sh
shasum -a 256 ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0220/page.md ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0221/page.md
```

Tool chunk 073afa, exit0, exposed stream:

```text
f71a386690a6cb46ad5af48fa800ab5116cb0d70e1a3f22cfaed83b322249f1b  ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0220/page.md
fe95c86fb60cf1f1624652cb39b25e905e6ec7b996b2f959d445af075848df8f  ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0221/page.md
```

2. Command:

```sh
stat -f '%N | bytes=%z' .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/stage-b
```

Tool chunk73617a, exit1, exposed stream:

```text
stat: .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/stage-b: stat: No such file or directory
```

This establishes the NEW exact Stage B directory before creation. It is not a source/tool failure or permission workaround.

3. Command:

```sh
sed -n '1,240p' .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/inventory-0220.md
```

Tool chunk d04860, exit0. Complete exposed stream is the unchanged inventory-0220.md, absolute path in input-bindings.sha256, SHA-256 af891f0ade414291425c0083823a0bec0b0ad145c3c13a71260471a69cec806c. The returned output includes the entire file from its title through its final limit bullet; it is not truncated.

4. Command:

```sh
sed -n '1,250p' .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/inventory-0221.md
```

Tool chunk041051, exit0. Complete exposed stream is the unchanged inventory-0221.md, SHA-256 5225afd2bdf74cbe6cc2cc6e5752da77924d29b69a82bf9f8fc0ee708e6f5baa. Entire title-to-final-limit output returned, not truncated.

5. Command:

```sh
shasum -a 256 -c .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/stage-a-bindings.sha256
```

Tool chunk d428a7, exit0, exposed stream:

```text
/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/inventory-0220.md: OK
/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/inventory-0221.md: OK
/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/image-ledger.json: OK
/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/source-bindings.sha256: OK
/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/report.md: OK
/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/command-receipts.md: OK
```

Only a byte-binding check, not a repeated visual/content review or pipeline test.

## Sole disclosed author reads

6. Command:

```sh
sed -n '1,260p' ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0220/page.md
```

Tool chunk5319cc, exit0. Complete exposed stream is the exact canonical author0220/page.md, absolute path in input-bindings.sha256, SHA-256 f71a386690a6cb46ad5af48fa800ab5116cb0d70e1a3f22cfaed83b322249f1b. Entire frontmatter-through-foot output returned, not truncated. This file was read for the sole comparison, not recopied, edited or finalized.

7. Command:

```sh
sed -n '1,280p' ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0221/page.md
```

Tool chunk3a5738, exit0. Complete exposed stream is the exact canonical author0221/page.md, SHA-256 fe95c86fb60cf1f1624652cb39b25e905e6ec7b996b2f959d445af075848df8f. Entire frontmatter-through-foot output returned, not truncated. No second content read followed.

8. Command:

```sh
shasum -a 256 .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/stage-a-bindings.sha256 .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221/10c/pages/0220/page.png .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221/10c/pages/0221/page.png
```

Tool chunk3f4f30, exit0, exposed stream:

```text
673838a40273ee68d60cb96fae1f7a1741ef45535f162735da72c6e1384919f4  .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/stage-a-bindings.sha256
71f147a2fb3bfc311d2055b56a9d9bc5ffdd10588f69b74d464ee9c1382ce060  .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221/10c/pages/0220/page.png
a79759b0e7604817cba38821dcef150473b335c335eb88e45a955011cc7408b8  .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221/10c/pages/0221/page.png
```

## New native crop generation

An actual functions.apply_patch added only stage-b/create-native-crops.py, exit0 / Success. No source or Stage A write.

9. Actual generation command:

```sh
.claude/skills/ld-s10y-lesson/.venv/bin/python .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/stage-b/create-native-crops.py
```

Tool chunk0e89d5, exit0. The complete exposed stream is the generated crop-provenance.json JSON serialization, including its terminal newline, returned without truncation. Its final SHA-256 binding is in stage-b-bindings.sha256. The stdout includes both source/output absolute paths, source hashes, ROI coordinates, output hashes/dimensions, 1:1 scale and decoded pixel equality.

Generation used the already-present lesson Python/Pillow environment. No install, setup, crop resampling, original visual reopen, manual pixel write, count/exclusion or source edit.

## Actual visual events

10. functions.view_image, actual call:

```json
{
  "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/stage-b/0220-row08-native.png",
  "detail": "original"
}
```

Actual outcome: new native crop returned and observed, once. Ordinal3, lifetime2 ->3, batch2 ->3. Visible 醣 and 饼糟 recorded in comparison.md. No chunk ID or separate stream was supplied for the image event.

11. functions.view_image, actual call:

```json
{
  "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/stage-b/0221-raised-R-native.png",
  "detail": "original"
}
```

Actual outcome: new native crop returned and observed, once. Ordinal4, lifetime3 ->4, batch3 ->4. Visible raised n beside R recorded in comparison.md. No chunk ID or separate stream was supplied for the image event.

No image after ordinal4 was loaded, no original reopened, and no image payload is included in the parent handoff.

## New evidence writes and sealing

All manual writes use functions.apply_patch exclusively inside the NEW stage-b directory. Generated PNG/provenance writes are owned by the recorded crop command. The six original Stage A bound evidence files and its seventh manifest are never rewritten, nor are author files.

Actual byte-preservation and evidence hash streams are appended only after their commands return. Final receipt/manifest self-digests cannot live in their own bytes; they are sealed by the manifest or final TEXT/PATH/HASH response, not fabricated here.

12. Actual functions.apply_patch outcome: exit0 / Success, adding only stage-b/comparison.md, image-ledger.json, report.md, input-bindings.sha256 and command-receipts.md. The script and its generated crops/provenance already existed in this NEW directory. No Stage A or author file was changed.

13. Actual final input byte-preservation command:

```sh
shasum -a 256 -c .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/stage-b/input-bindings.sha256
```

Tool chunk f66830, exit0, exposed stream:

```text
/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/inventory-0220.md: OK
/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/inventory-0221.md: OK
/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/image-ledger.json: OK
/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/source-bindings.sha256: OK
/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/report.md: OK
/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/command-receipts.md: OK
/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/stage-a-bindings.sha256: OK
/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0220/page.md: OK
/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0221/page.md: OK
/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221/10c/pages/0220/page.png: OK
/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221/10c/pages/0221/page.png: OK
```

This protects frozen bytes after Stage B writes. It is neither a second content comparison nor a source/count/publication PASS.

14. Actual Stage B evidence hash command:

```sh
shasum -a 256 .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/stage-b/comparison.md .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/stage-b/image-ledger.json .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/stage-b/report.md .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/stage-b/input-bindings.sha256 .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/stage-b/create-native-crops.py .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/stage-b/crop-provenance.json .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/stage-b/0220-row08-native.png .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/stage-b/0221-raised-R-native.png
```

Tool chunk725c14, exit0, exposed stream:

```text
a983c264eb0f0a6757b335cde36ebe541d3b1f8d3c884340b51e6ebd4f8bef71  .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/stage-b/comparison.md
49f47fef43f9109e0bb5ca294542d7183757e03972b11df0c15a98cfbbcb843d  .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/stage-b/image-ledger.json
f98cc95b26e5ccc6176dbed4f57e528aa0806c51e3be660111714ee3434f9454  .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/stage-b/report.md
834351b7892dd542df9e5c5dea89ca0e1c46dbe74afc435c73300b0272cf328a  .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/stage-b/input-bindings.sha256
b7dec27c8f8e4972a8a46684381636ae5b0c9a74d00362d952522f790609cea7  .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/stage-b/create-native-crops.py
9e458226c871da9a396de4bb5e67b37ff345d8ca1bedba441a383c7bc6a9e339  .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/stage-b/crop-provenance.json
f5798293ebc42079a4dda2c2dfd982fe23afe38648be0f33298eeeb8947155db  .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/stage-b/0220-row08-native.png
d32a41836e5b5b0d2eae50df1ffe3fa7e4b945bf4a26dc5adfa16ea1b3f1f93a  .intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-review/stage-b/0221-raised-R-native.png
```

These evidence files are not modified after their actual hash receipt. This receipt is sealed separately and then remains unchanged. No further visual view, content read, source comparison or review-PASS run follows.
