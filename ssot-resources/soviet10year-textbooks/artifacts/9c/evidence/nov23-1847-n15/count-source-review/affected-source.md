# Affected source63: Text-only delta confirmation

Date: 2026-11-23. Ticket: STEMROBIN-184. Finish: review.

**Source/body: PASS. Recorded native audit: PASS21/21. Metadata: QUALIFIED.**
The sole count-exclusion entry is exactly the approved bottom-edge box.
However, the literal claim that this is the only page-metadata change is
**not confirmed**: `profile.sha256` also changed. That qualification is not a
body/source discrepancy and does not negate the observed audit21/21.

## Scope and Method

Sole cwd: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

Baseline triple:
`ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n15/first-native-0063/{page.md,page.json,audit.json}`.

Current triple:
`.tmp/stemrobin-184-six/n15-nov23-recovery/raw/9c/pages/0063/{page.md,page.json,audit.json}`.

Compared the complete saved files using textual diffs, exact MD body bytes,
and complete JSON structures. Parsed both JSON frontmatters and checked them
against their respective page JSON metadata. This was a file comparison,
not a count/diagnostic, test, or finalizer rerun. No pipeline/shared-helper
module was imported, executed, or generally reviewed.

The parent reports six focused synthetic cases and a source-hash-bound page
case passing21, the narrow `_single_body_with_edge_fragment` affiliation
helper, title band615-695 with UNKNOWN marginal ink retained, and one actual
affected native finalizer run. Those tests, band allocation, helper behavior,
and invocation details were not independently rerun or audited here. This
confirmation reads the actual resulting raw triple.

## Complete Body and Blocks: Unchanged

- MD body, including all block headers, body lines, mathematical source,
  figure references, flags, captions, footer, whitespace and line breaks, is
  **byte-identical** after the closing frontmatter delimiter.
- Old and current MD body SHA-256:
  `5fdc7af0ff84d27f6038eba1ae3629a0ebff68f7e762e968488a626c43ee0696`.
- The complete JSON `blocks` arrays are equal, with **12 blocks** in each.
  Equality includes every block field and ordered line, not just block counts.
- Old and current canonical JSON block SHA-256:
  `36624c1467363516ffaba5bb1c21bd2cf51e742af2b2261711688eb8075a283d`.
  Hash serialization: UTF-8 JSON, sorted object keys, compact separators,
  non-ASCII text unescaped; array order preserved.
- Existing `cont`, `open` and caption2 `samerow` ownership is unchanged.
  No body wrap, count override, source correction, or invented row was added.

## Complete Page-Metadata Delta

MD frontmatter matches page JSON `meta`, both before and after.
Exactly two top-level metadata fields differ:

1. **Approved exclusion addition.** Previously absent in page metadata; now
   exactly one entry, identical in current MD, JSON and audit:

   ```json
   {
     "kind": "scan-artifact",
     "box": [162, 2369, 426, 8],
     "reason": "Independently inspected interrupted extreme-bottom scan-edge trace, separate from footer56 and all body, diagram and caption ink."
   }
   ```

   There are no other entries: no UNKNOWN right-margin blot or interior-stroke
   exclusion, no body/formula/footer/caption exclusion, and no separator-rule
   substitution. This confirms the exact approved exclusion's metadata scope,
   not new pixel or algorithm verification.

2. **Additional profile hash update.** Profile id remains `soviet-cn`, but
   `profile.sha256` changes from
   `dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849`
   to
   `19d56195a3a63cf4be93a7a159e1513d37b9b17d1b92235d8ae3d4e826cc45d0`.
   This is explicitly additional metadata beyond the exclusion. Its cause,
   profile contents, and approval are outside this bounded delta comparison;
   no profile or shared algorithm was inspected or edited.

All other metadata is equal, including source PDF identity/hash, render
identity/hash/dimensions/DPI, `printed_page=56`, `printed_lines=21`,
all seven historical notes, empty errata, provenance and complete figure
metadata. Historical notes were preserved, not rewritten as descriptions of
the new parent invocation.

## Figure Geometry and Actual Audit

