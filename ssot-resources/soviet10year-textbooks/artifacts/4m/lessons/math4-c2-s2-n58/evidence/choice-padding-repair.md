# N58 q09 Padding Repair

The first internal comparison returned REVISE, and its official review validator
exited 3. The reviewed draft, views and review are preserved in
`choice-padding-first-revise/`; the independent internal-comparison report
remains unchanged. Earlier answer-position repair has its own retained first
failure and passed affected review.

This is the first local repair of the newly discovered q09/A padding defect.
Padding each fractional digit string on the left to three places maps 13.75 to
13.075, 8.2 to 8.002, and leaves 0.115 unchanged. Their sum is 21.192.
The draft had instead used 8.020 and 21.210, contradicting its stated procedure.

Only q09/A's displayed false value and internal derivation are corrected.
The source, stem, correct option B (22.065), option C, misconception description,
option order, all other questions and all figure assets are unchanged.
Ordering repairs: 1. q09 padding repairs: 1. Figure-222 label repairs: 1.
No counter is reset and no original failure is removed.
