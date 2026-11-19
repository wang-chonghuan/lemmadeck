# STEMROBIN-180: 8p199/200 Affected-Only SOURCE Review, b61

**Decision: ACCEPT_AFFECTED_ONLY.** The current four MD/JSON files contain exactly the seven required literal/space changes and the single 199 formula `↵` wrap, compared with this reviewer's independently frozen FIRST text. No additional content, metadata, structure, figure, scientific or typographic change was found by that exact byte comparison.

This is a zero-new-image, affected-only comparison, not a full SOURCE re-review, pipeline run, gate, repair or retry. Original FIRST decision remains **REVISE** and its report remains byte-identical:
`.intentfold/tickets/STEMROBIN-180/source-review-8p199200-b61.md`
SHA256 `af87dfa0b91b6cbb6559b34a2c3cb9bd312a7980963d7f319caef435e1e9df35`.
It is never relabeled PASS.

Workspace: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Owned affected evidence: `.intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/affected/`.
Only this new report and owned review evidence were written. Actual MD/JSON/audits, images, tools, profile, charter, author FIRST records/reports and parent repair evidence were not edited.

## Exact Affected Scope

The config's seven literal changes and one wrap match the minimum independently recorded in the original FIRST findings, not merely the parent's declared comparison.

| Page / zero-based JSON location | Required change | Current result |
| --- | --- | --- |
| 199 blocks[1].lines[0] | `§41` → `§ 41` | Exact. |
| 199 blocks[2].lines[0] | One trailing ASCII space after `$\vec{F}_2$` | Exact; soft join is `$\vec{F}_2$ 的绝对值`. |
| 200 blocks[1].lines[0] | One trailing ASCII space after `（根据图` | Exact; reference joins as `根据图 134`. |
| 200 blocks[5].lines[0] | One trailing ASCII space after `物体放在高` | Exact; height joins as `高 5 米`. |
| 200 blocks[5].lines[2] | One trailing ASCII space after `（图` | Exact; reference joins as `（图 135）`. |
| 200 blocks[13].lines[1] | `在 §42` → `在 § 42 `, including trailing ASCII space | Exact; section joins as `§ 42 中`. |
| 200 blocks[14].lines[2] | `摩擦力；它` → `摩擦力，它` | Exact, matching the independently frozen source comma fact; still open at 它. |
| 199 blocks[7].lines[0:2] | Replace the two split math spans with one formula containing `↵` before `=0` | Exact; print rows preserved, full condition joins as `$\sin\alpha-\mu\cos\alpha=0$`. |

The seven substitutions plus one wrap were applied only to an in-memory copy of the reviewer's original frozen JSON to construct expected text. The already-frozen native block serializer reproduces the original MD exactly before changes. Current MD and JSON then match the constructed expected bytes exactly, not merely selected tokens. This accounts for unchanged notes, all untouched lines, punctuation, formula symbols, object order, ownership, emphasis kinds, footer, flags, source/profile hashes and figure geometry without reopening or re-reviewing them.

| Current file | Expected and actual SHA256 |
| --- | --- |
| 0199/page.md | `dd67c6e313f17ba6f0d9441d150d5a2fd5e7b0571e0d670e134ff847d36e8ee8` |
| 0199/page.json | `278be0c19dff4cedbcab6d9bc6598c47b9dee7826c09cc1ad06797afbcb2c347` |
| 0200/page.md | `eef94063afe7955c668cb65f41fd4fc75e5f2221bcac2c6d13b74da3843f2380` |
| 0200/page.json | `e2d0422668b5c9785060f150b3f3dea8497cac146a696b0d90873f94c918de24` |

Both current MD views also match their current JSON, including trailing spaces and the `↵` marker. Metadata and every non-text block field are unchanged. No new errata, scientific correction, body emphasis, numeric substitution or speculative spacing was added; `质量50千克` and all other non-requested literals remain unchanged.

## Parent Freeze And Receipt Provenance

Parent inputs:
- `tmp/b61-source199200-sole-repair/before.json`: 35 named before-bindings.
- `tmp/b61-source199200-sole-repair/comparison.json`: four changed MD/JSON and 31 unchanged named inputs.
- `tmp/b61-source199200-sole-repair-config.json`: exactly seven substitutions and one wrap.

