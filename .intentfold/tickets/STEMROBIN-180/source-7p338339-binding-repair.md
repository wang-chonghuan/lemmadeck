# 338/339 Manifest Reader Repair

Main's first author-binding call failed on the first report leaf: the manifest
uses `SHA`, while the reader expected `sha256`. Manifest bytes, FIRST files and
the actual digest are preserved. No source text, figure, inventory or reviewer
record is changed.

The existing ticket-local reader now accepts an explicit `SHA` selector and reads
the native manifest directly. No filtered or rewritten manifest is substituted.
The failed call remains under batch42-7p338339-author-main-bind; the corrected
call is separately recorded. This is one actual mechanical integration repair,
conservatively charged to both pages: used 1 / unused 0 / sourceactual 0.
The original author's zero content repairs remain historical, not reset.

Neither a successful binding nor finalize grants SOURCE approval. Source
uncertainties remain, and no further page-content repair is available.
