# Independent modern TEXT review: n144 / b83

**Verdict: REVISE**

Date: 2026-11-18.
Ticket / session: STEMROBIN-180 / 180-3.
Checkout: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Branch recorded in ticket.json: `codex/STEMROBIN-180-textbooks`.
Target: `7p / modern-us-neutral / phy7-c2-s3-n144`, title `电功`.

One substantive independent text review; zero images opened.
The already-passed source stage was reused under the direct instruction, not reviewed again.
The modern table is PENDING and is NOT approved by this report.
No product or candidate file was edited. No Git/DB operation, finalization, normalizer,
checker, test, build, publisher, tool change, other-chat operation or descendant was used.
Read-only JSON counts, hashes and arithmetic are evidence, not pipeline validation.

## Finding and exact affected site

**[P2] Disclose the worked example's rounded calculation in the lesson text.**

Candidate:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b83-n144-source/artifacts/7p/editions/modern-us-neutral/lessons/phy7-c2-s3-n144/lesson.template.json`

Required text change: `/prose/15/text` (zero-based; raw object 16),
line **202**, source_refs `["p0367#6"]`.
This is the useful-work calculation immediately after table object
`tbl-p0367-01` and immediately before the J-to-kJ continuation.

The source and candidate both preserve:

```text
$A_1=\frac{4000000\text{ 焦耳}\times80\%}{100\%}=3200000$焦耳
$=3.2\times10^6$焦耳$=3.2\times10^3$千焦耳。
```

The given motor conditions are 220 volts, 5 amperes, 1 hour, 80% efficiency.
Independent arithmetic gives 220 * 5 * 3600 = 3960000 J and useful work
3960000 * 80 / 100 = 3168000 J. The source table uses rounded 4000000 J;
applying efficiency to that rounded value gives 3200000 J.
Thus the source's rounded route is mathematically coherent as an approximation,
but the current modern prose nowhere tells the learner that the displayed
useful work is approximate. Source/context disclosure outside the learner text
does not supply that explanation.

Add one brief prose sentence before the unchanged formula at the specified site,
on a separate line. A sufficient wording is:

```text
表中先把电流所做的功取近似值，再按效率计算有用功，因此下面给出的有用功也是近似值。
```

This clarification explains the preserved source calculation; it neither introduces
a new scientific result nor substitutes exact values for source values.
Retain every existing `$...$` fragment, numeral, unit, object identity and source_ref.
Keep `/prose/15/source_text` (line 207) and the complete `/source` snapshot unchanged.
Record the prose edit using the existing permitted non-math editorial convention;
the related declaration site is `/prose/15/changes` (line 208).
No new numeric-change record, `math-correction`, registered erratum or tool category
is requested. No section_break anchor or exercise needs changing for this local insertion.

This is a local, repairable explanatory-text defect, not a permanent science veto.
Do not silently replace 4000000/3200000 with 3960000/3168000 or mutate equality
symbols inside the formulas. Both canonical source pages have empty `errata`.
The pending modern table must be handled separately; this verdict does not approve
its values, language, visual implementation or any equation shown inside it.

## Independent order and authority

Before opening either candidate or any author report, the reviewer read:

- `.intentfold/readme.md`, project.json, ticket.json and the engineering/product charter.
- Lesson SKILL.md, including the cap4 text gate, edition-text-contract.md and production-resume.md.
- Canonical raw n144 lesson.json and exercises.json, and source366/367 page.md and page.json.

The independent outline, all 17 object identities, exact mathematical fragments,
numerals and source_refs, and both questions with independently derived solutions
were then frozen by apply_patch in:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b83-n144-text-review/expected-baseline.md`.

Frozen baseline SHA-256:
`a29afb3ac5f6dc62ba68011665259dee1289324e91221fd4b3063f334f8ad79f`.

