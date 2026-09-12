# Plan

## Observed

- `getTextbookOutline` already returns the complete math and physics shelf from the TOC files and
  marks each card's availability from the database.
- `CatalogSidebar` defaults `showAll` to false, then filters unavailable books, chapters, lessons,
  and topics out of the application catalog. The “显示全部” control only reveals them temporarily.
- The unavailable-row rendering already exists and is inert, while available rows remain links.
- The public landing-page curriculum map already renders the complete outline and needs no change.

## Route

1. Remove the application catalog's visibility toggle and availability-based filtering.
2. Render every math and physics book, chapter, lesson, and topic from the existing outline while
   retaining the current link-versus-inert-row behavior.
3. Remove UI copy and styling that are used only by the retired visibility toggle.
4. Verify the complete catalog at desktop and mobile viewports, including an unavailable item and
   a working published lesson link.

## Redline Lookup

- No dependency, token registry, schema, generated file, content row, or deployment change is
  required.
- The route uses the existing catalog component and existing design tokens only.