Every parent before-snapshot hash is intact. For inputs already present in this reviewer's frozen FIRST binding set, parent before-hashes agree exactly with that independent set. Every current input hash agrees with the parent's comparison. Exactly four paths changed, all four being the two specified pages' MD/JSON; all 31 other paths stayed byte-identical. This includes both audits, source page PNGs, complete fig135 PNG/SVG, tools/profile, author FIRST text/receipts/reports, original FIRST review and its binding record.

The named sole-finalize receipts were read as provenance only; their command arrays, zero exit codes and actual stdout/stderr stream hashes match. No finalize was executed by this affected reviewer.

| Sole repair receipt | Recorded rows / normalization | Budget |
| --- | --- | --- |
| `b61-source199-sole-finalize.{call.json,stdout,stderr}` | PASS 25/25, normalization0; no audit errors | 1/1 used, remaining0. |
| `b61-source200-sole-finalize.{call.json,stdout,stderr}` | PASS 27/27, normalization0; no audit errors | 1/1 used, remaining0. |

The audits are byte-identical to the original FIRST audits. Their unchanged bytes alone are not new SOURCE approval; the exact repaired text comparison above is the new affected evidence. Original FIRST finalization/report records stay immutable and are not reused as repaired-file hash bindings.

Complete fig135 PNG SHA256 remains `e35603e71aae592ce0123f276071087eac27e9c929afb39dfc35fb1327ff9b16`.
Complete fig135 SVG SHA256 remains `c443eb674783fa2896d8747dfbe27b560d45d0f0457722db9ff57f0cbf7a62fe`.
Current JSON still has fig135 box `[839,757,569,392]`, the same caption, ex5 open/cont split and same-row caption. No figure pixels, SVG display or crop were opened. The prior independent complete-figure observation remains the visual authority because figure bytes and geometry are unchanged; no new vector result or visual PASS is invented.

## Authority And Limits

- Incoming198 remains limited to human-supplied FIRST author text: `在木块上的所有力在这个轴上的投影的总和也等于零. 因此，`. It is not SOURCE approval of198. No198 pixels/draft are read.
- 199's final paragraph remains closed; 200 starts the exercise group rather than a continuation from199. These flags are unchanged, not newly reviewed.
- Outgoing201 remains **UNKNOWN**. Current200 ends `摩擦力，它` with `p open`; no continuation, completion or publication readiness is inferred.
- No new images: 0. Original context image count remains8; no image loads, reopens, crops, renders or OCR in this affected turn.
- No prepare, finalize, vectorize, gate, retry, repair, freshness/setup, modern edition, answers, choices, backend, DB or Git commands ran.
- Both pages' sole repair budgets are exhausted; no further repair is authorized.
- No affected comparison failure or unmatched byte was observed. This acceptance is limited to the requested repaired surfaces and exact minimum. It is not a full re-review or a new FIRST PASS.

## Flat Current And Evidence Bindings

`currentBindings` below is an explicit object with eight flat `{path, sha256, snapshot}` entries: both pages' MD, JSON and audit, plus complete fig135 PNG and SVG. Current snapshots were taken for byte comparison only, never opened as images. `evidenceBindings` records the parent inputs, independent frozen facts and the named sole-finalize receipt streams.

