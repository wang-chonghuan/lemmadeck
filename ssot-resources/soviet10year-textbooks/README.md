# Soviet 10 Years resource map

This directory is the authoritative entry for the Soviet ten-year-school textbook pipeline. It
contains every committed source and durable generated artifact needed to rebuild, validate and
publish the lessons. Disposable work stays under the repository root `.tmp/`.

## Persistent layout

| Path | Role |
|---|---|
| `sources/manifest.json` | Inventory of all source PDFs, hashes, sizes, page counts, catalogs, skills and publishers |
| `sources/soviet10years/*.pdf` | The 16 original scans, committed with normal Git |
| `sources/toc/*.md` | Human-readable transcriptions of the printed contents pages |
| `toc/<book>/{zh,en,ru}.json` | Application catalog, card ids, page ranges and locale structure |
| `artifacts/<book>/pages/<page>/page.md` | Faithful typed page blocks |
| `artifacts/<book>/pages/<page>/page.json` | Structured page blocks consumed by assembly |
| `artifacts/<book>/pages/<page>/audit.json` | Durable page reconciliation and crop geometry |
| `artifacts/<book>/figures/*` | Final book-level source figure library |
| `artifacts/<book>/lessons/<card-id>/*` | Assembled faithful lesson and exercise objects |
| `artifacts/<book>/book.json` | Book-level lesson index and extraction audit |
| `artifacts/<book>/answers.json` | Faithful capture of printed answer pages |
| `artifacts/<book>/answers.audit.json` | Printed-answer capture audit |
| `artifacts/<book>/editions/<edition>/figures/*` | Final modern figures, FigureSpecs and render/generation metadata |
| `artifacts/<book>/editions/<edition>/lessons/<card-id>/*` | Final lesson, exercises, figures, answer keys, interactions and audits |
| `artifacts/<book>/editions/<edition>/book.json` | Edition-level lesson index |

`sources/manifest.json` is the machine-readable map. Run:

```bash
python3 ssot-resources/soviet10year-textbooks/validate.py
```

It verifies the PDFs and hashes, the PDF-to-catalog mapping, every catalog structure, and the
declared skill and publisher entry points.

## Disposable layout

These paths are rebuildable and must never be authoritative:

| Path | Contents |
|---|---|
| `.tmp/ld-s10y-lesson/<book>/pages/<page>/` | Rendered page, coordinate grid, layout, transcription template and page-level figure crops |
| `.tmp/ld-s10y-lesson/adapt/<book>/<edition>/` | Draft modern-edition book and lesson templates awaiting review and promotion |
| `.tmp/ld-s10y-lesson/render/<book>/<edition>/` | Offline lesson and exercise HTML previews |
| `.tmp/ld-s10y-answer/<book>/` | Rendered answer pages and capture templates |
| `.tmp/s10y-image/<figure>/` | Figure context packages, draft specs and preview renders |
| `.tmp/backup/` | Temporary operational backups |

Deleting `.tmp/` must not remove a PDF, TOC, page transcription, final figure, lesson, answer,
interaction, or anything needed to republish the existing corpus.

## Generation ownership

| Stage | Owner |
|---|---|
| Scan page to typed page facts, assembly and edition text | `.claude/skills/ld-s10y-lesson/` |
| Modern deterministic, generated and hybrid figures | `.agents/skills/ld-s10y-image/` |
| Printed answers, edition answer keys and interactions | `.claude/skills/ld-s10y-answer/` |
| Runtime catalog consumption | `app/src/lib/textbooks.ts` |
| Lesson, answer and interaction database writes | Publishers declared in `sources/manifest.json` |

The ordered path is:

```text
source PDF + catalog
  -> .tmp page render/template
  -> durable page.md/page.json/audit.json
  -> durable raw lessons + book figure library
  -> durable modern edition + final figures
  -> durable answer keys + interactions
  -> sr_lessons in the database
```

## Representative rebuild

Run from the repository root:

```bash
P=.claude/skills/ld-s10y-lesson/.venv/bin/python
S=.claude/skills/ld-s10y-lesson/tools/p2c.py
BOOK=6a
LESSON=alg6-c1-s1-n1

# Rebuild disposable source-page images when visual work is required.
$P $S prepare --book "$BOOK" --page 10
# Read .tmp/ld-s10y-lesson/6a/pages/0010/page.grid.png and write the durable
# ssot-resources/.../artifacts/6a/pages/0010/page.md before finalizing.
$P $S finalize --book "$BOOK" --page 10

$P $S assemble --book "$BOOK" \
  --toc ssot-resources/soviet10year-textbooks/toc/6a/zh.json
$P $S vectorize --book "$BOOK"
$P $S assemble --book "$BOOK" \
  --toc ssot-resources/soviet10year-textbooks/toc/6a/zh.json
# Existing modern lessons can be revalidated directly. For a new or revised lesson, first run
# adapt-prepare, edit the templates under .tmp/ld-s10y-lesson/adapt/, and promote the accepted
# content as lesson.json, exercises.json and figures.json under the durable edition lesson path.
$P $S adapt-finalize --book "$BOOK" --edition modern-us-neutral --lesson "$LESSON"

python3 .claude/skills/ld-s10y-answer/tools/lesson_answers.py finalize \
  --book "$BOOK" --edition modern-us-neutral --lesson "$LESSON"
python3 .claude/skills/ld-s10y-answer/tools/lesson_interactions.py finalize \
  --book "$BOOK" --edition modern-us-neutral --lesson "$LESSON"
```

`assemble` reads durable page JSON and only promotes page-level figures found in `.tmp/`; it never
clears the committed book-level figure library. Running it after deleting `.tmp/` therefore
rebuilds lessons without erasing final source figures.

## Database publication

The three publishers are deliberately separate and run in this order:

```bash
BOOK_ROOT=ssot-resources/soviet10year-textbooks/artifacts/6a
LESSON=alg6-c1-s1-n1

node .claude/skills/ld-s10y-lesson/tools/publish.mjs "$BOOK_ROOT" \
  --edition modern-us-neutral --lesson "$LESSON"
node .claude/skills/ld-s10y-answer/tools/publish.mjs "$BOOK_ROOT" \
  --edition modern-us-neutral --lesson "$LESSON"
node .claude/skills/ld-s10y-answer/tools/publish-interactions.mjs "$BOOK_ROOT" \
  --edition modern-us-neutral --lesson "$LESSON"
```

All writes use the repository root `.env` and `LEMMADECK_DATABASE_URL`. They upsert or merge the
existing `sr_lessons` row; they do not change the database schema. The base publisher owns prose,
exercise prompts and figures, the answer publisher adds `answerKey`, and the interaction publisher
adds input-widget metadata without exposing expected answers to the browser.

## Catalog rules

Exactly one locale per volume carries `"authority": "extracted"`. It records what the printed
contents page says. Other locales carry `"authority": "translated"` and must preserve structure,
ids, numbers and source references exactly; only titles differ.

The Soviet set was transcribed from printed Chinese editions, so `zh` is authoritative. The
probability pair (`7-9pr`, `10-11pr`) has no Chinese edition, so `ru` is authoritative and both
`zh.json` and `en.json` are translations.

`grade` is the shelf position in the Soviet ten-year sequence. Modern Russian 11-year editions are
shelved one grade earlier here, and each affected locale records that fact in `gradeAlignment`.

`number` is the stable hierarchical number shown in the interface. `source` points back to the
printed contents through `printedSection` or `printedName`; `page` is the printed page used to find
the scan. Answers and author forewords are not catalog cards. Appendices, symbol lists, term
indexes, formula tables, glossaries and assessment sets remain catalog content.
