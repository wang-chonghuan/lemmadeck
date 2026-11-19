# STEMROBIN-181/181-3 bounded source231 counting repair

Native PASS: 19 printed rows / 19 Markdown rows, exit 0. Exactly one finalize retry, in writable scratch copies of d797 root/work.

Code: remove the short-width restriction from small-font prose continuation detection; apply that detector to the second joining pass. Covering-fraction-rule rejection is unchanged. No page/path special case, counting override, transcription deletion or rewrap.

Focused FIRST: seven independently expected cases PASS, covering source231, short and full-length small-font continuations (both merge passes), three prose rows, and tall/nested single-row fractions.

Exact footnote projection spans: 1755..1797, 1813..1852, 1863..1892. Exact returned component-inclusive bands: 1755..1798, 1812..1853, 1862..1892. These one-pixel component fringes were already recorded by d808 before repair; no synthetic boundary remains.

All copied input/output bytes except root/10p/pages/0231/audit.json are unchanged. Page JSON and Markdown are byte-identical: content, source references, footnote identity, figures and crop metadata unchanged. Audit changes ONLY lines_printed 18 -> 19 and errors -> []. Original d797 FIRST and d808 evidence remain unchanged.

Receipts: FOCUSED-FIRST/receipt.json; NATIVE-RETRY/receipt.json; original d797/FIRST/receipt.json (exit 1, 18/19). The first launcher failure is separately preserved in HARNESS-FIRST-FAILED.json: it stopped before checks on an unrelated concurrent renderer edit; the guard was narrowed and that edit was not touched.

Layout SHA256: 2a49cc6debed81c6cf74c53923e37c67dacb446d6f664845708416e14d119285

Patch SHA256: 839b33ef695de5a76b0aeb82c08b3d39b7df5608d18b8a11be044e42057ad072

report.json contains exact paths, output hashes and assertions; hashes.json binds every scratch file. Actual images 0; paid calls 0; Git/DB/publish/deploy/agent/worktree/message operations 0. No prepare, vectorize, review replay, canonical/index/meter writes, whole-project tests or build. Stop after this repair.
