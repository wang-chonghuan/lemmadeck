# phy6-c4-s11 Independent Text Review

Date: 2026-11-15. Role: independent TEXT reviewer, not Sagan's text author.
**PASS for the exact frozen TEXT candidate below.** No substantive text defect
found in the complete current source/candidate comparison. This is not figure
approval, complete-modern-lesson approval, adapt-finalize or promotion.

## Scope And Exact Freeze

Workspace: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Author work root: `.tmp/ld-s10y-lesson/text-author-c4-s11`.
Candidate directory:
`.tmp/ld-s10y-lesson/text-author-c4-s11/adapt/6p/modern-us-neutral/lessons/phy6-c4-s11`.

| Current file | SHA-256 |
| --- | --- |
| Author root `author-handoff.json` | `05fbd09876e18cfb0786336d8044beee3f8a824001c66dd6f78fceecc1067c9f` |
| Candidate `lesson.template.json` | `1b596f214fffb492a482e3c83cc1f6df848e302c45bb9dc5c0eda97c6e2ed80a` |
| Candidate `exercises.template.json` | `a353e2708557e3995a2c6b9c09b56cebf736b272e6a992857ea5faf17d9319d6` |
| Candidate prepare-only `figures.template.json` | `8a5b05d6a0151bcff32454ec480b47255025825e85809163bc44e90e8fba9d00` |
| Author root `author.md` | `6eda15c6646613c22d49ad8059c0a732bc2a4b51ded1db360ea38daf825ae42a` |
| Author root `text-only-mechanics.json` | `3ec58126759062e0e3dc3d7fc24bd003c652d04c466dcfeffb56227aeb9934d6` |
| Author root `prose-flow-final.json` | `e52782ef8d135e40b803a0158bf2690d0db81995c8e7ac25bbeb0d104491f270` |

All 11 entries in the handoff's `artifact_sha256` matched current bytes.
All 8 source bindings in that handoff matched current bytes. These read-only
identity checks do not substitute for the independent semantic comparison.
The handoff and both candidate hashes were confirmed again after that comparison.

Current durable raw root:
`ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c4-s11`.

| Raw file | SHA-256 |
| --- | --- |
| `lesson.json` | `f2a42c5b27bfad40aea19ca43b06ada2bb526de750938fb5111d78f1a3607244` |
| `lesson.md` | `6ab3acb78be03b0aedae633c00457d11176b3507f74d370f4af1e44dd6158f3d` |
| `exercises.json` | `e2a24b12961504603dee6ed8d2b53976932ea577c55f5b8e7345a8b6debb383b` |

Read all three raw files, the entire 602-line lesson candidate and 403-line
exercise candidate, including every upper block/prompt, source snapshot,
declaration and section anchor. Also read the author handoff/report, retained
mechanical/prepare/layout evidence and mechanical helper without executing it.
The lesson skill, edition-text contract and binding engineering charter were read.

Identity remains `phy6-c4-s11`, section number 58, original title
`大气压强的测量 托里拆利实验`, physical start 150 / printed start 139.
Raw and modern each retain 16 source prose objects: 13 text blocks, 2 figure
blocks and 1 caption. The retained final proseFlow has 16 text paragraphs.
All 8 written tasks remain separate: 3 questions and 5 exercises in 练习27.
No written task is replaced by prose, an example, an answer or a choice.

## Complete Prose Comparison

Indices below are zero-based `lesson.prose[]` indices, not printed line counts.
Each entry was compared with current durable raw text and its source page blocks.

