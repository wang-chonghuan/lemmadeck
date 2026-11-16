# Edition Source Rebuild First Failure

2026-11-16. Official s15-t1 adapt-finalize ran once with the separate approved
text binding and failed exit2 before finalization. Failure says every existing
owner-lesson figure cannot correspond to a unique assembled course:
p0005#1/#2/#3, p0057#10, p0070#2, p0071#2/#4, p0120#7 and p0153#10.
The already approved raw/modern text and figure bytes were not changed.

The first registered raw arithmetic erratum at170 activates `source_errata`'s
whole-book authoritative source reconstruction. Its `_authoritative_source_targets`
cuts/splits the actual page stream and calls `claim_figures` without first
assigning the stable TOC card IDs. The normal `assemble.run` assigns those IDs
with `check_toc` before claiming explicit owners. Missing IDs, not bad original
ownership or missing lessons, produce these errors.

Retain `p0170-math-1` and all explicit owners. Do not delete errata, collapse
identity checks, remove source pages or bypass reconstruction. Sagan owns the
minimal source-rebuild correction and focused valid/invalid binding tests.
No full source reassembly, prior figure approval or full-suite rerun is needed
to repair this tool defect. The failed official command is preserved here,
not reclassified as a figure repair or a completed lesson.
