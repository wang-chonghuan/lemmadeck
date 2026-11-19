# STEMROBIN-180 / session180-3 / b86: n69 Choice Author

Status: FIRST offline author only. No semantic review or approval is claimed.
All shell and child processes use `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Owned outputs are this note and `tmp/b86-n69-choice/` within this ticket.

## Authority

The official `prepare.py inspect` projection and its prepared seed are the only
content inputs. Book `8p`, lesson `phy8-c4-s2-n69`, source numbers `1`, `2`, `3`.
Selected concept blocks: `9` (conservation law) and `10` (mechanical-energy
definition). No solved example is selected or used as a definition. Exercise
figure references, concept figures and authored images are all empty.
Image budget: 0. The PASS adaptation of the current modern4 inputs is taken as
the user's supplied premise, not re-reviewed.

No previous answers, source-solve report, answer-box or interaction configuration,
prior choices, ticket reports, history or tests were consulted. No canonical file
is edited. This author phase invokes no IntentFold capability, backend, setup,
freshness operation, descendant, message, service, dependency or Git operation.

## Independent Source Solutions

Recorded before constructing any options.

Source 1 asks for the definition of total mechanical energy, not for the value
of an individual energy component. If K denotes the kinetic energy and U the
potential energy of the selected system, its mechanical energy is E = K + U.
Potential energy belongs to the interacting system. This definition does not
by itself assert conservation in every physical situation.

Source 2 fixes the object-Earth system, neglects air resistance, allows only
gravity to act on the moving object, and approximates gravity as uniform over
the motion. Under these ideal conditions the system's mechanical energy is
constant: K2 + U2 = K1 + U1. Rearrangement gives
K2 - K1 = -(U2 - U1). An increase in one component is accompanied by an equal
decrease in the other; neither component need be constant separately. These
conditions do not include dissipation or the impact after the falling motion.

Source 3 releases the object from rest, so its initial kinetic energy is zero.
Let h be the release height above the ground, m its positive mass, and g the
positive magnitude of gravitational acceleration. Taking ground level as the
potential-energy zero, the initial mechanical energy is mgh. Just before contact
with the ground the potential energy is zero and the kinetic energy is mv^2/2.
The stated no-drag, approximately uniform-gravity conditions give
mgh = mv^2/2, hence h = v^2/(2g) = (30 m/s)^2/(2g).
The unit is metres because (m/s)^2 divided by m/s^2 is m. Mass cancels. No
numerical value of g is supplied, so no unique numerical height in metres can be
justified without adding a new premise. The endpoint is before collision; the
given speed is not a post-impact speed or an average speed.

## Planned Response Units

Three independent units follow from the mathematics, not a question quota:
the definition of E, the conservation and conversion relationship under stated
conditions, and the height obtained from the released-from-rest energy balance.
Use one native single-choice definition, one native multiple-choice law
interpretation, and one native single-choice complete height expression.

Recognition cannot establish independent production of the definition, a verbal
statement of the law, or the equation, algebra and unit analysis. All three
sources will remain covered, with these production losses recorded internally.
The numerical height evaluation is deferred because the seed omits g, not
replaced by an invented value. No drawing capacity is part of these sources.

## Execution

1. `python3 .agents/skills/ld-s10y-choice/scripts/prepare.py inspect --repo . --book 8p --lesson phy8-c4-s2-n69`
   Exit 0, once.
2. `python3 .agents/skills/ld-s10y-choice/scripts/prepare.py prepare --repo . --book 8p --lesson phy8-c4-s2-n69 --exercise 1 --exercise 2 --exercise 3 --concept-block 9 --concept-block 10 --out .intentfold/tickets/STEMROBIN-180/tmp/b86-n69-choice/seed.json`
   Exit 0, once; prepared all three seeds without generating questions.

Seed canonical SHA-256:
`f3b0dd38a22f8bf7ab8bf419b3bc9e9792a912934ead61f19fc6b1a408dd1ea1`.

3. Manually authored the complete draft with `apply_patch` into the owned
   `tmp/b86-n69-choice/draft.author.json`, after the independent solutions above
   were recorded. No script generated questions, solutions or alternatives.
4. A Node mechanical byte copy created `tmp/b86-n69-choice/draft.json` using
   `fs.writeFileSync(..., {flag: "wx"})`; it parsed JSON but did not transform
   or generate draft content. The owned staging file was subsequently removed.
5. `python3 .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .intentfold/tickets/STEMROBIN-180/tmp/b86-n69-choice/seed.json --draft .intentfold/tickets/STEMROBIN-180/tmp/b86-n69-choice/draft.json`
   Exit 0, once. Actual output:
   `mechanical checks passed; semantic review still required`.
6. A Node mechanical projection created `tmp/b86-n69-choice/learner-only.json`
   using `fs.writeFileSync(..., {flag: "wx"})`. It contains only the ordered
   array of the three exact question `view` subtrees. Each view has exactly
   `mode`, `stem`, `figure_ids`, `options`; each option has exactly `id`,
   `text`, `figure_ids`. No author intent, key, coverage, source selectors,
   question source mapping, rationale, concept text or solution is included.
   The same call printed counts and canonical/byte SHA-256 values, and checked
   its canonical seed hash against the official prepare output.

The seed is the official FIRST/no-overwrite preparation output. The final draft
and learner-only output were both explicitly created with `wx`. None of these
three outputs was overwritten or edited after creation. Hash computation is
mechanical snapshot accounting, not an independent semantic review.

## Counts And Deferred Capacities

3 questions, all 3 source exercises covered, 11 options (4, 4, 3).
Native modes: 2 single, 1 multiple. Images and all figure references: 0.
Concept blocks: 9, 10 only.

The definition, law interpretation, and complete symbolic height all have
recognition coverage. Independent production of the definition, law wording and
conditions, energy-change derivation, initial/final energy setup, algebra and
unit check is not established by choosing options. Numerical height evaluation
is deferred for the missing numerical g. No source is silently dropped.

Independent semantic review, self-review, reviewed validation, retention,
publication, DB/app integration and operation are all deferred and were not
invoked. This draft is not semantically approved. No review artifact was created.
No test, image, model, browser, service, dependency, Git, backend, setup,
freshness, descendant or messaging call was made.

## Source Hashes

The following are the exact official seed trace values. The `book.json` hash
is the contract-defined canonical selected-book/index projection, not the raw
whole-book file hash. The three modern-file hashes are whole-file byte hashes.

| Input | SHA-256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/book.json` | `ec745b9f708fec10d9a2d18461e48d07b2f30297a79a07e669e16f58408a0f68` |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/editions/modern-us-neutral/lessons/phy8-c4-s2-n69/lesson.json` | `9773413f03ffd01fd106012afae72f395f0f1b93700ce20a0741b46fb00f4781` |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/editions/modern-us-neutral/lessons/phy8-c4-s2-n69/exercises.json` | `051fa3c1579cb9ed60f4f25ffab4a1a55fb3b240bf827d22033f9468adf48949` |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/editions/modern-us-neutral/lessons/phy8-c4-s2-n69/figures.json` | `4f3954ba0e093c000b7467bf2f87e774521d2e33401e836c92f43ed128d5ae07` |

## Frozen Snapshots

All paths below are inside this ticket's owned `tmp/b86-n69-choice/`.
Canonical JSON uses the contract's sorted keys, ASCII escaping and compact
separators. Byte hashes include the exact formatting and terminal newline.

| File | Bytes | Canonical SHA-256 | Byte SHA-256 |
| --- | --- | --- | --- |
| `seed.json` | 2740 | `f3b0dd38a22f8bf7ab8bf419b3bc9e9792a912934ead61f19fc6b1a408dd1ea1` | `0a454df1ced060e4f65ee3ffa406df01308a1d8bb3876c6f2df835af3bfc0842` |
| `draft.json` | 11741 | `dab6c4c24b2b01b0206ee03fa99375e5947e4cfd8b5922c1bfd45cf8d0ff5e8b` | `c424093659109ce816fa594b1c46df9b4805c3b71e45220aec147e129f7dcadb` |
| `learner-only.json` | 2208 | `154796a720f2d7ad23d16442f36ce56d8482b06d330ed97bdabe3c83aa5921f9` | `2357d34a8082060227bf20ffd163c122d8597e6f5cab3e9ef2acdb314b3086ad` |

Final state: author-only structural pass, frozen reviewer input, semantic gate
pending. Stop here.