| Index / source refs | Independent finding |
| --- | --- |
| 0 / `p0150#13`, `p0151#1` | Retains the §53 comparison, need for atmospheric thickness/density, lack of a definite boundary, density greatest at ground and decreasing with height, and the experimental alternative attributed to the seventeenth-century Italian scholar. “直接计算” qualifies this comparison; it does not claim atmospheric pressure cannot ever be calculated. |
| 1 / `p0151#2`, `#4`, `#6` | Full sequence retained: approximately 1m glass tube, one closed end, filled with mercury, finger closure, inversion into mercury bath, release below the mercury surface, some mercury leaving and about 760mm remaining. No step or “约/左右” qualifier removed. Historical-description/non-operating-guidance wording bounds the mercury procedure without deleting its instructional mechanism. |
| 2 / `p0151#3` | Original body figure `fig-146`, label and page unchanged; no replacement state or new reading inserted into text. |
| 3 / `p0151#5` | Caption remains `图 146`, separately bound; the page's same-row caption does not enter the experiment sentence. |
| 4 / `p0151#7` | Atmospheric loading of the bath, mercury equilibrium, pressure equality at horizontal plane `$aa$`, and column weight explanation all remain. Both `$aa$` occurrences survive unchanged. Absence of air/vacuum is expressly the lesson's model, not a new claim of physically perfect vacuum in every real instrument. |
| 5 / `p0151#8` | Atmospheric pressure equals column-produced pressure under that experiment model; qualification is consistent with the preceding vacuum statement. |
| 6 / `p0151#9` | Complete emphasized measurement conclusion retained. Joining adjacent bold fragments and normalized line ending changes presentation, not the relationship. |
| 7 / `p0151#10`, `p0152#1` | Increasing atmospheric pressure means increasing column height; both millimetre and centimetre units retained. The 780mm example retains the essential **vertical height** interpretation, not tube length, volume or mass. |
| 8 / `p0152#2` | 1mm-high mercury column as a pressure unit and comparison with pascal retained. Pascal here is a unit, not a historical-person declaration. |
| 9 / `p0152#3` | Introduces the same 1mm calculation, now explicitly identifying the source's rounded approximate relationship. |
| 10 / `p0152#4` | Exact source mathematics retained: `$p=9.8$牛顿/千克$\times13600$千克/米$^3\times0.001$米$=133$帕斯卡`. Units, exponent 3, all factors and equality unchanged; final Chinese punctuation is outside math. |
| 11 / `p0152#5` | Complete emphasized `1毫米高水银柱=133帕斯卡` conclusion retained, expressly under the source's integer-rounding approximation. |
| 12 / `p0152#6` | Daily height observation, increase/decrease, atmospheric-pressure variability and its weather relationship all retained; source attribution adds no new historical priority claim. |
| 13 / `p0152#7` | Vertical scale attached to the Torricelli tube, mercury barometer name and pressure-measurement purpose retained. |
| 14 / `p0153#11`, `p0154#5` | Full biography retained: complete source name, 1608-1647, Italy, Galileo's student, barometer invention, atmospheric-pressure explanation and other physics/mathematics work. “本教材的科学史介绍记述” limits these to the source account. |
| 15 / `p0153#10` | Stable unnumbered portrait identity `tbl-p0153-02` retained with null printed label and body ownership, not reassigned to exercise 5 or numbered figure 148. No portrait content approved by this TEXT review. |

Independent text-arithmetic check gives `9.8 × 13600 × 0.001 = 133.28`;
133 is consistent with the explicitly stated integer approximation in indices
9 and 11. The candidate does not claim a newly exact 133Pa conversion, replace
the printed equation, insert an erratum or change any source number.
The unit product is pressure: N/kg times kg/m^3 times m gives N/m^2.
`numeric_changes` and `errata` remain empty; there is no unauthorized formula
correction. The ideal-vacuum qualifications at indices 1, 4 and 5 are coherent.

## All Eight Prompts

Every task retains its stable `number`, printed `source_number`, `group`,
`group_id`, page references, `figure_refs` and unique-display `figures` array.
Source text snapshots remain exact; normalized `lines` follow current text,
not the original physical line wrapping.

| Group / stable number / refs | Independent comparison |
| --- | --- |
| 问题 `g1/1`, `p0152#9` | Retains explanation of why the liquid bottom/wall calculation does not directly apply to air. Both bottom and wall objects remain; only 象→像 changed. |
| 问题 `g1/2`, `p0152#10` | Still asks how to measure atmospheric pressure with the Torricelli tube. No supplied explanation, computed value or new figure reference. |
| 问题 `g1/3`, `p0152#11` | Retains the exact quoted 780mm mercury-column statement and asks its meaning; not replaced by the 760mm experiment case. |
| 练习27 `g2/g2-1`, `p0153#2` | Water immersion, inversion underwater, mouth downward, slow raising and **rim still underwater** condition all retained, followed by the explanation request. |
| 练习27 `g2/g2-2`, `p0153#3` | Retains fig147, Pascal, source date 1646, water barometer, 760mm mercury-equivalent atmospheric pressure and request for water height. Source attribution and 制做→制作 add no new numerical answer. |
| 练习27 `g2/g2-3`, `p0153#4`, `#6` | Retains Otto, Magdeburg, 1654, two joined metal hemispheres, evacuation, atmospheric compression, eight pairs of horses, fig148, given 2800cm^2 and the requested pressure force. The force request after the intervening fig147 remains part of this same task. No replacement area, pressure value or pulling-force answer was added. |
| 练习27 `g2/4`, `p0153#8` | Water in glass cup, paper covering, holding paper during inversion, downward mouth, releasing that hand, fig149, water retention/paper staying at rim and the “why” request remain. No new seal, capacity or guaranteed operating specification. |
| 练习27 `g2/5`, `p0153#9` | Retains 1m tube, one closed end, switched other end, prior evacuation, immersion of switched end, opening, and both separate questions: whether mercury fills the tube and what changes with water. No orientation/ambient-pressure assumption or answer inserted. |

