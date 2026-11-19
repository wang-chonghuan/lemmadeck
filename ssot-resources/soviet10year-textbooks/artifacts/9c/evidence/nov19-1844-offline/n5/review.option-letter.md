# n5 Option-Letter Follow-Up

2026-11-19. **PASS**, affected-only and bound to:

`/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck/.tmp/stemrobin-184-resume/offline/render/9c/modern-us-neutral/ana9-c2-s1-n5/choices.html`

SHA-256: `78370f88a3516685ae184a4610d942b370924e82ff29026ea83fb417020d99e0`.

## Observed

At **1440x960** and **390x844**, all **24 option letters** and their actual visible text leaves are **18.304px**, family **`KaTeX_Main, serif`**, exactly **1.10x** the **16.64px** adjacent body prose. Fonts loaded; no double scaling was observed.

All 24 adjacent letter/text/radio regions at each viewport have no overlap, clipping, hidden content, letter ink escaping its allocated track, region escaping its row, or successive-row overlap. Current rows are 51.375px tall, including padding; minimum horizontal column gap is 6.6406px. Option-text width is 569px desktop and 251.7813px mobile. Adjacent row boxes meet without overlapping.

DOM display text and all **41 ordered KaTeX annotations** are identical to the inert before-option snapshot at both widths:

- Display text SHA-256: `74750b1e20b80d1f45bd715363b0fcb04129134a67e963dfba8f7eed4686e511`
- Ordered annotations SHA-256: `8a46e9bb330ad676d53cf2a14e42f7612838f8d36c721978f7cb40182aaeb91b`
- Before HTML SHA-256: `04796a266f5ae9a5672464185419ea9b6a4ab56167a4a5af22b0df56d601652a`

The current text/exercises projections and opaque canonical input hashes match the previous typography bindings. Current/before HTML, generators and inherited inputs stayed stable throughout the check.

## Scope And Preservation

One inline Node check using existing app Playwright, two isolated **`headless:true`** offline contexts, and only two current choices-page opens. External requests were blocked; old HTML was parsed inertly, never navigated. The owned browser closed in `finally`.

**Zero new images, screenshots or image opens. Cumulative images remain 8/8.**

Every prior passing source, mathematics, table, global prose, control/radio, number-label and error/glyph/scroll-end check is inherited, not replayed. Radio bounds were measured only; no controls were selected. Text/exercises were hashed only, not rendered.

The original issue evidence, typography ISSUE, check scripts, reports and ledgers remain byte-identical. Existing images were neither opened nor changed. Only these two new option-letter reports were written.

This is **offline display evidence, not product acceptance**. No HTML/canonical repair, old layout rendering, screenshot inspection, model, network, DB, Git, publication, install, desktop/profile/CDP/PWDEBUG or worker. Current labels contain no nested `.prose-math`; the `1em` guard CSS was observed, and actual leaves have no double scaling, but no synthetic nested case was tested.

Detailed measurements, hashes and preserved-evidence bindings:
`/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck/.tmp/stemrobin-184-resume/n5-offline-review/review.option-letter.json`
