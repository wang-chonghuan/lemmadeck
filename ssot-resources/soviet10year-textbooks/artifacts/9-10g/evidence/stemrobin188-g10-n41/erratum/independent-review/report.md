# N41 Independent Modern Text Review

**Verdict: pass.** Full modern text preservation and the single source-bound NSD-to-NSB correction are supported. Native erratum registration/current hash binding is still pending. This is not a finalization, modern-figure, answer or publication approval; there is no genuine mathematical HOLD or additional human approval gate.

STEMROBIN-188 / 188-6, 2026-11-20. All writes are confined to this new review directory. No candidate, source, core or author report was edited.

## Source First

Before reading any modern candidate or author determination, I read all 17 raw prose objects, all 14 raw exercises, p0141's faithful text, and opened the actual core originals fig160 and fig161 once each. I independently derived the included angle and constructed an exact counterexample, then saved `source-first.md`. Its SHA256 is `cd20dc6408d2f7b97f8da160d447a7c3c030222925d702efd112b556e2e78377`.

With SD = SN = r > 0, cosine law at S gives:

```text
DB^2 = SB^2 + r^2 - 2 SB r cos(alpha)
NB^2 = SB^2 + r^2 - 2 SB r cos(NSB)
DB^2 - NB^2 = 2 SB r [cos(NSB) - cos(alpha)] > 0.
```

The included angle of triangle BSN is BSN = NSB, not NSD. Hence `cos(alpha) < cos(NSB)`, NSB < alpha, and gamma = beta + NSB < alpha + beta. My independent example has beta = 120 degrees, gamma = 150 degrees (largest), cos(alpha) = `(sqrt(3)-sqrt(2))/4`, cos(NSD) = `(1-sqrt(6))/4`, and cos(NSB) = `sqrt(3)/2`: the printed NSD inequality is false, while the corrected one is true. All construction conditions, the interior AB intersection, SAS equality and DB > NB were checked. Details precede the author comparison in `source-first.md`.

Image ledger: 2 opens out of the authorized maximum 3; no crop, reopen, modern image, or full-page image. The third allowance was unused. Existing page/crop binary hashing did not display images or repeat approved pixel transcription.

## Preservation

The reviewed window is **p0140#5 inclusive to p0143#9 exclusive**. Exact already-approved source fidelity was reused from `source141147-affected-review/review.json` plus the two first source reviews; current page, lesson and original figure bytes match their bound evidence. No whole-page transcription was rereviewed.

- All 17 prose objects pass: 13 paragraph blocks, figures 160/161 and both captions; every `source_text` and `source_refs` matches raw data, all raw text matches the reviewed page stream, and each content source reference occurs exactly once.
- All 14 exercises 391-404 pass: every value, symbol, star, qualifier, subpart, group, source number and figure reference is retained. Exercise provenance uses the existing `pages` field, preserved exactly; none were replaced with invented `source_refs`.
- `source.data`, `source.path` and `source.sha256` match the actual raw lesson/exercises. Raw p140-p143 MD/JSON/audit and assembled lesson/exercises remain unchanged and match the private assembly copies.
- Cross-page joins p140#8+p141#1, p141#11+p142#1 and exercise397 p142#13+p143#1 remain complete. The subsequent review heading and exercise405 onward are excluded. Historical p143 local-number uncertainty metadata is retained; full reviewed assembly uniquely binds its continuation to 397.
- Deleting layout newlines reproduces every raw text string exactly, except the one supported right-hand cosine D-to-B change in **zero-based prose[3]**. Its faithful `source_text` still contains NSD. Numeric/historical change lists remain empty.

Against `lesson.template.before-math-layout.json`, the complete structural diff is exactly `/prose/3/text`, `/prose/3/changes/1` (`math-correction`), and the four added `/section_breaks/0..3` objects. There are no other substantive changes.

## Existing Boundaries

I read the existing `edition.normalize_lesson_layout` preview and `prose_flow` output, not rerun either producer. The preview structurally equals the current candidate; all 15 final paragraphs and their text/order match. Saved stderr is empty.

| Resolved Index | Concept Switch |
| --- | --- |
| 4 | Theorem24 proof ends; corollary begins |
| 6 | Corollary explanation ends; theorem25 begins |
| 10 | Theorem25 proof ends; trihedral existence conditions begin |
| 11 | Trihedral existence discussion ends; convex polyhedral properties begin |

All four `{before, after}` markers equal the tool's exact adjacent paragraph texts, not hand-calculated prose-block offsets. The theorem25 proof's three final paragraphs remain together; figure/caption objects remain preserved.

## Author Read Last

Only after saving the full pre-author preservation evidence at `2026-11-20T03:45:13.715Z` did I read the author's four requested files. The symbolic proof agrees with my prior derivation. I recalculated its rational witness independently: determinant 16/25, gamma largest, SD² = SN² = 1/4, AD² = AN² = 5/4, DB² = 173/100 > NB² = 45/100, cos(alpha) = -12/25, cos(NSD) = -3/5, cos(NSB) = 4/5. Thus its printed inequality is false and corrected inequality true. The valid tie-case explanation introduces no second text correction.

