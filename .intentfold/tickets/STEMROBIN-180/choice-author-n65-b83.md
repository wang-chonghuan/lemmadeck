# B83 n65 offline choice-author handoff

Ticket: STEMROBIN-180/180-3.
Checkout: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Status: authored candidate complete; one standard structural validation passed.
Semantic approval: NOT PERFORMED. Parent independent combined answer/choice
review remains required. No self-semantic review or approval is supplied.

## Exact artifact paths

The author owns only this report and the following scratch directory:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b83-n65-choice/`.

- Seed:
  `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b83-n65-choice/seed.json`
- Draft:
  `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b83-n65-choice/draft.json`
- Frozen pre-option author solutions:
  `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b83-n65-choice/source-solutions.freeze.md`
- Validation receipt:
  `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b83-n65-choice/validation.md`
- Actual commands:
  `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b83-n65-choice/commands.md`

File-byte SHA-256:

- Seed: `f79af6c1d14ea2ca8a0173859e89cf6c13238651cfe16981fd4cb6097235fc2a`
- Draft: `bca8e9239ee6b45c06b7dedcf1743295db21afe3b2fdf74c0351f36bf2137e4d`
- Frozen solutions: `86d471e6c9a17ca98bf60ecdef3a76dddae3c9c2faec545f58b1efa1905c7247`

Canonical JSON snapshot SHA-256 for review binding:

- Seed: `0417d9eb40bb0e727181f9b265ab07ebd356e25edc578e1e43b95cc6dd127e61`
- Draft: `8def48c7518499a74d67ee3454582877b17de1f5374bcf6acab6dcf3464496e8`

## Authored units

Nine original written source tasks exist. Eight are selected: 1, 2, 3, 4, 5,
6, 7, 9. The draft has five questions and 21 options:

| Question ID | Sources | Native mode | Options | Response unit |
| --- | --- | --- | --- | --- |
| n65-energy-and-work | 1, 2 | single | 4 | Complete energy-definition and energy-change proposition |
| n65-work-sign-and-direction | 3, 4, 5 | multiple | 5 | All valid work-sign and direction-information conclusions |
| n65-successive-force-stages | 6 | single | 4 | Both final energy and final speed after both stages |
| n65-stopping-train-work | 7 | single | 4 | Signed stopping work together with its magnitude |
| n65-circular-force-and-work | 9 | single | 4 | Force magnitude, direction, and work on any arc |

Each option has an internal derivation; each incorrect option has a concrete
mistaken procedure. Response units are complete assertions/results, not
answer-slot fragments or arbitrary pair codes. Only `view` is learner-facing.
Internal keys and author solutions are not a client payload.

## Source fidelity and interpretations

Definition-only paragraph indices: 8, 9, 10, 12, 13, 15.
No solved train example or diagram-dependent definition is selected.
All selected source exercise figure references are empty.
Seed figures, concept figures, new figures, and actual opened images: all zero.

The eight frozen source solutions were reused unchanged before alternatives;
no source solve or semantic review was repeated after the scope clarification.

- Sources 1 and 2 are combined around energy as a state and work as its change.
  A disclosed symbolic nonzero-initial-speed situation makes that distinction
  substantive; no original numerical datum is changed.
- Sources 3 and 4 explicitly use resultant/total work, consistent with the
  lesson's theorem, rather than the sign of one isolated force's work.
- Source 5 explicitly keeps direction-only information insufficient. Equal
  speed and equal energy are conditional, never inferred just from a turn.
- Source 6 retains 40 N through 3 m, then 20 N through another 3 m, the same
  3 kg body initially at rest, and both final requested quantities. The visible
  stem discloses the standard one-dimensional, horizontal, force-along-motion
  interpretation; the source did not print an angle. Frozen final results are
  180 J and `2 sqrt(30) m/s`, with no second-stage restart.
- Source 7 retains 1000 tonnes, 108 km/h, and stopping. Signed work on the
  train is `-4.5 * 10^8 J`; its magnitude is `4.5 * 10^8 J`, explicitly separate.
- Source 9 retains radius 0.5 m and kinetic energy 10 J. The complete result is
  a 40 N inward resultant with zero work. An arbitrary positive arc length
  clarifies the interval, not a new numerical distance or full-turn-only rule.

## Real conversion losses

All selected source tasks have authored coverage, but choice recognition does
not demonstrate independent written production:

- Sources 1 and 2: no independently composed theorem or energy definition.
  The work-from-rest interpretation is retained in the frozen source solution
  but is not separately elicited as a learner explanation.
- Sources 3-5: no independently composed energy-change explanations or
  learner-constructed constant-speed direction-change counterexample.
- Source 6: no independently written two-stage work accumulation or
  square-root speed calculation. Its determinate numerical result remains
  conditional on the visible one-dimensional source interpretation.
- Source 7: no independently produced unit conversions or stopping-work
  derivation.
- Source 9: no independently derived force-elimination formula or written
  explanation of instantaneous perpendicularity.

Each selected source's loss is also recorded in draft `coverage`; no missing
writing ability is presented as proven by selection.

Source 8 is deliberately unselected and UNCONVERTED. A 1300 kg satellite at
100 km altitude needs orbital speed or a complete equivalent set of Earth
orbital constants to yield a numerical kinetic energy. This local semantic
whitelist supplies neither. No orbital speed, Earth constants, or numerical
answer was fabricated, and the original remains read-only.

## Structural execution

All shells used explicit cwd `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Standard inspect and prepare each ran once. The standard helper alone read
`8p/book.json` for current selected-lesson membership/snapshot metadata, not
as learner semantic content. Its selected-row canonical hash is
`d30f92c3ff4b1bcc0bc4f596e32e4d20143eb6fe54d53db2db1ceeaa9437ee6b`.
No other book-index row was displayed or inspected manually.

