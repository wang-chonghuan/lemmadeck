# n47 Final Affected Recovery

**Assertion verdict: FAIL. Visual verdict: FAIL.** Final two-surface image coverage is incomplete.

## Finding

Both actual composite screenshots paint repaired text at the top but leave the expected choices iframe region blank white. Therefore choices parentheses/spacing/control visual recovery is HOLD_UNOBSERVED, not PASS. The pixels do not prove the standalone repaired choices file is blank; this is a harness/capture coverage failure.

The111 headless DOM assertions actually passed:12 text and49 choice containers per viewport contain full descendant Range bounds with0 top/bottom excess; local vertical gutters/eligibility0; exact innerWidth/clientWidth1440 or390; no document sideways overflow; body and rendering signatures equal separately measured files. Those measurements cannot substitute for missing painted choices coverage.

## Two Actual Observations

### desktop: FAIL

The repaired text is visible at the top: Chinese title, aligned paragraph starts, theorem/proof/lemma/example and final written-page link. The gray vertical mini-scrollbars previously seen beside formulas are absent. Formula/prose lines are separated without an apparent collision. The long chain is left-reset; its small concealed right endpoint is supported by DOM endpoint testing, not by a new image of that endpoint. No written navigation was exercised.

The entire expected second-frame region is blank white: no choices title, stems, parentheses, radio controls or final tuple are painted in the capture. The large blank region extends through the remainder of the full-page image. The actual DOM height/width/signature assertions passed, but this screenshot does not provide choices visual coverage.

Capture SHA256: 24634a49b557aaad2b963fce61b60752adffb5ee167db543bc42c444d92f392d

### mobile: FAIL

The repaired text occupies the top 390px-wide section with readable Chinese title and prose, unindented paragraph starts, distinct proof/example lines and visible final link. No vertical mini-scrollbars are visible. The three long expressions show their left portions only inside local windows; their right endpoints were actually reached and reset left in DOM. No apparent page-wide horizontal spill or overlapping prose is visible.

Below the first-frame section, the expected choices frame is completely blank white. No question/option/control or final content can be observed in that section of this full-page image. Therefore the two-surface mobile visual requirement is not satisfied despite the measured DOM having all expected body bytes and full dimensions.

Capture SHA256: 70adb3aa8b278c5914fad65e9492205c07755b67a7d361beb4da1825049eb08c

## Actual Accounting

- New screenshots2; new actual image-tool views2, one per file. First6 + new2 = cumulative8/8. No remaining views, extra screenshots/crops/reopens/manual decodes or further browser retry.
- New native clicks0. Original64 trusted clicks/content PASS are inherited by bound unchanged body bytes, not replayed. Written was not opened or navigated.
- Parent images/decodes0; hidden browser/image internals UNKNOWN.
- Long formulas were reset left. Desktop text endpoint window685/697px, maxScroll12px; mobile windows358/545,358/697,358/480px, maxScroll187,339,122px. Both endpoints were reached and hit-tested. A single left-reset image conceals each right endpoint.

## Retained Entry History

- Original affected recovery first invoked the headed checker before the correction. It waited on below-fold iframe font readiness, was closed with TERM to its exact owned process, and retained exit1/54 assertions/0 screenshots/0 views. Browser closure is recorded.
- First headless working copy failed before any browser launch: EEXIST recreating the already-owned empty captures directory. Exit1 and invoked checker are retained; no redirect or overwrite.
- Distinct corrected entry used exactly chromium.launch({headless:true,timeout:30000}), no headed attempt/fallback/CDP/user profile. It reused the verified empty owned directory, warmed iframe font readiness, retained bounded10s waits, exited0 and closed both contexts/browser.
- Three process entries, two actual recovery browser transactions: headed1 and headless1. Both earlier failures, scripts and complete stdout/stderr/receipts are preserved.

Original n47-offline FAIL and diagnosis packages were not changed; their frozen manifest hashes remain unchanged. This checker did not modify source, repaired previews, artifacts, renderer, charter or stable skills.

## Custody

report.json gives assertions, observations, entry history, inherited evidence, signatures and exact accounting. browser-evidence-headless.json intentionally retains its pre-observation DOM PASS/PENDING visual state; final report adds the two actual failed painted-coverage assertions. entry-checkpoint.json preserves the reported channel correction history.

All owned files are frozen0444 and directories0555, with hashes verified after freeze. hash-manifest.json binds the package excluding its unavoidable self-reference; final manifest SHA is emitted in the terminal receipt. Parent must consume the text/structured evidence and actually close this reviewer. No source/server/keyboard/DB/publication/strict-source acceptance is claimed.
