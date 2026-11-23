# STEMROBIN-187 N59 independent review

Outcome: **revise**. Affected questions: **n59-984, n59-992**.
No draft, seed, author file, other review, collaborator edit or staging was changed.

## Blind sequence and bindings

All shell commands ran in:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187`.

1. STAGE1 solved all 33 source exercises and concept block 5 using only the
   seed and one actual full-canvas preview. Source solution was written,
   hashed and frozen before any choice projection:
   `reviewer-source-solutions.md`,
   SHA-256 `8d4965691cdcae1274e045477daff6bcd2477a1194a3a04616e0633437af8a67`.
2. Newly read only `review-views.json` and reused that source freeze. For every
   visible question, fidelity, redundancy and leakage were recorded before
   its independent complete true set and every option's mathematical check.
   Cross-question dependence and all 33 source mappings were also judged.
   The visible record was written and hashed BEFORE author disclosure:
   `reviewer-visible-checks.json`,
   SHA-256 `eefe241a83bfc8d984520a24b2fa0fe6bf44b18c7be969904fee999b849ed286`.
3. Only after the visible freeze, read `draft.json`,
   `author-source-solutions.md` and `author-notes.md` for comparison. The
   frozen independent truth sets were not rewritten to agree with a key.
4. Wrote the complete contract review:
   `review.json`,
   SHA-256 `9f561f8a739e91cc3139411c7fdea390088c7c8490cde5acba864cc259c4f3e8`.
   Ran the existing validator with `--review` exactly once, then retained the
   real result below. No author-only structural check was rerun.

The files named above are in `.tmp/stemrobin-187/n59/choices/`.
This notes file's final byte hash is returned separately after its complete write.

Input bindings:

| Input | Actual file SHA-256 |
| --- | --- |
| seed.json | 35254d9424a6dd4cd574ae438c8738069991668f38ffda2c6f0632574d505e83 |
| review-views.json | 1a60ea3d8feedfb3ecf183c47218334f92c1048a4ff872bae225662f1506d0e0 |
| draft.json | 33c125dcf0c4a8793a1f00959b207565df38f2036e2f875132f91d2bc544849c |
| author-source-solutions.md | 883254478cb19c03f79d44fa52e8254558b8e667d6ca7d4c3b20136b13fa6b78 |
| author-notes.md | a85df53a21531cc197de8083f76b3588198ca855ae925d4f011c91309a301622 |

Official canonical seed digest:
`3c66b07363ea4cccd9c60b2a305e2f2a02b31f951a88743249576fcff045da7f`.
Official canonical draft digest:
`1ea0b2b1fb5e66b4ff2564b9a7ab8edd74df30b9b2d810b5a8ed84510d3e7e91`.
These were obtained with the existing digest command, not a structural rerun.

A read-only sorted-JSON projection binding was also compared after disclosure:
the draft's id/source_numbers/view projection and review-views.json both hash
to `12e33e4a0844cb1f0f3bd43f2551a81a9764249931769f4212546ede4a8f9689`
under that same comparison encoding. This establishes snapshot identity only;
neither JSON parsing nor validator/source implementation is content evidence.

## Actual scope and comparison

- Contract review contains 33 source_reviews, 41 question_reviews and checks
  of all 152 options. There are 39 single questions and 2 multiple questions.
- All 41 independent complete true sets agree with the author's correct sets.
  Each option's derivation and misconception was compared forward against its
  actual values and false/true status. No additional incorrect key, numerical
  result, or nonreproducible distractor derivation was identified. Per-option
  mathematical evidence is retained in review.json.
- Mathematical verdicts are pass for all 41 visible questions; this does not
  imply task fidelity. Source coverage and task fidelity are revise for 984
  and 992; leakage is additionally revise for 984.
- All 33 sources have mappings. The eight split sources
  976,980,989,994,995,999,1001,1004 use disjoint substantive subparts.
  No selected answer is needed as another question's input. Similar speed
  exercises have separate source data or different given/requested roles;
  normal transfer of a method is not cross-question leakage.
- 976 retains all six addition verifications as well as differences.
  982 retains all three speeds and the 8/13/18-cell plotting plan.
  997 retains both comparisons without computed totals.
  1007 retains both simplified forms and both substituted values.
- Only fig-223 is used. figure_checks has one bound observation;
  new_figure_reviews is [] because there are no new figures.

## Findings

### n59-984: disclosed source direction inference

The source's continuous lake-to-inflowing-river relationship requires deriving
upstream direction before selecting 27-3. The visible stem retains the route
but also explicitly says that the boat travels against the current. This makes
the geographic clue unnecessary and supplies that intermediate conclusion.

The source freeze records why 177 km follows from the geographic reading,
and why 201 km would follow for a downstream leg without that reading.
The author also explicitly declares loss of independent direction inference.
That honest declaration does not preserve the missing source judgment.
This is a definite fidelity/leakage defect, not a claim that the visible
arithmetic is ambiguous: its explicit upstream wording makes D=177 unique.

Smallest affected scope: n59-984's visible route wording and its corresponding
intent, coverage and review records. Preserve the lake-to-inflowing-river
relationship without handing the learner its direction conclusion.
No unrelated speed question or source solution needs reauthoring.

### n59-992: construction/measurement replaced by angle totals

The source asks the learner to draw a quadrilateral and measure each angle.
The visible question provides only four ordered number lists, with no shape,
construction protocol or measurement setup to judge. Totals 350,360,380,360
alone select B,D. Both accepted lists are indeed geometrically feasible,
so this is not a wrong mathematical key.

Convexity is also an added scope restriction. The author records drawing,
measurement and free-shape losses, but there is no retained shape-specific
construction or measurement judgment. Thus this is task substitution, not
merely a choice response's inability to prove personal tool execution.

Smallest affected scope: n59-992 and its corresponding intent, coverage and
review records. Restore substantive construction/measurement reasoning rather
than treating an angle-sum feasibility exercise as equivalent. This finding
imposes no new-image quota, blanket figure requirement, or mandatory figure
pipeline; the reviewer does not prescribe or implement the replacement.

### n59-993: substantive planning retained

Unlike 992, this textual construction plan specifies the shared vertex,
reference ray and consecutive directions. Candidate direction sets must
recover all three named angular gaps: A gives 32,56,36; B gives 32,88,56;
C gives 32,88,124; D gives 32,24,124 degrees.
The local-angle versus cumulative-direction distinction and shared-ray
geometry survive, so fidelity passes on substantive evidence, not just because
physical-drawing losses are admitted. Manual drawing/protractor execution and
alternative layouts remain explicitly unassessed.

## Reused figure and actual image counts

Actual STAGE1 full-canvas open:
`.tmp/stemrobin-187/n59/figures/fig-223.normal640.png`,
SHA-256 `5b790613e97fbc84c8d72ece97e0ed50c92f00129d2a8435befe81cc66cfd536`.
Bound unchanged seed SVG:
`ssot-resources/soviet10year-textbooks/artifacts/4m/editions/modern-us-neutral/figures/fig-223.svg`,
SHA-256 `e6cadbce72140f56b9ea5075409f845b3bfa4b004ac25373ed4a0b41f8a60ffd`.

The complete two pipes, both endpoint dimensions, rightmost endpoint and
bottommost people were visible. Left x is unknown; right 2.89 m is numerical.
Total 7.35 m comes from prose. People and illustrative scale supply no numbers.
The actual observation is reused, not a reopened image or renewed figure review.

This stage: 0 new images, 0 reopens, 0 crops.
Actual cumulative reviewer context use: 1/24; original batch size 1/8.
No original image, figure specs/reviews, rendering or figure pipeline was read/run.

## Validator: exactly one review run

Command:

```text
python3 .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .tmp/stemrobin-187/n59/choices/seed.json --draft .tmp/stemrobin-187/n59/choices/draft.json --review .tmp/stemrobin-187/n59/choices/review.json
```

Actual exit status: **3**.

Exact output:

```text
mechanical checks passed; semantic review outcome: revise
```

This means the review is mechanically bound and records a non-passing semantic
outcome. It is not a validator failure to be erased, nor proof of mathematical
or pedagogical correctness. No second run, test, new checker or fix was made.

## Stop boundary

Source and visible freezes remained byte-identical after author disclosure.
Seed and draft remained at the input hashes above. All writes were reviewer
artifacts only. No answers/interactions/tests/other review, DB, env, network,
paid service, install, Git write, publishing, progress change or new image was used.

Keep this original revise review for an affected-only minimal revision.
Any later changed question needs review of that changed snapshot and affected
package relationships, not another solve of all 33 unchanged sources or
another review/open of unchanged fig-223. The reviewer stops without changing
questions, promoting artifacts, or claiming approval.