Only after that write were the two authored candidates under
`.tmp/ld-s10y-lesson/b83-n144-source/artifacts/7p/editions/modern-us-neutral/lessons/phy7-c2-s3-n144/`
opened in full. No untouched adapt-path template was substituted.
No author report was needed or read.

## Complete object review

The table below uses 1-based canonical `prose` order, not rendered paragraph numbers.
All objects retain their kind, id, label, printed_page and exact source_refs.
All 17 `source_text` values match the corresponding canonical raw text, and the
complete candidate `source.data` snapshots match their canonical JSON objects.

| Object | Source refs | Complete text assessment |
| --- | --- | --- |
| 1 | p0366#3 | Unit-charge voltage premise, proportional charge/work reasoning and multiply-voltage-by-charge conclusion retained. Opening question and complete sentences separated for short reading. |
| 2 | p0366#4 | Verbal work = voltage times charge equation retained; only terminal punctuation changed. |
| 3 | p0366#5 | Formula introduction retained; colon added outside mathematics. |
| 4 | p0366#6 | `A=Uq` retained byte-for-byte inside math; punctuation outside math localized. |
| 5 | p0366#7 | A/work, U/voltage, q/charge definitions retained. |
| 6 | p0366#8 | Measuring current and duration to obtain charge retained. |
| 7 | p0366#9 | `q=It` retained; period localized outside math. |
| 8 | p0366#10 | Substitution link to convenient electrical-work expression retained. |
| 9 | p0366#11 | `A=UIt` retained; period localized outside math. |
| 10 | p0366#12 | Bold verbal product law retains voltage, current and elapsed-time factors. |
| 11 | p0366#13, p0367#1 | Cross-page unit sentence complete: J, V, A, seconds; both refs preserved. |
| 12 | p0367#2 | Four unit coefficients and joule = volt times ampere times second retained; terminal punctuation outside math. |
| 13 | p0367#3 | Three instruments, dedicated electricity meter and combined measurement function retained. Dated near-universal household claim becomes neutral household use; culture/layout declaration matches this change. |
| 14 | p0367#4 | Motor identity, 5 A, 220 V, 1 hour, 80% efficiency and useful-work demand retained. No U.S. domestic-voltage substitution or added condition. |
| 15 | p0367#5 | One empty-text BODY table object `tbl-p0367-01` retained in the original position and registry; no exercise ownership. Image content excluded and pending. |
| 16 | p0367#6 | Entire 4000000 J / 80% / 100% / 3200000 J formula preserved. REVISE only for missing nearby approximation disclosure, as specified above. |
| 17 | p0367#7 | Continuation `=3.2*10^6` J `=3.2*10^3` kJ retained, including exponents and units; adjacent to object 16 without an inserted concept boundary. |

No scientific object was omitted, duplicated or moved. All raw lesson metadata,
including null chapter, printed title/section, number 144, start pages 366/355,
exercise_count 2 and the single table registry entry are preserved.

## Questions and independent solutions

Both questions retain their exact canonical `text` and `source_text`.
The source's Q1 line wrap becomes a single complete candidate line without changing
the question; Q2 already has one complete line. Neither question has subquestions.
There are no exercise image references, attached figures or answer leaks.
No candidate answer keys were present or required for this text review.

| Question | Frozen identity and binding | Independent solution and identity verdict |
| --- | --- | --- |
| Q1 | number/source_number `"1"`; group `"**问题**"`; group_id `"g1"`; pages `["p0367#9"]` | Work equals circuit voltage times passed charge: `A=Uq`. For fixed U, work scales with q. A in J, U in V, q in C. PASS: the demand remains voltage-charge-work, not power or efficiency. |
| Q2 | number/source_number `"2"`; group `"**问题**"`; group_id `"g1"`; pages `["p0367#10"]` | Use `q=It` in `A=Uq`: `A=UIt`, with V, A and seconds giving J. PASS: distinct voltage-current-time representation is retained. |

## Culture and short-flow boundaries

