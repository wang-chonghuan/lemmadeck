# Answer Candidate Source Verification

Ticket: STEMROBIN-180/180-7
Lesson: 8p / modern-us-neutral / phy8-c1-s1-n7
Stage: ANSWER author candidate, pending parent independent review and gate 2.

The complete independent-source-solution.md was recorded before the
choice draft was written. The choice draft then passed structure-only
validation before lesson_answers.py prepare was invoked.
No answer-book, existing answer key, or raw-source review was read
during the CHOICE stage.

## Prepared Evidence

Command:

```text
python3 .claude/skills/ld-s10y-answer/tools/lesson_answers.py prepare --book 8p --edition modern-us-neutral --lesson phy8-c1-s1-n7 --work .tmp/180-7-n7-choice/answer-prepare
```

The existing tool produced exactly three exercise templates, in order
1, 2, 3. All were marked source=derived; no matching bookRaw was supplied.
The template remains unchanged under the owned scratch directory.
No unsupported claim about the entire answer book is inferred from this.

## Modern / Source / Spec Agreement

The actual source PNGs and complete current-SVG browser images were
already viewed once during the CHOICE stage. Their observations are
reused here; no image was reopened.

Figure 29 FigureSpec was read only in the ANSWER stage. Its source.image
names the PNG actually viewed. common-initial-position is (0,3);
constant-position-end is (8,3), with a horizontal dashed segment.
motion-line-2 joins (0,3) to (3.333333333,8), with printed v_2=1.5 m/s.
motion-line-4 joins (0,3) to (5,-2), with printed v_4=-1 m/s.
The finite decimal endpoint is a rendering approximation to 10/3 s;
the authoritative printed velocity 1.5 m/s is used for exact solving.
These facts agree with both source pixels and the complete modern SVG.
At t=3 s the corresponding coordinates are 7.5 m and 0 m.

Figure 28 FigureSpec was read only in the ANSWER stage. Its source.image
names the PNG actually viewed. graph-A=(0,3), graph-backward-end=(-30,0),
graph-positive-end=(30,6), and the solid/dashed segments join those
collinear points. Time ticks are 10 s apart and coordinate ticks are
1 m apart. The independently obtained +0.1 m/s slope agrees with
these relationships; the graph has not acquired a speed-answer label.

## Candidate Answers And Grading

1. Rest at x=3 m; v_x=0 m/s. Full explanation in displayAnswer.
   ungraded, because the original task asks for a verbal motion
   interpretation and multiple equivalent explanations are valid.
2. Separation at t=3 s is 7.5 m. The display gives both positions,
   their absolute difference, and an independent relative-motion
   cross-check. One auto numeric part expected=["7.5"], unit="米".
3. Magnitude 0.1 m/s; positive X direction. The display separately
   states both requested results, their units and signed slope, then
   cross-checks the negative-time continuation. ungraded, because
   the original direction response is natural language; grading
   just a numeric magnitude would not judge the complete task.

For ungraded exercises, parts must be empty under the existing cap2
contract. The displayed answers still contain every requested result
and derivation. No keyboard or interaction contract was created.

## Pending Boundary

This file records author source verification, not an independent
mathematical PASS. The answer document remains status=draft.
No gate-2 approval, MathLive editing check, finalize command, ready audit,
choice retention, display integration, publication, DB operation,
Git write, installation, or new-agent operation was performed.
