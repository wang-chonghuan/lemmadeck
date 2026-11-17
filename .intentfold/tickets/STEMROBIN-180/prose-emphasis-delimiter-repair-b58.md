# Batch 58 Prose Emphasis Delimiter Repair

Date: 2026-11-17. Ticket: STEMROBIN-180. Same-invocation TRUE TOOL BUG,
CODEONLY sidecar. **Final verdict: CODE-ONLY PASS. STOP.**

## FIRST Display And Scope

First read and displayed `display-review-batch58.md`; its verified SHA-256 is
`a7aa6f1abe6d750b7491a5205019930914e40b49a9fa8d0642a1aaa40ae5cdb9`.
That report remains a DISPLAY FAIL: n39 formula-adjacent gray artifacts and n68
literal emphasis stars. No new display verdict is claimed here.

The supplied n68 source identity is `p0264#12`. This sidecar did not reopen source
pages or review physics. Design used the user's exact formatting specification,
the lesson skill's prose layout contract, `references/edition-text-contract.md`,
and production `normalize_prose_layout`. Existing test contents were read only
after the initial implementation was ready for verification.

The parent clarified that n68 `lesson.template.json.prose[3].text` already contains
correct single-paragraph emphasis. No template/content edit is needed from this
sidecar. The parent's sole affected `adapt-finalize`, rendering, checks and staging
remain outside this code-only result. The parent's required 12 final paragraphs
were not independently checked or visually accepted here.

## Opaque Dirty Freeze

Before any code edit, copied the entire existing dirty `edition.py` byte-for-byte
without inspecting or reverting its earlier changes:

- Frozen bytes: 78,520.
- Frozen SHA-256: `1e6f02be38091f4ed944bba30fad525b22aa39ddc965e41616621eb2e4c673a1`.
- Scratch copy: `tmp/b58-emphasis-delimiter-repair/edition.before.py`.
- Final implementation: 79,256 bytes; SHA-256
  `12cad76a3566c7f64dbb151f7fd384a1a39e53c177102aa88e93d393474eb703`.
- New test: `.claude/skills/ld-s10y-lesson/tools/test_inline_emphasis_sentence_end.py`,
  125 lines; SHA-256
  `6895940cdf61449f9b5b8b799292e2f3cb90e3fe059e8923f3b1d7a8f53a0983`.

The final byte comparison against that freeze has exactly one insertion hunk,
**19 added lines, 0 removed lines**. No claim is made about other workers' files.

## Exact Production Diff

Only `normalize_prose_layout` changes. It scans unmasked star runs, tracks pending
emphasis widths, and advances a sentence boundary through only its closing
prefix. Any remaining opening stars stay with the following sentence. Full runs
are needed because adjacent or nested single/double/triple spans can produce
4-6 consecutive stars. Existing math/tag masks and paragraph grouping stay in use.

```diff
@@ -582,6 +582,25 @@
         if trailing and text[match.end() + trailing.end():].strip():
             boundaries.add(match.end() + trailing.end())
 
+    # Keep closing emphasis with its sentence, including nested closing runs.
+    emphasis = []
+    closing_ends = {}
+    for match in re.finditer(r"(?<![\\*])\*+", masked):
+        remaining = len(match.group())
+        if (
+            match.start() and not text[match.start() - 1].isspace()
+            and (
+                remaining <= sum(emphasis)
+                or text[match.start() - 1] in "。！？；;"
+            )
+        ):
+            while emphasis and remaining >= emphasis[-1]:
+                remaining -= emphasis.pop()
+        closing_ends[match.start()] = match.end() - remaining
+        if remaining:
+            emphasis.append(remaining)
+    boundaries = {closing_ends.get(end, end) for end in boundaries}
+
     lines = []
     start = 0
     for end in sorted(boundaries):
```

The independent original-wording fixture asserts this exact result, with actual
newlines, not literal backslash-n sequences:

```text
势能是由另外的物体对该物体的作用力来确定的。
但是，相互作用的物体是平等的。
因此，*只有相互作用的物体才具有势能。*

**势能是物体的相互作用能。**
```

## Preserved Failures And Final Verification

All behavioral commands used the existing Python
`/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B`.
Recorded through the existing lowercase positional
`node .intentfold/tickets/STEMROBIN-180/tmp/record-step.mjs <label> <command> <args...>`.
Each recorder retains command, exit status, stdout/stderr bytes and SHA-256;
no evidence was overwritten.

| Recorder label | Outcome |
| --- | --- |
| `b58-emphasis-freeze` | PASS; exclusive byte copy and hash before code edit |
| `b58-emphasis-first-repro` | FIRST FAIL, exit 1; exact supplied malformed output reproduced |
| `b58-emphasis-focused-first` | Initial 9-method suite PASS, 27 fixture cases |
| `b58-emphasis-exact-diff` | Intermediate insertion-only implementation diff retained |
| `b58-emphasis-expanded-first` | FAIL, exit 1; 8 subtest failures on long adjacent/nested runs |
| `b58-emphasis-focused-final` | PASS, exit 0; 9 methods, 34 fixture cases |
| `b58-emphasis-existing-focused` | PASS, exit 0; 8 existing methods, 10 fixture cases |
| `b58-emphasis-final-binding` | PASS; frozen hash retained, exact final +19/-0 single hunk |

Final total: **17 passing test methods, 44 fixture cases; 0 final failures**.
The expanded failures exposed the initial 1-3-star scan limit; the same production
hunk now scans complete runs. Expectations were not weakened to match output.

New coverage: exact original wording; single/double/triple inline spans; nested
spans including intraword starts and long closing runs; all nine adjacent width
pairs; following opening markers; whole wrappers and nested whole wrappers;
existing paragraph separators and sentence punctuation; formula sentence ends;
protected HTML/math and escaped stars. Every new fixture checks exact output,
idempotence, math contents, expected paragraph count and no empty/star-only
paragraph. Inline cases additionally preserve all non-whitespace source bytes.
Whole wrappers retain the existing per-paragraph rewrapping contract.

Existing verification selected only the first six pure-layout methods of
`ProseEmphasisLayoutTests`, plus
`EditionTest.test_prose_is_line_broken_at_sentences_and_introduced_formulas` and
`EditionTest.test_prose_layout_creates_real_paragraph_groups`. The source-bound
test that reads another lesson and invokes HTML rendering was not executed.

## Limits And Stop

Not a general Markdown parser, arbitrary Markdown conformance claim, renderer
fix, lesson regeneration, semantic approval, acceptance, handoff or ticket
completion. No source, mathematics, choice or answer review was replayed.

Writes: the owned production file, the one new focused test, this durable report,
new `tmp/b58-emphasis-delimiter-repair/` scratch, and the explicitly requested
recorder's `tmp/commands/b58-emphasis-*` evidence. No image loads, app/dependency/
charter/backend/DB/network/Git operations, formal adapt-finalize, rendering or
acceptance checks. Parent-owned CSS, modern JSON, templates and generated output
were not written or asserted unchanged. **CODE-ONLY PASS. STOP.**
