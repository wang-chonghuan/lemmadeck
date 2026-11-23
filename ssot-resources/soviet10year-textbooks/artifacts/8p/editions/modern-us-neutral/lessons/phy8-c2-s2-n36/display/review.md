# n36 display review

2026-11-23. PASS for the current retained n36 modern lesson, ready answers and
reviewed choice-set. This is offline display evidence, not a DB or live-product
publication claim.

The official single-lesson render completed: 18 rendered prose paragraphs,
5 written exercises and 5 choices. The ticket's `180-7-n36-display.mjs` used
the app's installed Playwright and isolated headless Chrome, then closed it.
Desktop 1440x960 and mobile 390x844 were checked across text, exercises and
choices. The first script failure and its narrowly corrected assertion are
preserved in `first-script-failure.md`; two completed desktop observations were
reused and the remaining four surfaces passed in the recovery call.

The six sibling PNGs were actually opened in one batch, with no reopens:

- `desktop-text.png` and `mobile-text.png`: complete prose, bold definition and
  conclusion, vector notation, fractions, superscripts and final navigation
  remain legible. There is no first-line indentation or incoherent overlap.
- `desktop-exercises.png` and `mobile-exercises.png`: all five original prompts
  and five complete reference answers are visible. Long formulas wrap within
  the content column; the last Mars conversion and result are present.
  There are no answer inputs or mathematical keyboards in this read-only view.
- `desktop-choices.png` and `mobile-choices.png`: all five stems and 20 options
  are visible, including each final option. Native disabled preview markers
  distinguish one multiple-choice question from four single-choice questions.
  No key, rationale or correctness marking is exposed.

Automated observations in `check.json` assert nonblank content, no KaTeX errors,
loaded fonts, zero page overflow, reachable page ends and no console/page errors.
Prose mathematics uses KaTeX_Main at least 1.09 times the parent prose size.
These observations do not establish live selection, grading, SPA navigation,
DB content or shared keyboard behavior; those unchanged features were not
retested. No new interaction specification was produced.

Source/mathematics review is separate in the raw lesson's
`independent-review.md`, `source-first.md` and `view-first.md`; the choice
snapshots remain in `choice-set/`. Only answer finalization metadata changed
after its mathematical review. The display render used the ready answer file.
The approved content and display contract were not edited after this check.

Parent image loads for this resume: 5 preceding source images plus these
6 screenshots = 11. This display batch has 6 images, no crops or reopens.
