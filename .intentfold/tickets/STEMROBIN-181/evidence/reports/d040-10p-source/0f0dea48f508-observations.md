# D039 Independent SOURCE Review

Workspace: `/Users/yong/.codex/worktrees/00b1/lemmadeck`

Frozen author SHA256: `fdd20c373729fd2047b193f1fec1b3a8f0f70c237e8e83dff406e6deb0f4d1d1`

## Outcome

FAIL. Exercise 3, question 9, physical page 103 / printed page 93,
prints `I_1=15000` amperes. Both the frozen candidate at line 52 and the
finalized page at line 72 instead contain `$I_1=1500$`.
The finalized JSON has the same error in block `p0103#10`, first string in
`blocks[9].lines`. The extra source zero is unambiguous in the eighth image,
`physical-103-exercise9.png`, cropped without rescaling or annotation from
the original page at half-open coordinates `[200,1100,1410,1330]`.

Required text correction, not executed: replace only `$I_1=1500$` with
`$I_1=15000$` in this exercise. Retain `U_1=11000` V, `I_2=1440` A,
`U_2=110` kV, the physical wrap after `U_1`, and the final efficiency question.
This is a transcription error, not a source printing error or modernization.
The stored 19/19 finalize PASS does not establish digit fidelity.

## Original Pages

- Physical 100 / printed 90: all prose compared individually. The first
  `p cont` completes the allowed physical-99 tail text after
  `变压器把线路中的`. The motor/lighting paragraph, staged voltage reduction,
  Figure 63 reference and separate caption, corona paragraph, DC transmission
  paragraph, and final rectification fragment are faithful. The focused
  source crop confirms `开始电晕放电`. The final `p open` ends in `直`.
- Physical 101 / printed 91: the leading `p cont` completes `直|流电`.
  The joined-power-network paragraph ends
  `苏联的欧洲部分统一电力系统已经使用.` before the literal 36 heading.
  The historical name, initials, quotation, 1920, 1913, factor 4, ten-year
  interval, 1947, rankings, and 1921 are preserved. The final `p open`
  ends in `计`.
- Physical 102 / printed 92: the leading `p cont` completes `计|划的第一年`.
  The nearly-fivefold comparison, 20 percent, anniversary 50, 500000 kW,
  six million kW, one/two/three million kW, twenty-fifth congress, and
  500000/750000/1150000 V are faithful. The station names and remaining
  prose match the source. The separate rubric reads `问题`; all four
  printed questions are complete and independently numbered.
- Physical 103 / printed 93: the separate heading is `练习 3`. Tasks 1-9
  are continuous with no omitted task or outgoing open task. Tasks 1-8
  are faithful, including `125` revolutions/minute, `布拉特斯基`, the
  number of magnetic-pole pairs, and the Figure 63 reference with the
  loss-neglect condition. Task 9 has the one blocking digit omission
  above; its other values, subscripts, units, wrap, and final question match.

All four printed footers, 90-93, are present as `foot`. No explanatory
footnote appears on any of these four pages. No next-page pixels were read.

## Rubric and Card Boundaries

The actual TOC has n35 at printed 89, n36 at 91, the distinct Exercise 3
card `phy10-c1-s4-t7` at 93, and n37 in the next chapter at 94.

n35 ends immediately before `p0101#3`, the literal 36 heading. Figure 63
is explicitly cited by n35 prose before that heading. Its additional
exercise reference is task 8 of the distinct Exercise 3 card, not a reason
to move the figure into n36 or duplicate it on physical 103.

The physical-102 `问题` is an `exhead`, not an h3 or separately listed TOC
card. It follows n36 prose and precedes the distinct Exercise 3 heading
on physical 103. Under the source-card convention its questions 1-4
remain in n36's source card. Their subject matter reviews chapter topics
including AC, generators, transformers, and transmission. This binding
comes from actual source order and the TOC, not from an assumption that
the questions must have the same subject as n36's historical title.

n36 closes after physical-102 question 4, before physical-103 Exercise 3.
Exercise 3's nine tasks finish on physical 103, ending
`千伏. 求变压器的效率.` The next chapter start is known from the TOC only;
physical 104 was not inspected. No full n35 or downstream publication
approval is conferred by this bounded review.

## Figure 63 Exact Source Crop

The finalized source crop contains a sinusoidal generator symbol and
`发电机`, input `11 kV`, one `升压变压器`, three `降压变压器` boxes,
the complete paired-wire transmission path, three `输电线` labels,
the terminal `接用户`, and all upper/lower/right branches.

Printed voltage labels: one 11 kV, one 110 kV, three 35 kV,
three 6 kV, and four 220 V labels. The text, generator outline,
rectangular station outlines, and wires are uncut. The page caption
`图 63` and neighboring prose are excluded. Incidental source specks
are not interpreted as circuit objects. This is PASS for the exact PNG
crop only, not for a redraw, SVG, modern figure, or answer.

## Evidence Scope and Independence

Exactly eight images were loaded: four individual original pages, one
exact finalized Figure 63 crop, the two frozen author text crops, and
one reviewer Exercise 9 close-up. No image was reopened.

An unrelated D037 review JSON was read during path discovery as a path
and format precedent. No D039/D038 verdict or previous gate was used to
adjudicate these pages. All findings here derive from the eight current
image openings, the frozen current transcription, actual TOC, and the
physical-99 tail text. The unrelated review is not evidence for this verdict.

Only this review's JSON and evidence directory were written. No author,
source, canonical, app, skill, Git, DB, browser, agent, or supervisor
operation was performed. No prepare, finalize, recount, SVG generation,
assembly, promotion, or publish was run.
