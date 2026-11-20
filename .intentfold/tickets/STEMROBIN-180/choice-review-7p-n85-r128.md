# n85 CHOICE r128 Independent Review

Outcome: **PASS**. Finish: **review**. One independently assigned reviewer, separately from the author. Nine seeds, seven questions, five native single-choice questions, two native multiple-choice questions, all 30 options checked. No candidate edits, SOURCE-answer review, prior answers, other choices, source-text/figure comparisons, images, browser, DB, services, publishing or retention execution.

## Independent chronology

All times below are actual UTC observations on November 20, 2026, not inferred filesystem dates.

| Event | UTC time | Frozen evidence |
| --- | --- | --- |
| Designated seed only first opened; supplied byte SHA matched | 10:00:02.749 | Tool observation; input copied in the following freeze |
| Nine full independent CHOICE seed solutions frozen, before learner view | 10:01:02.284 | `01-seed-freeze-pin.json`; solutions SHA `9cdbee57cd8ec6da3118fc78be412453944eb49272ca272d052aaea01678bbe0` |
| Designated learner-only projection first opened | 10:01:10.629 | `02-learner-open-pin.json`; byte SHA `e22e6e5d048fcdf946e7503571c28f98481cafcd1c3b527b033e9e9de205c596` |
| Fidelity/leakage and blind seven-question/all-30-option truth sets frozen | 10:03:21.433 | `03-blind-freeze-pin.json`; fidelity SHA `db39cb56522d153e751886839c2a64f54a892bae8feb4192e54f6f1ebd145591`; mathematics SHA `ef909e9c2725590a07a3aa28fec3135b5153668e4cd82de7624d0920c2bfe379` |
| Author candidate first opened, only after both freezes | 10:03:34.295 | `04-author-open-pin.json`; byte SHA `12bac0f642ba01b68e48dd4073614740f7b0a9f36f06f1f09167a3eb12fe325f` |
| First and only official checker with review | 10:05:33.761 to 10:05:33.795 | `05-official-gate-result.json`, exit 0 |
| Exact approved byte copies created | 10:05:33.820 | `06-approved-pin.json` |

The four chronology pins preceding author comparison bind their preceding records by actual-byte SHA and freeze them at `0444`. These are independent CHOICE seed solutions under this contract, not a repeat of the separate n85 SOURCE-answer review.

## Full task coverage

| Seed | Question | Essential task retained |
| --- | --- | --- |
| 1 | q1 | Whole localized-heating demonstration, apparatus and nearest-to-farther wax/tack observation; no simultaneous direct heating substitute |
| 2 | q2 | Progressive neighbouring-particle energy transfer, hotter to cooler, without bulk metal transport; explicitly simplified model |
| 3 | q3 | Equal initial metal/wood temperature below the hand, brief touch, faster hand heat loss into metal |
| 4 | q4 | Good and poor conductor groups plus opposite transfer/insulation uses; bounded common-material comparison and radiation qualification |
| g2-1 | q5 | Thick loose snow, retained air, warmer soil, reduced outward cooling and frost risk, not active heating or a guarantee |
| g2-2 | q5 | Straw, rice straw and dry leaves, pores/packing gaps and poorly conducting retained air |
| g2-3 | q6 | Both board/sawdust and ice/fresh-snow pairs, same constituent material versus different structure, both given finite ratios |
| g2-4 | q7 | Body-supplied energy versus coat/air slowing outward loss; insulation does not generate heat |
| 5 | q3 | Desktop metal scissors/wooden pencil barrel, equal starting temperature below hand and brief-contact sensation |

Joining 3/5 removes the duplicated causal explanation without dropping either context or condition. Joining g2-1/g2-2 preserves both full tasks: q5-a addresses snow/crop heat loss, q5-c addresses porous plant material, q5-e addresses thickness. These three true claims are not equivalent options.

Written explanation production is replaced by recognition. Experiment design and actual execution/observation are also not demonstrated by selecting a design. These losses are explicitly recorded in both author and independent coverage; they do not remove the essential conduction judgments. Free material/use examples are replaced by recognizing material-performance/use relationships.

## All-option evidence

`T` means true for the question's complete task; `F` means false or an inadequate demonstration for that task. Option order is the original learner order. All full independent derivations are in the frozen mathematics record and contract review.

| Question / full true set | a | b | c | d | e |
| --- | --- | --- | --- | --- | --- |
| q1 / `{b}` | F: farthest-first reverses propagation | T: nearest-to-farther release from one heated end | F: directly heating every location does not isolate along-wire transfer | F: copper can pass energy beyond the heated end | n/a |
| q2 / `{d}` | F: bodily metal flow is not conduction | F: cold is not an incoming substance | F: no instantaneous whole-wire equilibration without transfer | T: progressive interaction-mediated energy transfer, no bulk flow | n/a |
| q3 / `{c}` | F: contradicts equal initial temperatures | F: reverses energy direction and cooling consequence | T: warmer hand loses energy faster into metal | F: invents cold flow | n/a |
| q4 / `{b,d,e}` | F: reverses nonmetal-liquid/silver-copper ranking | T: good conductors suit rapid-transfer components | F: air insulation slows rather than speeds loss | T: poor gas conduction and retained-air insulation | T: rarefaction weakens particle conduction, not radiation |
| q5 / `{a,c,e}` | T: snow air gaps slow soil/crop heat loss | F: no snow heater or any-weather guarantee | T: plant pores/gaps retain poorly conducting air | F: reverses air/metal ranking and insulation mechanism | T: comparable thicker layer increases path/resistance |
| q6 / `{a}` | T: air gaps weaken bulk conduction in both pairs | F: fragmentation does not create a new substance | F: poor conduction is not zero/all-transfer exclusion | F: same constituent material need not mean same aggregate conduction | n/a |
| q7 / `{b}` | F: coat is not a continuous heat generator | T: body energy retained by fur/air insulation | F: faster outward loss cools the body | F: cold is not a material blocked from entering | n/a |

