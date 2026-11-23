# Independent Gate 2 lesson-answer review

Date: 2026-11-23. STEMROBIN-180, 8p, phy8-c2-s1-n25.
Exact cwd: /Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180.
Edition: modern-us-neutral. Sole independent semantic reviewer.

## Verdict

**Gate 2 independent answer PASS: 7/7 current derived drafts.**
No necessary answer correction or unresolved semantic evidence issue was found.
This does not claim answer finalization, runtime/editor validation, publication
or whole-lesson display approval.

Authority: `.claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md`.
The seven independent source solutions were frozen before any author answer
values were released and remain read-only and byte-identical. They are reused,
not rewritten to agree with keys. Only the current modern `answer-keys.json`
and `exercises.json` were opened for answer comparison; no old answers,
interactions, author-solving notes or figure assets were read.

## Identity And Completeness

All seven `answers[].exercise` identifiers are unique and match current
`exercises[].number` and `source_number`. Every answer `prompt` exactly matches
its current exercise text. There is no missing or duplicate exercise.
Every answer has `source: derived`; none has `bookRaw`. The source classification
therefore does not present a model-derived answer as an unverified book answer.
All exercises have no figure references, agreeing with empty `figureEvidence`.
No new image inspection is required or permitted in this phase.

## Per-Answer Findings

All references below are in the current modern `answer-keys.json`.

| Exercise and exact answer refs | Independent comparison and result |
| --- | --- |
| 1: `#/answers/0/displayAnswer`, `#/answers/0/grading` | PASS. The negative answer is explicitly limited to ordinary finite interaction: a finite velocity change takes nonzero time. It agrees with frozen source 1 and does not mistake an ideal impulse approximation for an actual zero-time physical change. Ungraded is appropriate for the explanatory response. |
| 2: `#/answers/1/displayAnswer`, `#/answers/1/grading` | PASS. Inertia is resistance to changing the original motion state; absent a state-changing net force, rest or uniform rectilinear motion persists. The property and its observable consequence match frozen source 2. No fictitious inertia force is introduced. Ungraded avoids unreliable wording-based judgment. |
| 3: `#/answers/2/displayAnswer`, `#/answers/2/grading` | PASS. Mass, not speed, measures inertia; greater mass resists velocity change more under the same action. This matches frozen source 3 in the accepted ordinary low-speed context. Ungraded is legitimate for natural-language quantity naming/explanation. |
| 4: `#/answers/3/displayAnswer`, `#/answers/3/grading` | PASS. The two-body-only and nonzero-acceleration conditions are explicit. The equation is exactly `|a1|/|a2|=m2/m1`, not its reciprocal or signed vector division. The heavier body has smaller acceleration magnitude, matching frozen source 4. A relationship explanation is appropriately ungraded. |
| 5: `#/answers/4/displayAnswer`, `#/answers/4/grading` | PASS. The known mass standard, interaction and both acceleration measurements are stated. `m_body=(|a_std|/|a_body|)m_std` has the correct ratio direction and scale. Weighing is identified as a practical alternative rather than a mandatory universal method, and inaccessible celestial objects are addressed. This matches frozen source 5; ungraded is appropriate for a method explanation. |
| 6: `#/answers/5/displayAnswer`, `#/answers/5/grading` | PASS. SI kilogram and CGS gram are correctly associated; `1 g=0.001 kg` is exact, and newton is correctly excluded as a force unit. This answers the single conceptual units question completely, matching frozen source 6. The additional conversion is not a separately missing requested subproblem. Ungraded avoids rejecting synonymous unit wording. |
| 7: `#/answers/6/displayAnswer`, `#/answers/6/grading`, `#/answers/6/parts/0` | PASS. The signed changes are +50 and -50 cm/s over the shared collision interval, agreeing with frozen source 7. Equal interval-average acceleration magnitudes combined with the two-cart mutual-interaction relation give equal masses; uniform acceleration is not required. The explanation ties the comparison to that common interval, not to equal final speeds alone. Display states both `m1:m2=1:1` and `m1/m2=1`. The first-to-second ratio label is unambiguous and the one dimensionless numeric expected value `"1"` is correct. |

The collision explanation is evaluated within its expressly stated two-cart
interaction model. Equality of endpoint velocity changes by itself is not a
general proof of equal instantaneous accelerations for arbitrary unrelated
forces; the common-interval and mutual-interaction reasoning is essential
and is present here. No relativistic-mass or current-SI-definition claim was
silently substituted into these ordinary-motion answers.

## Gate 2 Grading And Display

- Six conceptual/explanatory answers are `ungraded`, with complete
  `displayAnswer` and no fabricated automatic expected text.
- One numerical result is `auto`, using one `numeric` part. The student can
  enter the dimensionless ratio value `1`; explanation and units are not
  mixed into `expected`. Display also supplies the ratio and fraction forms.
- No exercise contains separately requested numerical subparts left unsplit.
  The cart has one requested ratio and one labeled part; definitions and
  methods are complete open responses rather than hidden judge subparts.
- Exact candidates: **0**. Expression candidates: **0**. Numeric candidates:
  **1**. Gate 2's mandatory real MathLive edit transaction for `exact` is
  therefore not applicable. No setter-only or self-string comparison was
  passed off as editor evidence.
- Seven `displayAnswer` fields provide the answer and, where needed, the
  conceptual reason, measurement method or collision calculation.

## Bindings And Limits

Current key SHA-256:
`4c5991279acf599f34517831d0429606d1d392207cdca419db483a69abc29e18`.

Current exercises SHA-256:
`9ced942285efd9ba91fdc6823594e1c0eea3a287124f5b984c8b10e481a231b0`.

Reused independent source-freeze SHA-256:
`e1165e8e237944a7cfd4dc83902ceaa87f3bdfd175a5c2b99f66bc609a059f07`.

`answer-binding.json` binds these precise current inputs and this report.
The keys remain `status: draft`; no answer was edited. The parent owns
subsequent answer finalize, retention, whole-lesson display and save.
No finalize/publish/DB/Git/install/browser, new agent or peer message was used.
No passed source, whole-text or figure review was replayed.

Actual new images in this combined comparison/answer phase: **0**.
Existing figure-batch usage remains **8/8**, with no source/output reopen.