The text remains Chinese; Latin scientific variables are unchanged.
No fictional Soviet/foreign person, Cyrillic token or historical entity requiring
an exemption occurs. All `historical_entities` and `numeric_changes` arrays are empty.
The household-meter wording is a neutral context update, not a change to the science.

Complete sentence lines, the stand-alone formulas and the example introduction
preserve the source's argument. The two meter paragraphs contain two sentences each;
the opening and worked-example groups are short, with no source line-wrap fragments.
All three authored `{before, after}` boundaries are conceptually appropriate:

1. Symbol definitions to deriving charge from current/time (lines 268-269).
2. Work product law to unit discussion (lines 272-273).
3. Practical meter measurement to the worked motor example (lines 276-277).

These anchors refer to the actual adjacent candidate text, not numeric block
positions; the table-to-useful-work-to-unit-conversion chain has no section_break.
This is a text-only assessment of the written anchors. No prose_flow,
normalizer, renderer or runtime checker was run, and no rendered-layout approval
is claimed. The required clarification at object 16 leaves these three anchors unchanged.

## Hashes and counts

SHA-256 values bind the bytes actually read, not approval of future revisions.
Canonical paths below are relative to
`/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7p/`.

| Canonical input | SHA-256 | Bytes / counts |
| --- | --- | --- |
| lessons/phy7-c2-s3-n144/lesson.json | d940449358aae6e67c4fa789e99feab226d5882595c404f85456e78d141824f8 | 4799 bytes; 17 objects (16 p + 1 fig); 18 source refs; 20 math fragments; 20 numeral tokens |
| lessons/phy7-c2-s3-n144/exercises.json | a7e8b0a5ebbc352d20b278678097edee7a1f4db6139f501860bc3d34a7884ada | 936 bytes; 2 questions; 2 source refs; 2 math fragments; 2 numeral tokens |
| pages/0366/page.md | 6382d51e647218a449778c7167be4fd04a71be533a76cae4dee836005fbddaea | source366 text |
| pages/0366/page.json | 696b9d6b8431f2862a0cf47ae7d5d6eb9cc69b356876eadb3a1ac8bd1eb6bb02 | 21 printed text lines; 0 errata |
| pages/0367/page.md | f5ce304c0bff3ce4001bbedc63870eb68f14d7b325a4e4cbe6c44112dddd4da7 | source367 text |
| pages/0367/page.json | 4a875f177690acae18bb28de5f68e98382ecd5c5d953feb50eec532875ad33a0 | 16 printed text lines; 0 errata |

The b83 candidate-root copies of all four page text/JSON files have the same hashes
as the canonical files above. No source image bytes were opened or hashed.

Candidate root:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b83-n144-source/artifacts/7p/editions/modern-us-neutral/lessons/phy7-c2-s3-n144/`.

| Authored candidate | SHA-256 | Bytes / counts |
| --- | --- | --- |
| lesson.template.json | a2f6a82ee3a9b29dcd7fe0c09ca2943d872446d7ded1e6b42dfc4a815e2ba3c8 | 13105 bytes; 17 objects (16 p + 1 fig); 18 source refs; 20 math fragments; 20 numeral tokens; 3 section_breaks; 0 errata |
| exercises.template.json | 20a4058270ddfd28ae709068b2f97d145e092dd04bd77bf51eeac6cd50d915ca | 2580 bytes; 2 questions; 2 source refs; 2 math fragments; 2 numeral tokens |

Fragment counts include all inline `$...$` occurrences, including variables, operators,
unit coefficients and question-number markers. Numeral counts are occurrences in
target `text` only, including formula subscripts and exponents; they exclude
metadata, source snapshots and section anchors. Counts are supplemental to the
complete per-object comparison, not evidence by themselves of scientific equivalence.

Final scope: REVISE the one explanatory-text site. All other reviewed text,
source bindings and question identities pass this substantive review.
No PASS_TEXT_ONLY is issued for the current candidate hash.