The structural validator ran exactly once, without `--review`:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .intentfold/tickets/STEMROBIN-180/tmp/b83-n65-choice/seed.json --draft .intentfold/tickets/STEMROBIN-180/tmp/b83-n65-choice/draft.json
```

Exit status: `0`.
Exact stdout: `mechanical checks passed; semantic review still required`.
This is mechanical validation, not self-semantic approval.
No tool tests, app checks, model calls, image calls, database operations,
`.env` reads, dependency operations, Git operations, publishing, or other-chat
operations ran.

## Unchanged source and retained history

Final current-canonical file-byte hashes match the frozen inputs:

- `lesson.json`: `15918be1a358c46b5025923e8307ecef826dda5da1d67f8060c03d47ef555aa2`
- `exercises.json`: `e262116faf3a0139312c850f8500866e2e7b607e51a6d4891f235511f2653193`
- `figures.json`: `67f484176f17a0d685be4ab4080cd4d3ed3bec87ab13692cf9fc268a4f2a825f`

The earlier technical-stop checkpoint and command record are preserved
byte-for-byte inside the owned scratch directory:

- `technical-stop.checkpoint.md`:
  `2818992e882f251101b015bd0c9f638c152955bbf87bd46749a20fe05d3539cb`
- `technical-stop.commands.md`:
  `b90dd72f28d8255e40316ba19e66b158221bb1420fe2edaaa54fcb412b5d4384`
- `technical-stop.scope.md` preserves the earlier scope question and the
  human's ordinary-scope clarification. The old stop was not a failed
  content gate or an approval boundary.

An initial overly broad filename discovery is honestly retained in the command
record. No contents of other ticket outputs, tests, previous choices,
interactions, answer keys, or parent source solutions were opened or used.
All writes remained inside the two explicitly owned locations.

## Parent review handoff

The author stops here. The parent should independently start with the seed and
selected definitions, then review the visible questions before comparing the
author's internals. No review artifact or pass declaration is included.
No publication, application integration, or database payload is authorized
or implied by this candidate handoff.
