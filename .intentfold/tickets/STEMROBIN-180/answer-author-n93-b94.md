# n93 Answer Author b94

Date: 2026-11-19. Scope: STEMROBIN-180/180-4, book `7p`, lesson
`phy7-c1-s1-n93`, edition `modern-us-neutral`. ANSWER AUTHOR ONLY.
All shell commands used explicit cwd
`/Users/yong/.codex/worktrees/stemrobin-180-resume/lemmadeck`.

## Artifacts

- Candidate: `.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-answer-author/candidate.json`.
- FIRST author draft: `.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-answer-author/FIRST-candidate.json`, mode `0444`.
- Both candidate files: SHA256 `918101baed731e14ff9f0c69f6868dc4d8faa18881a1f5dd6fec365f0114a80c`, 9921 bytes.
- Manifest: `.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-answer-author/manifest.json`, mode `0444`.
- Semantic projection SHA256: `2bbb9dd2626b7ef3756820c662c7df5b70a5000b1c8924678f91964bba0f46ba`.

This is a draft author handoff, not independent approval, gate-2 passage,
answer finalization, promotion or the parent's FIRST/FINAL decision.

## Source Boundary

The sole n93 prose/task authority was the five authorized JSON files under
`n93-text-author/current-freeze/`: `lesson.template.json`,
`exercises.template.json`, `figures.template.json`, `source/lesson.json`,
and `source/exercises.json`. The source directory is nested inside the freeze,
not alongside it. Source physical pages are 242-246.

The caller-named `n93-text-author/manifest.json` hash was checked:
`218081762dfb39ec3d25a7706bde72dabd229b72ee435dd9f51831aaafa9220b`.
All five JSON hashes matched that manifest. Eight modern/source identities,
source numbers, groups, texts and figure references aligned exactly. They are
`1`, `2`, `3`, `4`, `g2-1`, `g2-2`, `g2-3`, `g2-4`.
`g2-2` explicitly references `tbl-p0241-01`; it is not a missing-figure task.

The caller confirms captured 7p answers are absent. Every answer was derived
from these current texts and the actual table; every `bookRaw` is explicitly
`null`. No captured/old answer file was opened. No independent review output,
report, choice key, history or other chat was read.

## Actual Images

Exactly two images were opened, once each, using `functions.view_image`:

1. `ssot-resources/soviet10year-textbooks/artifacts/7p/figures/tbl-p0241-01.png`,
   SHA256 `e14a09002ecc89035ccce5528109cebff7007998ba552db4952e52706df81189`.
2. `.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n92-table-author/native-repair-1-1440-full.png`,
   SHA256 `9a98cb8d83eeb6dd72bf986a1c7b633c74aa9c0772b92920feeff1ae14e51924`.

One batch, two images in this fresh context; limits were 8 per batch and 24 per
context. No crops, reopens, image/model service, browser or additional image
payloads were used.

The source pixel inventory was made before reading the canonical spec. The
source has one header row, sixteen ordered material rows, three columns,
two vertical dividers and top/header/bottom rules. English labels, regular
spacing, body-row rules and outer side borders are observed modern additions.
The title and both specific-heat unit columns were retained.

| Row | Material | J/(kg degree C) | kcal/(kg degree C) |
| --- | --- | --- | --- |
| 1 | Lead | 140 | 0.033 |
| 2 | Copper | 380 | 0.09 |
| 3 | Zinc | 380 | 0.09 |
| 4 | Brass | 380 | 0.09 |
| 5 | Iron | 460 | 0.11 |
| 6 | Steel | 500 | 0.12 |
| 7 | Cast iron | 540 | 0.13 |
| 8 | Brick | 750 | 0.18 |
| 9 | Laboratory glass | 840 | 0.20 |
| 10 | Aluminum | 920 | 0.22 |
| 11 | Vegetable oil | 2000 | 0.48 |
| 12 | Ice | 2100 | 0.50 |
| 13 | Kerosene | 2100 | 0.51 |
| 14 | Wood (oak) | 2400 | 0.57 |
| 15 | Alcohol | 2500 | 0.60 |
| 16 | Water | 4200 | 1.00 |

The canonical modern spec is
`n92-table-author/tbl-p0241-01.spec.json`, SHA256
`447ade7ae66861accef7f433385b198539eb98df9f0f6f6c87f600f5ddf07a41`.
Only that spec and the named native screenshot were read as table evidence;
no n92 answer keys, source inventories or review reports were read. Its source
hash, all sixteen label/value pairs and 16-by-3 body dimensions matched this
independent inventory. This binding check is not a figure approval.

## Author Decisions

Eight tasks have complete `displayAnswer` explanations. Six explanatory/open
tasks are ungraded with empty parts; question 3 has one proposed exact formula
part, and `g2-4` has exactly three independent numeric parts labeled in source
circled order and explicitly using `J`.

- `1`: mass, specific heat and initial/final temperatures; compatible units,
  no-phase-change/constant-specific-heat conditions, absorbed versus heater heat.
- `2`: an original worked example, 2 kg of water from 20 to 30 degrees Celsius:
  84000 J absorbed. The reverse change releases 84000 J; signed heat is negative.
  These example values are not represented as source-book answers.
