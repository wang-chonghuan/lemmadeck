# Plan

## Existing promises

- `ld-s10y-lesson` owns extraction and edition publishing, `ld-s10y-image` owns modern figures,
  and `ld-s10y-answer` owns answer keys and interactions.
- Card ids remain owned by `ssot-resources/soviet10year-textbooks/toc/`.
- Production continues to read committed catalog/static resources plus `sr_lessons`; large authoring
  sources and generated corpora do not enter the application image.
- All 16 source PDFs fit ordinary Git: the largest file is 47,448,546 bytes, so no LFS or external
  storage configuration is required.
- `resources/` currently mixes design references, historical English sources, brand media, book
  sources and generated 10y artifacts; `app/public/` contains committed runtime static resources.

## Route

1. Establish `ssot-resources/` as the sole committed product-resource root. Move the existing
   `resources/content`, `resources/reference`, book sources, retained source documents and brand
   media into named domains below it. Configure Vite to serve runtime public files directly from
   `ssot-resources/public/`, then remove `app/public/` and the top-level `resources/`.
2. Establish `ssot-resources/soviet10year-textbooks/` as the complete 10y domain:
   keep `toc/` as the application catalog, add `sources/` for original books and their manifest,
   add `artifacts/` for durable extraction and edition outputs, and use `README.md` as the lifecycle
   and publishing map. Move all original PDFs into
   `ssot-resources/soviet10year-textbooks/sources/soviet10years/`, record checksums, sizes and page
   counts in a machine-checkable manifest, and add a validator.
3. Move `resources/s10y-lessons/<book>` to
   `ssot-resources/soviet10year-textbooks/artifacts/<book>`. Remove committed render caches, HTML
   previews, scaffolding templates and duplicate page-level figure files while retaining
   transcriptions, validated structured data, audits, final lesson data, answer data, interaction
   data, FigureSpecs and final figures.
4. Change every active code, skill, documentation and Charter reference to the new roots with no
   legacy fallback. Generated caches go under `.tmp/` and may be deleted at any time. Keep large
   authoring sources and artifacts out of the application image while runtime catalogs and public
   files remain available.
5. Add a repository resource audit that fails when product resources live outside `ssot-resources/`,
   persistent files depend on `.tmp/`, or forbidden generated 10y caches are tracked.
6. Verify the manifest and repository classification, regenerate one representative `6a` lesson
   from the committed PDF/transcription chain, validate its modern edition, answers and interactions,
   and exercise the publishers against the existing row without changing schema.
