# Grill

## Sources reviewed

- Live Plane ticket `STEMROBIN-135`
- `.intentfold/charter/product.md`
- `.intentfold/charter/engineering.md`
- `.intentfold/charter/operations.md`
- `.intentfold/charter/ui.md`
- The three active 10y skills and their scripts
- Existing `resources/s10y-lessons/`, `.tmp/ori-books/`, and
  `ssot-resources/soviet10year-textbooks/`
- Repository-wide resource-like directories

## Shared understanding

The repository will have exactly one committed product-resource root: `ssot-resources/`. The 10y
corpus lives under `ssot-resources/soviet10year-textbooks/`: the existing catalog remains under
`toc/`; original PDFs move under `sources/`; durable extraction and edition outputs move under
`artifacts/`. Runtime public assets move from `app/public/` to `ssot-resources/public/`. Temporary
generation files belong under `.tmp/` and must be safe to delete after every ticket.

## Decisions

- The human selected the existing `ssot-resources` tree instead of introducing a second
  `resources/s10y` root.
- The human explicitly authorized the Charter update and required the repository-wide resource
  consolidation to complete in this ticket.
- All 16 current PDFs enter ordinary Git. Together they are about 207 MB and the largest individual
  file is 47,448,546 bytes, so Git LFS or external storage configuration is unnecessary.
- Catalog ids and source PDFs are related through a manifest rather than filename convention. This
  covers one source PDF feeding multiple catalogs, such as `6-7p` feeding `6p` and `7p`.
- Git retains original PDFs, source metadata, human transcriptions, validated structured page data,
  audits, final lessons and exercises, answers, interactions, FigureSpecs, and final figures.
- Git does not retain page renders, grid overlays, offline HTML previews, scaffolding templates,
  layout caches, or page-level figure copies already represented in the book-level figure library.
- Existing publishers keep their table and JSONB contracts. Acceptance may idempotently republish
  one existing `6a` lesson through `LEMMADECK_DATABASE_URL`; no schema operation is permitted.
- Design references, retained historical English sources, branding media and runtime-public assets
  move into domain directories below `ssot-resources/`.
- Skill schemas, test fixtures and dependency-owned files remain with their code modules. They are
  code inputs, not product-resource roots.

## Rejected options

- A new `resources/s10y/` root: rejected because it preserves two competing resource roots.
- Git LFS or external object storage: rejected because every current PDF fits ordinary Git and the
  human does not want setup burden.
- Keeping `.tmp/ori-books/` as an authoritative source: rejected because `.tmp/` must be disposable.
- Compatibility fallbacks to old resource paths: rejected because they would keep the ambiguity.

## Remaining questions

None for the 10y migration.

## Implementation constraints

- Do not change the database schema, deployed infrastructure, or application content contract.
- Do not lose a committed final lesson, answer, interaction, audit, FigureSpec, or final figure.
- Keep `toc/` available to the application build while excluding `sources/` and `artifacts/` from
  the deployed image.
- The Charter must name `ssot-resources/` and `.tmp/` as the resource lifecycle boundary.
- A repository audit must reject product resources outside `ssot-resources/` and classify code-owned
  assets separately from product corpus material.