- `3`: `Q=cm(t_2-t_1)` for heating; release magnitude `cm(t_1-t_2)` for cooling.
  Both exact candidates represent the same formula with mass/specific-heat order
  exchanged. Genuine MathLive editing and normalization remain NOT RUN.
- `4`: heat flows hot to cold, ideal heat-release/absorption equality, with
  container/air losses included in real energy accounting. The current lesson's
  two water calculations both give 50400 J.
- `g2-1`: 1 kg aluminum gaining 1 degree Celsius absorbs 920 J, approximately
  0.22 kcal using the separately rounded table column; cooling releases the same
  magnitude. No assertion of infinitely precise cross-unit equality.
- `g2-2`: all listed liquids considered. At equal mass and equal actual heat
  received per unit time, fastest to slowest is vegetable oil, kerosene, alcohol,
  water. No universal ranking for arbitrary masses/powers or phase changes.
- `g2-3`: water's largest table-listed liquid specific heat supports cooling at
  equal mass and allowed temperature rise; energy is transferred out of the
  engine. No arbitrary-mass claim.
- `g2-4`: cast iron `540 * 1.5 * 200 = 162000 J`; aluminum
  `920 * (50/1000) * (90-20) = 3220 J`; brick
  `750 * (2*1000) * (60-10) = 75000000 J`. Source 50 g and 2 t are retained
  alongside their kg conversions, and the iron's 200 degrees is a rise, not
  a final temperature.

The printed specific-heat precision is retained. Direct use of the separately
rounded kcal column gives 39, 0.77 and 18000 kcal for the final three parts;
these are displayed with the rounding caveat, not treated as exact conversions
or accepted unconverted numeric J keys.

## Commands And Errors

Read-only entry commands inspected the requested answer skill/gate-2, lesson
skill/production-resume, image skill/image-batches and background-browser skill,
plus the project router/charter and the answer tool's schema contract. No
IntentFold capability, backend request, dependency command or app code was run.

The initial `pwd` confirmed the required checkout. Initial read-only `sed`,
`cat`, `ls` and `rg` calls all had explicit cwd. Two early technical errors:

- `rg --files -g '*run-stage.mjs' .intentfold/tickets/STEMROBIN-180` returned 1
  with no matches; the specified script was then read directly.
- `ls` including the guessed `n93-text-author/source` and not-yet-created
  `n93-answer-author` returned 1; authorized source JSON was found under
  `current-freeze/source`, and only the owned output directory was created.

Subsequent hash/binding/freeze commands used the parent's
`.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/run-stage.mjs`.
Receipt prefix for all commands below:
`.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/commands/`.
Full commands, arguments, cwd, exit codes and stdout/stderr hashes are retained
in those receipts.

| Receipt | Action |
| --- | --- |
| `n93-answer-author-source-read-1.json` | Read the two authorized source JSON files |
| `n93-answer-author-input-hashes-1.json` | Hash five frozen JSON files and the two actual images |
| `n93-answer-author-source-manifest-1.json` | Read the caller-named current source manifest only |
| `n93-answer-author-source-manifest-hash-1.json` | Confirm the caller's manifest SHA256 |
| `n93-answer-author-table-spec-read-1.json` | Missing literal `table.spec.json`; exit 1 |
| `n93-answer-author-table-spec-locate-1.json` | Filename search; absent `.tmp/s10y-image`; exit 2 |
| `n93-answer-author-table-author-filelist-1.json` | List authorized table-author filenames, not contents |
| `n93-answer-author-canonical-table-spec-1.json` | Read actual `tbl-p0241-01.spec.json` |
| `n93-answer-author-table-spec-hash-1.json` | Bind actual spec hash |
| `n93-answer-author-check-candidate-1.json` | Native Node JSON/identity/hash/table/arithmetic assertions |
| `n93-answer-author-freeze-first-1.json` | Exclusive mechanical copy and `0444` FIRST freeze |
| `n93-answer-author-freeze-manifest-1.json` | Freeze owned manifest `0444` |
| `n93-answer-author-final-hashes-1.json` | Final owned-file hashes, counts, permissions and source-binding check |

The two spec-location errors were path/filename mistakes, not scientific
failures; neither caused another image open, model call or source edit.
Manual answer/manifest/note creation used `functions.apply_patch`; only the
owned first snapshot was copied mechanically.

## Pending And Usage

Counts: 8 answers, 2 proposed auto tasks, 6 ungraded tasks, 4 answer parts,
3 finite numeric J keys, 1 exact part with 2 candidate strings, 2 image opens.
Author-only native assertions are not ComputeEngine or MathLive acceptance.
No answer prepare/finalize, actual keyboard-input normalization, gate-2 review,
publish, database access, full tests, git, environment access, browser,
dependency install, other-agent access or promotion occurred.

Generated `prompt` and `figureEvidence` fields are intentionally absent.
The parent must finish modern text/figure binding, obtain independent
TEXT/SOURCE approval and SOURCE binding, and run actual MathLive validation.
Generated metadata can be bound only if the documented semantic projection
is unchanged. This author did not read that independent review and grants no
independent approval or FIRST/FINAL determination.

Paid/model-service calls: 0. Image-model-service calls: 0. Browser calls: 0.
Host author-model tokens: UNKNOWN. Host author-model cost: UNKNOWN.
No paid/model/image service was invoked, and no host billing telemetry was
available. No other author's files were changed.
