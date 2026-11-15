# S9 Final Answer Author Freeze

2026-11-15. STEMROBIN-180. **Three final modern-text-bound author answers frozen for main's independent comparison.** All `derived`, `ungraded`, `parts=[]`; not official cap2 prepare/finalize, independent approval or promotion. All previous21/13/10 drafts and s10's seven derivations remain unchanged.

## Immutable Outputs

| Artifact | Absolute path | SHA-256 |
| --- | --- | --- |
| Final3 author JSON | `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/author-c4-s5-s7/active-s9-final/author-answers.json` | 4561bf7192eace34e4345eb95e3d24fbd6efc735f14e7cb1c42cadf342dfe5d4 |
| Exact input/prompt bindings and preservation evidence | `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/author-c4-s5-s7/active-s9-final/author-bindings.json` | 978c02147e60205fd4a6f7af9acde2dc7ad938b896236cfec6d97a08af7c8d72 |
| Final author handoff | `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/author-c4-s5-s7/active-s9-final/author-handoff.json` | b29385aee6740693aaa6701df32240ae63b8395a5a45eaaddfd0e2ab951381a7 |
| Exact-SVG capture ledger | `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/author-c4-s5-s7/active-s9-final/inspection-captures.json` | 5c707abfca476509a10b8757a1e011db589170edc6e859b5da6db7d63e1d1bc3 |
| Actually viewed140 sheet | `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/author-c4-s5-s7/active-s9-final/fig-140-modern-306-640-sheet.png` | e8a6233140eb56501d836e6eb70854b527e775de187e19ca03d35f5ed592c342 |
| Actually viewed141 sheet | `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/author-c4-s5-s7/active-s9-final/fig-141-modern-306-640-sheet.png` | 296b40df15c0d869b3c2bc004b129e0e5eedcabaa6eeabd25e92f34f2c979944 |

Sheets place the306 capture left and640 capture right at native pixel dimensions, without resizing either. Their respective four standalone PNGs are retained in the same directory and hash-bound in the capture ledger. The ledger's original `captures-created-awaiting-author-pixel-view` status is retained unchanged; subsequent completed pixel viewing is recorded here and in the final handoff.

## Final Text Authority

Fully read the actual durable modern `lesson.json`, `exercises.json`, `figures.json` and existing adaptation audit at:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/lessons/phy6-c4-s9`.

| Final input | SHA-256 |
| --- | --- |
| lesson.json | 4fe68ed01320eb1c0f84c8f9ab43a65b1eefffe4f68a8d77ff2edfd68e252430 |
| exercises.json | 9ee00fcbf9e1d0d64ea523e0e053dcc1c24ca97287e70f91a414ae727ddfe04b |
| figures.json | 8d990b16ec5b7b7ae0b9524cd4305c81d2407ee948285c1843d26bf2f66d14c9 |
| existing adaptation.audit.json | c2ebcbbb61ee6284fb1462cecdcc567704af545a40dd3fa72ade304f1b649747 |

The actual final documents say `ready`; the existing adaptation audit says `pass`. This is a read of main's completed artifact, not an adapt-finalize run by this author. Modern source data/hash still match the authorized raw s9 source. Full modern prose preserves both demonstrations and explicitly clarifies the space below the piston as near-vacuum/low pressure.

Each final prompt is copied exactly, without normalization or trailing-newline hashing:

| Exercise | Exact final prompt UTF-8 SHA-256 |
| --- | --- |
| 1 | 5cfb2b55e23849d7596e2b43e6a8b77731864ef09cf26b8b59a716cd95a1d4af |
| 2 | 76b5d032775e8f65d9c39ef77afd17f4a6c2811fa7c57859051a1f6d170bad4e |
| 3 | cee22f4123315e85793647bfb8771c289144709d6ac0cfa3122b8ec2e0904e1f |

Q1/Q2 prompts and displayed answers are unchanged from the independently derived s9 draft. Q3's final prompt changes only the original sentence-ending `.` to `。`. Group identity remains `g1`, source numbers1/2/3, refs `p0148#4/#5/#6`.

The stable prepare mechanism derives `figureEvidence` only from each exercise's `figure_refs`. All three actual s9 exercises have empty `figure_refs`; final answer items therefore preserve `figureEvidence=[]`. Both lesson-body figures were nevertheless fully read/viewed, with their exact hashes recorded separately as `contextFigureEvidence`. No exercise-figure attachment is invented.

## Actual Figure Inspection

Reopened each complete original PNG individually using `functions.view_image`, then actually viewed each complete final SVG at306 and640 in the two native-size sheets. No previous author preview or independent-review conclusion substituted for those pixels. Fully read both durable FigureSpecs, including source text/inventory, all objects and assertions. No figure-review report or private answer report was read.