Both page metadata and the complete audit figure arrays are unchanged:

| Figure | Exact box [x,y,w,h] | Audit components | Audit original coarse box |
| --- | --- | --- | --- |
| fig-01 / caption1 | `[158,1449,1209,125]` | 41 | `[150,1450,1230,145]` |
| fig-02 / caption2 | `[842,1712,532,327]` | 25 | `[840,1690,540,365]` |

The complete audit has exactly these three changed fields:

- `lines_printed`: **22 -> 21**.
- `count_exclusions`: `[]` -> the single approved edge entry above.
- `errors`: the one historical22/21 mismatch -> `[]`.

Current on-disk audit records **`lines_printed=21`, `lines_md=21`**,
two unchanged figures, `normalizations=[]`, `unknown_chars=[]`,
`katex_warnings=[]`, `errata=0`, and `errors=[]`.
All remaining audit fields are unchanged. This confirms the actual saved
PASS21/21 audit; it is not a new finalizer invocation.

## Current Hash Binding

| File | Baseline SHA-256 | Current raw SHA-256 |
| --- | --- | --- |
| page.md | `09a74438caf405a0edf967a643f7a608e9decd682767dbcee49107e45fe9673c` | `fe20f7f26261cee6f813087c908a2f1dd084befa2c8743483432ba5be5eddaee` |
| page.json | `52b2807616b29845fd58360f476a4e221b8ceaafd65df2c7bd5e9a71474c54d6` | `022448794dd924e3a730e01d4600d6c4cfee1eacb3982636bbb80fd3171de2f7` |
| audit.json | `f9562a7adab70bbf98e2b099cfeef450dfc3cc9a5d8a730ad0282f71d6425de1` | `7bc29eafdbb3a6c44697854b271caa69d649d5dd63deb028550d9cfb24476eff` |

Original prepared PNG was hashed as bytes only, with **no image decode/open**:
`.tmp/stemrobin-184-six/n15-nov23-recovery/prepared/9c/pages/0063/page.png`.
Actual SHA-256 remains
`d6720e9e360c2e4ffd71e19c4e558b51828ee09b20cc7db8ce695c71b7bb63e9`,
and the old/current render metadata binds that same source. Its source pixels
were not rewritten.

## Previous Evidence Preserved

The prior six owned files were only hashed, never modified:

| File | Unchanged SHA-256 |
| --- | --- |
| source-first.md | `d49fd41f80ee42a3ae2b324aab05cfc3b6358a862de16d0a485f223a5c4a2130` |
| count-source.md | `05e036a39a871357b2c7e8f669552a015d31fbaa2c2ca077d4e4e2c05782d656` |
| numeric-count.json | `6d29f3a8e5ac49982fe6743d3d62f0adef53512a1661a15434697157656281c7` |
| inspect-count.py | `eda07600bce1e043ebdd39615ac9fe50bc97edf5cd4c2bf28a60931dad56070b` |
| title-and-right-margin.png | `3da1d1d81e3b06eb96231511470a9c2f466a9931b93eb2db9fdb3c7547f8c35f` |
| lower-caption-footer-edge.png | `3aabef6cc02e94fd309abd313d226c0e7b770660067680b998b802b4294153c0` |

This new affected record does not rewrite the earlier historical HOLD or its
then-current23 observation. It confirms the new saved source/body and audit
state, with the additional profile-hash metadata delta disclosed.

## Boundary and Stop

**ZERO new images or crops; final cumulative model image total remains 3.**
Only this new `affected-source.md` is owned/written in this continuation.
No source, baseline, prior report, pixel, metadata, exclusion, shared helper,
Git, DB, .env, app or dependency edit/action was performed. No count,
diagnostic, finalizer, prepare, assembly, promotion, test, browser, agent,
chat or message was run.

This is **not whole-N15 source/modern-edition/display approval**, not unit16
completion, not adjacent-page closure, and not general shared-algorithm
approval. The scoped source/body and saved native audit pass; strict
edge-only page-metadata wording remains qualified by the profile SHA change.
Stop after this affected delta confirmation.