The author's old extra-human-approval/HOLD statements remain byte-for-byte in its report and proposal as historical evidence. They are not a new human directive. The current direct authorization permits source-bound deterministic correction after independent evidence and requires no additional human approval gate.

## Native Erratum

Exact supported native registration fields:

```json
{
  "id": "p0141-math-n41-nsd-nsb-1",
  "block": "p0141#2",
  "original": "$\\cos\\alpha<\\cos(\\widehat{NSD})$",
  "reason": "p0140#8 defines D on SC and SD = SN; fig160 identifies alpha as angle CSB = angle DSB. Cosine law in the stated triangles BSD and BSN gives DB^2 = SB^2 + SD^2 - 2 SB SD cos(alpha) and NB^2 = SB^2 + SN^2 - 2 SB SN cos(angle NSB). Since SD = SN > 0 and p0141#1 gives DB > NB, subtraction forces cos(alpha) < cos(angle NSB), not cos(angle NSD). On [0, pi], cosine is strictly decreasing, so the already printed conclusion angle NSB < alpha follows. No incidence identifies angle NSD with angle NSB; an exact nondegenerate example satisfying gamma maximal makes the printed NSD inequality false. This is a source-bound mathematical printing-error proposal, not a typography guess or a source-transcription change."
}
```

Supported modern `corrected`: `$\cos\alpha<\cos(\widehat{NSB})$`, target `lesson.prose[3]`. The original occurs once in p0141#2; the corrected formula occurs once in the modern target and the known original is absent there.

Current native `meta.errata` and modern `lesson.errata` are both empty. The authorized owner must register the four metadata fields while keeping every raw prose character, then obtain the modern record through the native deterministic registry with the **actual post-registration page.json SHA256**, target, original and exact reason. Current p141 JSON hash `ff61d15d61f12cca27fdf3bfd8ec6a718501f803b3fa9d9a6deab45bed162760` is a **pre-registration** digest, not a future registry digest. I did not register or finalize.

## Evidence

`mechanical-evidence.json`: 357 assertions pass with per-object results for all 17 prose objects and all 14 exercises. `author-comparison.json`: 108 assertions pass, including all 71 pre-author input hashes still unchanged and all eight author-source hashes. No assertion failed.

`input-bindings.json` contains 83 actual SHA256-bound input/evidence files with absolute paths, roles and byte counts. Its SHA256 is `77118b1f00b5014a9af80db5af69f79c67d40a877982a8acabc0852f3fc5d338`.

Late shared-worktree check at `2026-11-20T03:49:06.135Z`: 82 of those 83 files remain unchanged; only the read-only tooling input `edition.py` changed concurrently, from reviewed hash `daf768643043cdbb222c360b7b464b2f213904ca4ec6f4e35cbe7346f83e3cf6` to observed hash `b8b28d7ec38967e9371289ef9da12a94d95342d4a53f50f3b509277ab4e139d5`. I preserved the historical input manifest, read the current relevant registry/validation entry points, and recorded `late-input-drift.json`. They still require the exact native fields and actual post-registration page hash. All source, candidate, figure, author and reviewed evidence bytes remain the reviewed versions. The initial final hash assertion detected this drift and failed; it is not a mathematical HOLD. No rerun or approval of the concurrent tool changes is claimed, and the hash-bound content verdict remains pass.

| Key Input | Actual SHA256 |
| --- | --- |
| Raw lesson.json | `ff0038a25c7bb25600b58c6ebbb128f56283aab342349fe915e76d49f4577acc` |
| Raw exercises.json | `1bb2d3d4533d61bdad4f0ea17cf5e08df0c6b48bd7352977775c38a965e02017` |
| Modern lesson.template.json | `b9f58d8518d5f7d6689339adc0a8dc54197fc2306b987891584bd980e82529ec` |
| Modern exercises.template.json | `d6e5da40527be6ae4edb046f84065da51773ee5befaebca09edd9446fca8a145` |
| Existing normalized-preview.json | `d4a7d68c681f56bd867aa9dcbae55ae9103060914af387fce73a0322e8285e88` |
| Existing prose-flow stdout.json | `c19eab4f9a5431808a31ba4c396ccc35cdd0f97e41a2c82750d436cb9c1e7836` |
| Author report.md | `959d84023bf32049f13c70ef5da8eac4d7b767e9f9f65da3a1bb4f6e549fc145` |
| Author report.json | `0666afb34b6320d187fdbb8d7acee245cff5eb85af16e5994a7cc1786a55323f` |
| Author erratum-proposal.json | `865282e0f88e0f3a72fbe4f2419933741183f2bdc87d4bea505f4fb025fd6225` |
| Author input-bindings.json | `10863dfab8547200fe0b1c0a6d5642b208e822559d0a1abf8d5356ec6a909f86` |

No answer lookup, modern-figure review, DB/backend/network/model/paid/env/git operation or other-agent message occurred. No normalize/prose-flow/finalize/assemble/adapt-finalize/render/publish command was rerun. Unrelated HOLDs were not examined or lifted. One read-only `rg` call named a nonexistent historical `report.md`; the actual historical `review.json`/`review.md` names were used afterward. This inspection error caused no mutation and is not a scientific HOLD.