Source limitations are not silently repaired by this edition: `g2-3` does not
explicitly give a numeric atmospheric pressure or disambiguate curved surface
area versus the directional resultant. Exercise 5 does not explicitly specify
tube orientation or ambient pressure. Those same limitations remain in the
candidate; TEXT PASS is not a claim of a uniquely specified numerical answer
to every question. Later answer work must state necessary assumptions rather
than treating them as new seed givens.

## History, Ownership And Boundaries

All item-local historical declarations were checked against both source_text
and modern text and their stated refs. Torricelli/Italy in index 0; Torricelli
in indices 1, 4, 6, 7, 12, 13; the complete Torricelli name/Italy/Galileo in
index 14; Torricelli in question 2; Pascal as a person only in `g2-2`; Otto
and Magdeburg only in `g2-3`. No fictitious modern identity replaces a real
source person, and units named pascal are not misdeclared as a person.
Dates, nationality, teacher relationship and eight-pairs claim are retained
as this textbook's account; no external historical verification was performed
or claimed. No new country, institution or biography fact was introduced.

Read current page.md files 0150-0154 for the referenced blocks and page155
only as right-boundary context. The actual page.json blocks at every one of
the lesson/exercise refs were independently displayed and compared:

- `p0150#13 open` + `p0151#1 cont` closes “不行的” and the complete introduction.
- `p0151#2 open` + `#4 cont/open` + `#6 cont` closes the experiment around the
  body fig146 and same-row caption `#5`; no caption is appended to prose.
- `p0151#10 open` + `p0152#1 cont` closes the units/780mm explanation.
- `p0153#4 open` + `#6 cont` closes exercise27 question3 around fig147,
  without reassigning that figure or confusing the repeated printed question3.
- `p0153#11 open` + `p0154#5 cont/open=false` closes the biography's “升高”
  and final physics/mathematics sentence. The current §58 object ends here,
  before `p0154#6` starts §59. Page155 belongs to that following unit and is
  not approved or included in this candidate.

Text ownership remains: fig146 in body with its caption; fig147 in exercise
`g2-2`; fig148 in `g2-3`; fig149 in `g2/4`; unnumbered portrait explicitly
`owner-lesson phy6-c4-s11`. Page154's qualified owner `g2-4` refers to this
group's printed question4; the existing raw stable number remains `4`.
All five figure IDs/source metadata agree across raw, upper candidate and the
prepare-only manifest. Hash checks of originals verify identity only, not pixels.
No modern figure output or independent figure approval is supplied by this task.

Read all 16 retained final-flow paragraphs. The candidate's five `{before,
after}` strings exactly equal the retained actual CLI flow objects at positions
2, 4, 9, 13, 15. Each pair is genuinely adjacent: introduction→historical
procedure; procedure→equilibrium explanation; height/780mm→units; rounded
conversion→variation/weather observations; barometer definition→biography.
No formula, premise/conclusion or exercise is removed or reordered by those
boundaries. Positions were taken from the retained actual flow, not guessed
from source-block counts. No flow command was rerun.

## Reused Mechanics And Review Actions

Existing `text-only-mechanics.json` is current/hash-bound, status pass, recorded
exit0, one substantive author invocation, 24 targets, errors0, KaTeX warnings0.
Its helper was read: it invokes existing lesson APIs for source snapshots,
identity/refs, errata, text/numeric/formula signatures, historical profile,
official normalization, anchors and figure-reference membership. It is not a
figure-output gate. This report reuses that execution, not reruns it.
The two prepare import failures and one successful delegated prepare, one
environment probe failure and one normalization/anchor enumeration remain
visible in the author execution evidence; none were erased or repeated here.

Independent actions: complete file reads (`cat`, `nl`, `sed`), `shasum -a 256`,
read-only Node JSON projection/current-hash comparison and simple equation
arithmetic. No helper/gate/test/finalize/assemble was executed. No browser,
image generation, network/model service, DB, Git, app/schema/dependency,
source/candidate edit, figure rerun or promotion. No answers, choices,
main private reports or other agents' solutions were read. The only new
write is this independent report via `apply_patch`.

**Result: TEXT PASS, exact hashes above.** Figure approval and complete lesson
readiness remain separate; in particular the not-yet-authored modern146/149
cannot be treated as approved from this report. Any candidate byte change
requires a new appropriately scoped review; this report must remain unchanged.
