# STEMROBIN-180/180-7 Summary First Display Observation

Verdict: **PASS**, desktop/mobile offline text display.

Date: 2026-11-23. Lesson: `phy8-c1-s1-t12`, edition `modern-us-neutral`.
Same sole independent reviewer, not author. Every exec used explicit cwd
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.
First display invocation: **1**. Reviewer-requested revisions: **0**.
No first display failure occurred; no repair or retry was performed.

## Actual Execution and Scope

Executed exactly once:

```text
node .intentfold/tickets/STEMROBIN-180/tmp/180-7-summary-display.mjs
```

Actual exit code: **0**. Actual stdout:

```json
{"lesson":"phy8-c1-s1-t12","status":"pass","output":"/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180/ssot-resources/soviet10year-textbooks/artifacts/8p/editions/modern-us-neutral/lessons/phy8-c1-s1-t12/display","surfaces":2}
```

The existing script used isolated **headless Chrome**, separate fresh browser
contexts for desktop and mobile, no user profile or signed-in session, and
deleted `PWDEBUG` before launch. It loaded the already rendered local
`text.html`; it did not rerun rendering. Contexts and browser closed in
the script's `finally` blocks before the successful command returned.
Both actual checked surfaces were `text`. No answer/exercise/choice browser
surface, app behavior, production site, or DB was exercised.

## Reused Source and Text Approval

Reused unchanged raw summary source PASS and first modern-text PASS, rather
than reopening or repeating either review. Their exact bindings are below.
The current raw `lesson.json`, `lesson.md`, and `exercises.json` match the
first modern-text binding. The three prepared templates also retain their
reviewed hashes.

The finalized modern lesson equals the approved prepared lesson exactly
except for `status: draft` becoming `status: ready`. All five raw-derived
prose objects, their source references, formula/variable/sign meanings,
and the two full-text section anchors are unchanged. Six displayed
paragraphs still derive from those five objects. Raw and modern `title`
and `printed_title` remain `**第一章提要**`; `number` remains JSON `null`.
No page54 or next-chapter content is present.

The existing adaptation audit is PASS, with five prose blocks, four
layout-changed blocks, two resolved section breaks, zero exercises/figures,
and no errors. The existing answer audit is PASS0 with an empty answer
inventory. These are retained parent outputs, not new finalize executions
or answer-content approval by this reviewer.

## Geometry and Visual Observation

Opened both newly produced full-page screenshots once, in order desktop
then mobile. No crops, image reopens, or extra screenshots were requested.

| Surface | Actual viewport | Screenshot pixels | Document scroll width | Paragraphs | Borders | Body / math size |
| --- | --- | --- | --- | --- | --- | --- |
| Desktop text | 1440 x 960 | 1440 x 960 | 1440 | 6 | 2 at 1px | 16.96px / 18.656px |
| Mobile text | 390 x 844 | 390 x 1135 | 390 | 6 | 2 at 1px | 16.96px / 18.656px |

Both saved checks show six `0px` paragraph indents and five formula/variable
font observations using `KaTeX_Main, "Times New Roman", serif`.
The observed math/body ratio is **1.10** on both surfaces; the script's
lower-bound assertion is 1.09. No horizontal overflow occurs.
Both results have console/page errors0, raw markup false, visible written
questions0, answer blocks0, choices0, and media0.
The script also passed its clean-title/bold-weight, no KaTeX error,
no enabled input/math-field/textarea, nonblank-content, and bottom-reach
assertions.

Desktop visual observation: the centered reading column is unobstructed;
the bold heading reads exactly "第一章提要", without visible Markdown
asterisks or an invented numeric prefix. The printed40 metadata is distinct
from the title and body. All six paragraphs and the final rest/reference-frame
sentence are visible in the viewport. Formula `x=x_0+vt` and inline
`x`, `x_0`, `v`, uppercase `X` are legible, with a clear subscript zero.
No text or math overlaps another line.

Mobile visual observation: the same complete content wraps naturally inside
the narrow reading area. The heading fits without clipping. Formula and
variables remain readable at body scale, and Chinese punctuation is not
stranded as leaked math/source markup. Paragraphs, equation text, section
rules, and the bottom link do not overlap. The final sentence is fully
present in the full-page capture and was reachable by the script's bottom
scroll, without horizontal scrolling.