Author internals were compared last. All seven exact keys, all 30 truth labels and all 11 correct rationales match the frozen independent results. The 19 incorrect rationales each identify a concrete mistaken procedure that actually yields the displayed alternative and is actually false here; individual evidence is preserved in `author-comparison.json`. q1-c is specifically a causal-evidence failure, not an assertion that simultaneous melting is impossible.

## Fidelity and leakage

No source-number mapping, keyed option references, numeric-data-only answers or answer-key markers appear in the learner view. The two 3.7/21.5 ratios are source conditions; choosing their copies cannot solve q6 because its alternatives are competing explanations. Equal temperatures and ice-crystal identity legitimately constrain alternatives.

Retained-air conduction recurs across q4/q5/q6/q7 as lesson knowledge, but each task asks a different application or causal distinction: material ranking/use, crop/plant/thickness, both constituent-versus-aggregate pairs, and body heat source. No other question supplies a complete keyed answer or either complete native-multiple truth set. This conceptual reuse is not treated as copied-key leakage. The package retains separate experimental, microscopic, perceptual, classification and application judgments rather than repeated questions differing only in nouns.

All exercise figure references, concept figure references and new figures are empty. Only definition blocks 11 and 12 were selected. Image/browser inspection is neither needed nor claimed.

## Exact gate

Workdir for this command and every shell command in this review:
`/Users/yong/.codex/worktrees/stemrobin-180-six-3112/lemmadeck`

```bash
python3 /Users/yong/.codex/worktrees/stemrobin-180-six-3112/lemmadeck/.agents/skills/ld-s10y-choice/scripts/validate.py \
  --repo /Users/yong/.codex/worktrees/stemrobin-180-six-3112/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-3112/n85-choice-author-r128/projection-repo \
  --seed /Users/yong/.codex/worktrees/stemrobin-180-six-3112/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-3112/n85-choice-independent-r128/inputs/seed.json \
  --draft /Users/yong/.codex/worktrees/stemrobin-180-six-3112/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-3112/n85-choice-independent-r128/inputs/draft.json \
  --review /Users/yong/.codex/worktrees/stemrobin-180-six-3112/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-3112/n85-choice-independent-r128/review.json
```

Exit: `0`. Stderr: empty. Exact stdout:

```text
mechanical checks passed; declared semantic review: pass (not automatically proved)
```

This is structural/freshness/snapshot agreement, not automated proof of scientific fidelity. The independent records provide the separate semantic evidence. No author-only checker or prepare command was rerun.

The requester reported a parent's first generic binder failure confusing the semantic book trace with a byte hash. That reported failure was not read, overwritten or rerun here, and is not a scientific failure. This review's first gate passed; no failure evidence was discarded.

## Frozen handoff

Owned root:
`/Users/yong/.codex/worktrees/stemrobin-180-six-3112/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-3112/n85-choice-independent-r128/`

Approved exact inputs under that root, all `0444`, for a separately authorized official `retain_choices` operation:

| File | Actual-byte SHA-256 |
| --- | --- |
| `approved/seed.json` | `3811708492f9ef69a5ce12eb584a97f0b6ef0962232d1eee31fe4464692997b5` |
| `approved/draft.json` | `12bac0f642ba01b68e48dd4073614740f7b0a9f36f06f1f09167a3eb12fe325f` |
| `approved/review.json` | `e9651aeb3901d1cb646d045c09ebf8406ff2bd099ff2de3193b15636cc78f5b2` |

The root `manifest.json` binds absolute existing paths to actual full-byte SHA values, including source trace byte snapshots, all owned records, input/approved copies, checker code and this report. Semantic hashes are separately named, not paired with file paths as byte hashes:

- `seed_canonical_sha256`: `fbf2fa5250f91b5ead00be8dfa529275fd764af846fdcf573703f4f48212ad0a`
- `draft_canonical_sha256`: `aefcc9139b9823be5f1d97638ea971d60e6adb3d94dbfdae7a7a5893730e7556`
- `review_canonical_sha256`: `bd784ff4299950fcae27ebad1f278ee524429b9ebcd2dff9e77897fe966217d8`
- `official_book_lesson_hash`: `cd1d1a62849d64781132b039bd48027abe98bc90142038319aa1cf4753fa25e4`

The last value is the official selected-book-lesson semantic digest, never claimed as the raw `book.json` byte SHA. Final manifest/report byte hashes are returned with the handoff; the manifest does not contain its own hash, avoiding self-reference. Stop at review; nothing was retained into product resources or published.
