# Grill

## 1. Does “restore all catalogs” mean keeping the visibility toggle but changing its default?

No. The request identifies the prior hiding behavior as the defect. The code shows that the toggle
exists only to opt into the complete shelf, while the product contract describes the catalog as the
math and physics curriculum navigator. The complete shelf will therefore be the single catalog view,
and the toggle will be removed.

## 2. Should unavailable lessons become navigable?

No. The live ticket explicitly requires unavailable entries to remain non-clickable. The existing
row implementation already distinguishes inert unavailable entries from published links, so that
behavior will be preserved.

## 3. Does the public landing-page curriculum map need modification?

No. Inspection shows that it already renders all books and numbered sections without filtering them
by availability. Only the persistent application catalog currently hides unavailable entries.

## 4. Does the route cross a Charter redline?

No. It changes one existing UI flow and removes its now-unused copy and styles. It adds no
dependency, color, token, schema operation, generated-file edit, or content write.