Both visible rules occur at the approved transitions: before uniform motion
and before relativity. There is no rule between the coordinate formula
paragraph and its variable/sign explanation, or between the two relativity
paragraphs. The DOM check's expanded KaTeX text in saved section metrics is
not duplicated visible formula text; the actual screenshots show a single
rendered formula.

No answer key, rationale, enabled response control, raw HTML tag, Markdown
heading marker, or source-page footer is visibly leaked into the lesson.
The existing bottom "去做题 · 0 道" link reflects the empty exercise inventory;
its navigation was not tested or approved in this text-only observation.

## Exact Current Bindings

Paths in this table are relative to the modern lesson directory
`ssot-resources/soviet10year-textbooks/artifacts/8p/editions/modern-us-neutral/lessons/phy8-c1-s1-t12/`.
The generated `display/check.json` binds the current lesson, exercises,
figures, and empty answers; those four recorded hashes were verified against
the actual files. No existing failure or evidence file was overwritten.

| File | SHA-256 |
| --- | --- |
| `lesson.json` | `ca20c88760018e0c5787e3d20c4c53906b5019039c5bbf9833d9c710cadd684a` |
| `exercises.json` | `c5884a93de58242d434ecc7218ddf8c0c82405824a7a0ae7560a89567a235372` |
| `figures.json` | `43e0002bfacd603593f688c1beb5555f4f3d0a4e3865a5a5194e31ee6ef9e4ad` |
| `answer-keys.json` | `ec27deb8d32e09d3e7176b968ace7808b771a19a81e9ddce20c54ed97e22c99f` |
| `adaptation.audit.json` | `dc054c81d0cc442733988dab7a02cf3346c0a71dfc6f0ee535f40f8f23ea304c` |
| `answer-keys.audit.json` | `49c2a525432880b199d6b1d9f2c278c0d141f3c7242b9a3232a2aff348deb9cc` |
| `display/check.json` | `9cc7a10e94019d3bd364b2e896815143bb1f66649fea9ba5a3dcf5d78a72b822` |
| `display/desktop-text.png` | `7f0c9bef80296eb351d28d9711347507c2563c9f5aa09429396d342253f4d4ff` |
| `display/mobile-text.png` | `95cd1bbc526e51a2d5161f471eeae299ac8b444e0336b79c4d8aa9ae220d10f0` |

Executed script:
`.intentfold/tickets/STEMROBIN-180/tmp/180-7-summary-display.mjs`
SHA-256 `4c963e6cc4963e11e84c5c4e0cfd08d773e20d61c78d7df470ae818212a4eac7`.

Observed existing render:
`.tmp/ld-s10y-lesson/render/8p/modern-us-neutral/phy8-c1-s1-t12/text.html`
SHA-256 `13bf238f377059143daee6d5a819c6377bc4a8f98c877967f60698f33bcebb64`.
This cache path identifies the observed HTML, not a durable lesson dependency.

Reused approvals are under raw
`ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c1-s1-t12/`:

| Evidence | SHA-256 |
| --- | --- |
| `source-review/first-source-review.md` | `9ecdb7c3a2acac012181ab91c819fd05a79dd411848f4e71f782c236cf6862eb` |
| `source-review/first-source-bindings.json` | `dca5857ec31c909143fc0f142f18991085ef087d63fa6d0e992c1f9e031867d8` |
| `modern-text-review/first-modern-text-review.md` | `06bde50a4ef17b76c0e29264790eff19f6c2318ffa10ee0cbe7b40f4cea5c09e` |
| `modern-text-review/first-modern-text-bindings.json` | `4be10805b733fe7795fdc56c01dcb801479f52f736c9603f4275ad6b854256ef` |

## Image Totals and Limits

New display images opened: **2**; desktop1, mobile1.
Earlier independent source image: **1**, retained in this reviewer context.
Cumulative batch/context total: **3**, within the caller's <=3 allowance.
Text-stage new images0; this stage source reopens0, crops0, reopens0,
other images0. No source52, source53, or source54 image was reopened.

No modern/source edit, finalize rerun, render rerun, DB access, paid/model
call, app/schema change, install, Git, chat operation, timer, or inter-chat
message occurred. Apart from the requested script's two screenshots and
`check.json`, the only new reviewer file is this observation report.

This original PASS completes the requested desktop/mobile display
continuation for the bound offline text. It does not approve publication,
app interactions, answer/choice/figure content, or the unread next chapter.
Genuine later content or display changes require affected-only review
while retaining this first observation and all earlier source failures.
