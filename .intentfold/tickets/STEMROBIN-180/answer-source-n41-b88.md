# B88 n41 Independent Source Solution Freeze

Ticket: STEMROBIN-180. Invocation: invocation180-3.
Workspace: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Status: all five original exercises independently solved and frozen; STOP before author-key comparison.
Provenance: derived reasoning only. This is neither modern answer authoring nor choice authoring.

## Frozen Artifact

Exact original exercise texts, identities, source references, assumptions, reasoning, solutions, and input hashes are frozen together in this new file:

`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b88-n41-source-solve/invocation180-3-source-solutions.freeze.json`

Freeze SHA-256:
`d834286dfee484bbd15ee15dd402e53be59402b140cf9c4799e0a995a8f651e6`

## Source Authority

- Raw lesson: `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c2-s2-n41/lesson.json`
  SHA-256: `acc0a3837f8e83d19105f04c0b1f2af638ef412414fe73306082dd2eadc6e4a5`
- Raw exercises: `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c2-s2-n41/exercises.json`
  SHA-256: `6b344ad5fe8784371f85081f42290c1e3f3620a9c60e98802a8c9db29170f0c0`

Read the required `ld-s10y-answer/SKILL.md` and gate-2. Applied source identity, complete derivation, units, assumptions, and provenance checks to this source-only assignment. No production gate pass is claimed.

Every raw exercise has empty `figure_refs` and `figures`. No exercise figure is referenced. No lesson, coefficient-table, or example image was opened. The listed lesson images cannot supply unseen data.

The assignment reports no `answers.json` found. This invocation did not search for or inspect book answers. This is not evidence that the printed book omitted answers; no captured-book-answer or `bookRaw` claim is made.

## Independent Observations

1. Q1: Under the ordinary undisturbed level-floor model, static friction on the table is zero. For the table alone, the floor's normal reaction balances its weight, and the horizontal external resultant is zero. A stationary table could instead have nonzero static friction if an additional horizontal load created a tendency to slip. Normal reaction and weight act on the same table and are not a third-law pair; their reaction partners act on the floor and Earth.
2. Q2: Newton's second law is not violated. For the bookcase alone, the child's push is balanced by external floor static friction; normal reaction balances weight. The external resultant is zero, so acceleration is zero. The bookcase's force on the child is the third-law partner of the push, not the floor friction; it acts on the child. That push/reaction pair is internal only to a combined child-plus-bookcase system.
3. Q3: Raw wording leaves starting, ongoing sliding, and speed behavior ambiguous, and gives no numerical mass, coefficient, or force direction. Conditional on a horizontal force on a stationary level plane with `N=mg`: start from rest requires `F>mu_s*mg`; steady sliding requires `F=mu_k*mg`; increasing sliding speed requires `F>mu_k*mg`. Equality with maximum static friction is an incipient-slip limit, not guaranteed starting. An already sliding object can temporarily keep moving with a smaller force while slowing.
4. Q4: The source gives `m=20 kg` and constant velocity but no applicable wood/floor coefficient in the permitted text. Conditional on horizontal pushing, level sliding, and no other resistance, `F_required=mu_k*(20 kg)*g`. No unconditional numeric key is justified; neither an unrelated prose example nor an unopened table supplies the missing coefficient. For a larger aligned horizontal force with unchanged normal load and coefficient, `a=(F_new-F_required)/(20 kg)>0`, so speed increases. Acceleration is constant only if those parameters remain constant.
5. Q5: Given `600 N`, `mu=0.005`, and empty sled mass `100 kg`, the requested quantity is maximum cargo WEIGHT. Under constant-velocity horizontal sliding on level snow, `600 N=0.005*((100 kg)*g+W_c)`, hence `W_c,max=120000 N-(100 kg)*g`. Choosing `g=10 m/s^2` gives `119000 N`; choosing `g=9.8 m/s^2` gives `119020 N`. The `11900 kg` cargo mass at `g=10` is a different quantity, not the weight answer. The steady-load equality does not guarantee starting from rest: starting requires exceeding maximum static friction, whose distinct coefficient is not supplied.

## Conventions And Checks

SI units: mass in kg, force and weight in N, `g` in `m/s^2`. None of the five raw exercises specifies `g`; both numerical conventions above are solver choices, not source givens. The lesson approximately equates maximum static and sliding friction; the freeze keeps their start/slide roles distinct.

Verification completed after the freeze was written:

- Both raw input SHA-256 values matched the frozen hashes.
- All five frozen texts, numbers, source numbers, groups, group IDs, and source references matched the original exercises exactly; no missing or duplicate question.
- All five derivations are explicitly `derived`, and no exercise image is required by the raw references.
- Q4 retains a null numeric key; Q5 conditional weight arithmetic and the separate `g=10` mass conversion were checked.
- The JSON artifact was checked only for source-freeze integrity; no product normalization, grading parser, prepare, finalize, or publisher was used.

Only the new freeze file and this report were written. No modern candidate, answer key, choice draft, or prior ticket report was inspected. No candidate or canonical file was modified, and no freshness/setup/backend, app/dependency/database, image/paid-call, publisher, Git, or other-chat operation was performed.

Independent source solution stage ends here. Any later comparison requires a separate assignment from the parent.