```json
{
  "schema": "b61-affected-only-review-bindings@1",
  "sealedAt": "2026-11-17T20:46:39.736Z",
  "decision": "ACCEPT_AFFECTED_ONLY",
  "currentBindings": {
    ".tmp/ld-s10y-lesson/b60-elastic/artifacts/8p/pages/0199/page.md": {
      "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b60-elastic/artifacts/8p/pages/0199/page.md",
      "sha256": "dd67c6e313f17ba6f0d9441d150d5a2fd5e7b0571e0d670e134ff847d36e8ee8",
      "snapshot": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/affected/current/.tmp/ld-s10y-lesson/b60-elastic/artifacts/8p/pages/0199/page.md"
    },
    ".tmp/ld-s10y-lesson/b60-elastic/artifacts/8p/pages/0199/page.json": {
      "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b60-elastic/artifacts/8p/pages/0199/page.json",
      "sha256": "278be0c19dff4cedbcab6d9bc6598c47b9dee7826c09cc1ad06797afbcb2c347",
      "snapshot": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/affected/current/.tmp/ld-s10y-lesson/b60-elastic/artifacts/8p/pages/0199/page.json"
    },
    ".tmp/ld-s10y-lesson/b60-elastic/artifacts/8p/pages/0199/audit.json": {
      "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b60-elastic/artifacts/8p/pages/0199/audit.json",
      "sha256": "16e1c07a8dd47de25f0274d56d9e563b5a56b53e20aefa82949b164a7ec7f782",
      "snapshot": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/affected/current/.tmp/ld-s10y-lesson/b60-elastic/artifacts/8p/pages/0199/audit.json"
    },
    ".tmp/ld-s10y-lesson/b60-elastic/artifacts/8p/pages/0200/page.md": {
      "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b60-elastic/artifacts/8p/pages/0200/page.md",
      "sha256": "eef94063afe7955c668cb65f41fd4fc75e5f2221bcac2c6d13b74da3843f2380",
      "snapshot": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/affected/current/.tmp/ld-s10y-lesson/b60-elastic/artifacts/8p/pages/0200/page.md"
    },
    ".tmp/ld-s10y-lesson/b60-elastic/artifacts/8p/pages/0200/page.json": {
      "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b60-elastic/artifacts/8p/pages/0200/page.json",
      "sha256": "e2d0422668b5c9785060f150b3f3dea8497cac146a696b0d90873f94c918de24",
      "snapshot": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/affected/current/.tmp/ld-s10y-lesson/b60-elastic/artifacts/8p/pages/0200/page.json"
    },
    ".tmp/ld-s10y-lesson/b60-elastic/artifacts/8p/pages/0200/audit.json": {
      "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b60-elastic/artifacts/8p/pages/0200/audit.json",
      "sha256": "4ba1ab3cdf9b34cfbb8685ead8062b50b2fd41cb28754b10ad1584ddb18b1c04",
      "snapshot": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/affected/current/.tmp/ld-s10y-lesson/b60-elastic/artifacts/8p/pages/0200/audit.json"
    },
    ".tmp/ld-s10y-lesson/b60-elastic/work/8p/pages/0200/figures/fig-135.png": {
      "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b60-elastic/work/8p/pages/0200/figures/fig-135.png",
      "sha256": "e35603e71aae592ce0123f276071087eac27e9c929afb39dfc35fb1327ff9b16",
      "snapshot": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/affected/current/.tmp/ld-s10y-lesson/b60-elastic/work/8p/pages/0200/figures/fig-135.png"
    },
    ".tmp/ld-s10y-lesson/b60-elastic/work/8p/pages/0200/figures/fig-135.svg": {
      "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b60-elastic/work/8p/pages/0200/figures/fig-135.svg",
      "sha256": "c443eb674783fa2896d8747dfbe27b560d45d0f0457722db9ff57f0cbf7a62fe",
      "snapshot": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/affected/current/.tmp/ld-s10y-lesson/b60-elastic/work/8p/pages/0200/figures/fig-135.svg"
    }
  },
  "evidenceBindings": {
    ".intentfold/tickets/STEMROBIN-180/tmp/b61-source199200-sole-repair-config.json": {
      "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b61-source199200-sole-repair-config.json",
      "sha256": "fd30846044188a31a70507268a2855bea235af5651fa5a92bf3d9c2d594dda85",
      "snapshot": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/affected/evidence/.intentfold/tickets/STEMROBIN-180/tmp/b61-source199200-sole-repair-config.json"
    },
    ".intentfold/tickets/STEMROBIN-180/tmp/b61-source199200-sole-repair/before.json": {
      "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b61-source199200-sole-repair/before.json",
      "sha256": "a795edacdbb07ac4a4d1152dc3b2d22f32b5f96e82a187f90335519262eab38f",
      "snapshot": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/affected/evidence/.intentfold/tickets/STEMROBIN-180/tmp/b61-source199200-sole-repair/before.json"
    },
    ".intentfold/tickets/STEMROBIN-180/tmp/b61-source199200-sole-repair/comparison.json": {
      "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b61-source199200-sole-repair/comparison.json",
      "sha256": "c0601f93213e78ae7c26c59190595ad88f393f4b765afbd014289a99e417ef87",
      "snapshot": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/affected/evidence/.intentfold/tickets/STEMROBIN-180/tmp/b61-source199200-sole-repair/comparison.json"
    },
    ".intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/inventory-seal.json": {
      "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/inventory-seal.json",
      "sha256": "3ce6b6bd141a2adce39a334c74f90c0fd15a2ece6467620d6113b23671361e05",
      "snapshot": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/affected/evidence/.intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/inventory-seal.json"
    },
    ".intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/sealed-inventory-0199.md": {
      "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/sealed-inventory-0199.md",
      "sha256": "98429d318c930b6b31ec15fde38a08773ec1d0170f8de870459de080f5afdff3",
      "snapshot": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/affected/evidence/.intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/sealed-inventory-0199.md"
    },
    ".intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/sealed-inventory-0200.md": {
      "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/sealed-inventory-0200.md",
      "sha256": "6700816d412a85cf7348fb349055830f7c0c8a6987454a4b25a88274818a0a83",
      "snapshot": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/affected/evidence/.intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/sealed-inventory-0200.md"
    },
    ".intentfold/tickets/STEMROBIN-180/tmp/commands/b61-source199-sole-finalize.call.json": {
      "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/commands/b61-source199-sole-finalize.call.json",
      "sha256": "6871a22b1264e547f9f5746f79cb02490eefd0c725560bfcd39d51e12b744c7e",
      "snapshot": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/affected/evidence/.intentfold/tickets/STEMROBIN-180/tmp/commands/b61-source199-sole-finalize.call.json"
    },
    ".intentfold/tickets/STEMROBIN-180/tmp/commands/b61-source199-sole-finalize.stdout": {
      "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/commands/b61-source199-sole-finalize.stdout",
      "sha256": "dcf5b1651fd56a55d4182694a08b42443c0a678fd020cf3ca9c7541844dedad7",
      "snapshot": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/affected/evidence/.intentfold/tickets/STEMROBIN-180/tmp/commands/b61-source199-sole-finalize.stdout"
    },
    ".intentfold/tickets/STEMROBIN-180/tmp/commands/b61-source199-sole-finalize.stderr": {
      "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/commands/b61-source199-sole-finalize.stderr",
      "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "snapshot": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/affected/evidence/.intentfold/tickets/STEMROBIN-180/tmp/commands/b61-source199-sole-finalize.stderr"
    },
    ".intentfold/tickets/STEMROBIN-180/tmp/commands/b61-source200-sole-finalize.call.json": {
      "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/commands/b61-source200-sole-finalize.call.json",
      "sha256": "36af54603e1ece5dbac92ca84749811712c951c355d7f56de5274e15660f5cea",
      "snapshot": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/affected/evidence/.intentfold/tickets/STEMROBIN-180/tmp/commands/b61-source200-sole-finalize.call.json"
    },
    ".intentfold/tickets/STEMROBIN-180/tmp/commands/b61-source200-sole-finalize.stdout": {
      "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/commands/b61-source200-sole-finalize.stdout",
      "sha256": "ac5159a52eb1175dd10ef83546bd7e4d29f8b3207419f51a13be0598be40cc5c",
      "snapshot": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/affected/evidence/.intentfold/tickets/STEMROBIN-180/tmp/commands/b61-source200-sole-finalize.stdout"
    },
    ".intentfold/tickets/STEMROBIN-180/tmp/commands/b61-source200-sole-finalize.stderr": {
      "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/commands/b61-source200-sole-finalize.stderr",
      "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "snapshot": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/affected/evidence/.intentfold/tickets/STEMROBIN-180/tmp/commands/b61-source200-sole-finalize.stderr"
    },
    "independentAffectedComparison": {
      "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/commands/b61-source199200-review-affected-exact-text-comparison.stdout",
      "sha256": "77fefe75324e7523cff93bdc2641da34e252954a7b15c3ac0b8274cc41b45f9f",
      "snapshot": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/affected/exact-text-comparison.json"
    },
    "currentSnapshotManifest": {
      "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/affected/current-snapshot.json",
      "sha256": "6577ce46eb6766a70b96c97de083671b9022b5ba8e80b62f5047436df72db91a",
      "snapshot": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/affected/current-snapshot.json"
    },
    "originalFirstReport": {
      "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/source-review-8p199200-b61.md",
      "sha256": "af87dfa0b91b6cbb6559b34a2c3cb9bd312a7980963d7f319caef435e1e9df35",
      "snapshot": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b61-source-review199200/source-review-8p199200-b61.md"
    }
  },
  "exactComparison": {
    "mode": "Zero-new-image affected-only comparison against independently frozen FIRST facts",
    "configExactIndependentMinimum": true,
    "comparisonDeclaredScopeExact": true,
    "inventorySealIntact": true,
    "pages": {
      "199": {
        "expectedMdSha256": "dd67c6e313f17ba6f0d9441d150d5a2fd5e7b0571e0d670e134ff847d36e8ee8",
        "expectedJsonSha256": "278be0c19dff4cedbcab6d9bc6598c47b9dee7826c09cc1ad06797afbcb2c347",
        "independentBaselineDumpExact": true,
        "currentMdExactExpectedBytes": true,
        "currentJsonExactExpectedBytes": true,
        "currentJsonOnlyRequiredChanges": true,
        "currentMdMatchesCurrentJson": true,
        "metadataAndAllNontextStructureUnchanged": true,
        "sourcePrintRowsPreserved": true,
        "affectedJoin": "如果物体沿着斜面匀速运动，则 $a_x=0$，即 $\\sin\\alpha-\\mu\\cos\\alpha=0$，或$\\operatorname{tg}\\alpha=\\mu$.　(4)",
        "finalOpenFlag": false
      },
      "200": {
        "expectedMdSha256": "eef94063afe7955c668cb65f41fd4fc75e5f2221bcac2c6d13b74da3843f2380",
        "expectedJsonSha256": "e2d0422668b5c9785060f150b3f3dea8497cac146a696b0d90873f94c918de24",
        "independentBaselineDumpExact": true,
        "currentMdExactExpectedBytes": true,
        "currentJsonExactExpectedBytes": true,
        "currentJsonOnlyRequiredChanges": true,
        "currentMdMatchesCurrentJson": true,
        "metadataAndAllNontextStructureUnchanged": true,
        "sourcePrintRowsPreserved": true,
        "affectedJoin": "如果所有其他的力都忽略不计，则可以认为：在物体开始降落的时刻($v=0$)，物体只受重力 $m\\vec{g}$ 的作用，没有阻力. 但是，物体只要一开始运动，就出现阻力——流体的摩擦力，它",
        "finalOpenFlag": true
      }
    },
    "soleFinalizeReceiptFacts": {
      "199": {
        "commandExact": true,
        "exit": 0,
        "streamsMatchReceiptHashes": true,
        "rows": [
          25,
          25
        ],
        "normalizations": 0,
        "errors": [],
        "repair": {
          "page": 199,
          "maximum": 1,
          "used": 1,
          "remaining": 0
        }
      },
      "200": {
        "commandExact": true,
        "exit": 0,
        "streamsMatchReceiptHashes": true,
        "rows": [
          27,
          27
        ],
        "normalizations": 0,
        "errors": [],
        "repair": {
          "page": 200,
          "maximum": 1,
          "used": 1,
          "remaining": 0
        }
      }
    },
    "figure135ExactGeometry": true,
    "parentInputCount": 35,
    "changedFiles": 4,
    "unchangedFiles": 31,
    "firstReportPreserved": true,
    "newImages": 0,
    "pipelineRuns": 0,
    "gateRuns": 0,
    "repairsPerformed": 0,
    "decision": "ACCEPT_AFFECTED_ONLY"
  },
  "currentState": {
    "changedMDJSONFiles": 4,
    "unchangedParentInputs": 31,
    "parentInputs": 35,
    "currentEightBindingsStillMatch": true,
    "all35StillMatch": true,
    "firstReportPreserved": true,
    "originalFirstDecision": "REVISE",
    "originalFirstNeverRelabeled": true
  },
  "imageLedger": {
    "newImages": 0,
    "existingContextImages": 8,
    "newCrops": 0,
    "newRenders": 0,
    "reopens": 0
  },
  "repairBudget": {
    "199": {
      "used": 1,
      "maximum": 1,
      "remaining": 0
    },
    "200": {
      "used": 1,
      "maximum": 1,
      "remaining": 0
    }
  },
  "limitations": {
    "incoming198": "Supplied FIRST author text only, not SOURCE approval.",
    "outgoing201": "UNKNOWN; preserve p open at 它.",
    "affectedOnly": true,
    "noScientificChanges": true,
    "pipelineRuns": 0,
    "gateRuns": 0,
    "repairsPerformed": 0,
    "newComparisonFailures": [],
    "closingRecorderReceipt": "Written after this seal; excluded from recursive self-hash."
  }
}
```

STOP after this affected-only report. Preserve the original FIRST report exactly.
