# Initial Figure 04 Author Observations

Date: 2026-11-16. Original source was opened once before the independent source inventory and spec.

Initial official draft validator: pass, errors empty. First official JSXGraph renderer: pass, 12 objects, 5 labels, no collisions. Static preview metrics pass at 640-neutral, 240-neutral and 346-print; minimum label sizes 46, 17.25 and 24.86875 px, respectively. All three complete previews were actually opened at their native resolutions.

Concrete author-observed limitation: the bisector's initial JSXGraph `dash: 2` appears close to a dotted guide at native and compact widths, rather than the elongated dashed guide in the frozen source observation. This is a source line-convention concern despite mechanical pass, not a geometric or label-count failure.

The complete initial context/inventory/spec/script/SVG/render/native preview/static previews/evidence bytes were copied here before changing anything. The preserved render and preview evidence retain their initial paths and hashes without rewriting; their paths describe the original creation location, while the files now also have these byte-identical preservation copies.

Authorized sole targeted repair: change only `objects[id=bisector].dash` from 2 to 3. Do not change coordinates, endpoints, labels, visible dots, width declarations, source text or assertions. The second result is final for this bounded author task; any remaining issue goes to the parent, without further repair or a self-review PASS.