| Figure | Original PNG SHA | Promoted SVG SHA | Full spec SHA |
| --- | --- | --- | --- |
| 140 | 1607d873e47e08f16f4eb4c777cae59ec7187d94476b0b223fd8d3d4f1fdd1b9 | fbc3b62fbfaf8e9a3ae9644b130415cef389e5c77e0a3b02ba9baed264679b37 | 5c86e75161116df4891ed707268d4982a64b7798e44f2c9471a6c1634b39d31b |
| 141 | 08ee2794b8dd4008a74f78eb3b72794fd3606cc1cacb0a232a658748a4ce4825 | ddf4363fc8369d336e36a290be3882b083ecae72994aa2cb5d24546c9a76fd39 | 94a316db716cdc12d4739eff601b875e4395a9e6bd568f35c846b1b96a8c2b9c |

140: source shows a raised tight piston with centered rod/handle, open lower pipe immersed in the outside water, higher inner water, one upward piston arrow and two downward external-air arrows. The final306/640 image visibly preserves these relationships, the small low-pressure gap below the piston and the complete water vessel. Source hatching is regularized to fill; no height/pressure reading is inferred from drawn proportions.

141: source and final image show a closed rounded vessel with one pierced stopper, a single continuous submerged pipe, an intermediate stopcock/right control, upper outlet and an internal rising fountain. The lower intake remains above the reservoir base. The fountain's spray is regularized, not an exact measured droplet count. No pump, second port, pressure setting or second state is silently added. The pump belongs to the written prior-evacuation procedure, not a simultaneously visible component.

Both figures have no text labels or scales; this inspection does not manufacture label values. The modern sheets use the exact promoted SVG's neutral defaults only. Main's prior three-theme figure approval is neither rerun nor represented as this author's own independent approval.

## Complete Q3 Method

The new final candidate retains the initial draft's two original experiments and pressure-difference mechanisms, not mere names or a generic response:

- 140: submerged opening kept clear of the base, tight piston slowly raised while the opening stays underwater, expected inflow and raised inner water, and why the low-pressure space allows outside air to push water in. A needle-free plastic syringe is explicitly a safer simple substitute for the piston demonstration, not a claim about the original apparatus.
- 141: teacher-operated purpose-built reduced-pressure apparatus, prior partial evacuation, close the valve before disconnecting the pump, immerse the pipe, open the valve, and observe water entering/upward spray. Explain the single flow path and outside/inside pressure difference; do not claim continued pump suction or perpetual spraying.

Safety language is an explicit author addition requested for the method: room-temperature water, no mouth suction, teacher handling of glass/vacuum equipment, no improvised ordinary glass-bottle evacuation. Without rated equipment, narrate the second experiment rather than perform an unsafe substitute. No experiment is claimed actually performed; no pressure/height number is fabricated. The source requirement to narrate experiments is retained with full steps, expected observations and mechanism.

Q1 still defines the atmosphere, not its pressure value. Q2 still explains the gravitational air-column context and all-direction pressure, without falsely claiming gases have no pressure without gravity. No historical entity is added to an answer whose corresponding prompt has no such name.

## Commands And Status

Read current cap2/gate2 and the local figureEvidence field mechanism only. Existing project `playwright-core` was used for an exact-SVG screenshot task, not the figure renderer or a test suite:

```bash
node .tmp/ld-s10y-answer/author-c4-s5-s7/active-s9-final/inspect-final-figures.mjs
/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/ld-s10y-answer/author-c4-s5-s7/active-s9-final/make-inspection-sheets.py
/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/ld-s10y-answer/author-c4-s5-s7/active-s9-final/freeze-author-handoff.py
```

Each ran once, exit0. Actual media widths were306/640; four isolated contexts closed, one headless Chrome process closed. `PWDEBUG` was unset, HTML auto-opening disabled, all network requests blocked; no user profile, CDP, visible window, OS input or desktop activity. Browser capture session44265 completed before freeze; no owned session remains.

The PIL command only placed existing pixels on sheets. The author-freeze command checked exact final input/prompt identities and unchanged previous snapshots; this is not official cap2 validation, independent review or product/runtime grading. No browser/figure repair retry occurred. Two preliminary local dependency/script path lookups found no files; correct existing `.agents/skills/package.json` and `scripts/render_spec.mjs` locations were then read without creating or modifying tools.

Actual task usage: two original image opens, two modern sheet pixel opens, four exact-width captures, one headless browser launch, separate model/image/service calls0, renderer calls0, formal prepare/bind/finalize0, tests0, new dependencies/environments0. No authoritative cumulative token meter is available. Only this new answer scratch and this new ticket report were written, manually through `apply_patch` or isolated structured evidence generation.

All previous frozen21/13/10 answers, per-lesson s9/s10 initial handoffs and earlier reports matched their recorded hashes before and after the final author freeze. No main/private answer-source, old key, choice, solver, interaction or answer-history evidence was read. No source, figure, durable edition, index, app, DB, publication, Git, schema or stable tool change.

## Remaining Boundary

Final s9 author freeze is ready for main's independent comparison and official cap2 handling; `approved=false`. Do not treat this author handoff as independent PASS or publication permission.

S10 remains a separate seven-task raw-derived immutable draft. No final s10 freeze, modern143–145 read or binding was attempted while those figures are still being authored. Deferred s5/s6/s7 remain untouched and unbound. No in-flight owned session; stop after this handoff.
