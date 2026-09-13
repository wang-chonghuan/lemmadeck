# Handoff

## What changed

- Established `ssot-resources/` as the repository's only committed product-resource root and
  documented its lifecycle in `ssot-resources/README.md`.
- Consolidated the Soviet 10 Years corpus under
  `ssot-resources/soviet10year-textbooks/`: 16 source PDFs and their manifest, 17 catalog volumes,
  durable page transcriptions, lessons, exercises, figures, answers and interactions.
- Removed the legacy top-level `resources/`, `app/public/`, duplicate galaxy data, page renders,
  layout caches, offline HTML previews, scaffolding templates and page-level duplicate figures.
- Updated the lesson, image, answer, galaxy and retained content skills plus application/build paths
  to use the new resource locations. Vite and Nitro now serve and copy
  `ssot-resources/public/`.
- Added `ssot-resources/audit.py` and expanded the 10y corpus validator so committed resources cannot
  depend on `.tmp/` or return to retired paths.
- Updated the explicitly authorized Charter resource boundary and current architecture
  documentation.

## AC results

- **One authoritative route:** `python3
  ssot-resources/soviet10year-textbooks/validate.py` passed with 16 PDFs, 17 catalog volumes, 510
  lessons and 158 figure render records.
- **Repository resource boundary:** `python3 ssot-resources/audit.py` passed. The Git index contains
  no files under top-level `resources/` or `app/public/`; `.tmp/` remains disposable and ignored.
- **Representative regeneration:** `alg6-c1-s1-n1` was rebuilt through page finalize, assembly,
  vectorization, modern-edition finalize, answer finalize and interaction finalize. Lesson,
  exercise, figure, answer and interaction validation passed.
- **Publish compatibility and preservation:** all three publishers completed through
  `LEMMADECK_DATABASE_URL`. The row retained 5 prose blocks, 12 exercises, 12 answer keys and 12
  interactions. Content MD5 remained `a2d2e1e0e07f1c9a86b94ec9c0ee8616`; exercise MD5 remained
  `dfc08ac5642dbcc45ee14f3bd03dbf50`. The durable inventory remained 2015 files before and after,
  with no missing final artifact. No schema, infrastructure or root Dockerfile changed.
- **Application compatibility:** 77 Vitest tests passed and the production build completed. All 14
  public files were present byte-for-byte in `.output/public/`.
- **Browser acceptance:** headed Chromium passed at `1440x960` and `390x844`: the catalog galaxy
  rendered, the representative lesson loaded, all 12 exercises and the required SVG appeared,
  mobile horizontal overflow was at most 1px, public assets returned HTTP 200, and the standalone
  galaxy prototype rendered its canvas.

## Deviations

None from `plan.md`. The ticket-scoped browser check was updated to the current visible label
`习题` and current exercise container ids; the galaxy prototype's existing locked dependency was
installed locally before verification.

## Environment

- Application: `http://localhost:52135`
- Galaxy prototype: `http://localhost:8765/prototypes/knowledge-galaxy/web/`
- Environment keys added, changed or removed: none

## Residual

None for this ticket.
