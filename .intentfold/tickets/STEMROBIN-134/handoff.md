# STEMROBIN-134 Handoff

## What changed

- Generated and published Algebra Grade 6 Chapter 5: numbered lessons 41-55
  plus the Chapter 5 supplementary exercises.
- Added 16 modern-edition cards, 306 exercises, 8 deterministic figures,
  306 answer keys, and 306 interaction specifications.
- Fixed modern-edition validation so cultural replacements inside LaTeX
  `\text{...}` preserve formula structure while allowing translated copy.
- Fixed repeated `--lesson` rendering so a requested batch renders every card.
- Fixed page finalization so rerunning it against an unchanged scan and
  finalized figure box preserves the crop and its downstream FigureSpec hash.
- Updated the lesson skill with the new idempotent-finalization rule and added
  focused regression coverage.

## AC results

1. **PASS - complete Chapter 5 catalog coverage.** Headed Chromium reached
   lessons 41-55 and the supplementary-exercise card from the local catalog.
2. **PASS - generated and published artifacts agree.** All 74 page
   finalizers, 16 adaptation finalizers, 16 answer finalizers, and 16
   interaction finalizers passed. The live `LEMMADECK_DATABASE_URL` content
   contains 16 Chapter 5 rows, 306 exercises, 306 answer keys, and 306
   interaction specifications. All 8 referenced figures rendered.
3. **PASS - browser quality.** Headed Chromium checked all 16 cards at
   1440x960 and 390x844: 32 card/viewport checks and 612 rendered exercise
   instances. It found no horizontal overflow, missing or blank figures,
   unavailable answer controls, missing numeric or MathLive keyboards, failed
   requests, page errors, or console errors.
4. **PASS - measured generation; deployment verification belongs to cap4.**
   From `2026-09-13T00:57:57Z` through `2026-09-13T01:59:33Z`, wall-clock time
   was `01:01:36`.
   - Azure GPT-5.6 Sol through alias `gpt-5.4`: 153 calls; 605,578 prompt
     tokens; 0 cached-input tokens; 691,496 completion tokens, including
     463,388 reasoning tokens; 1,297,074 total tokens.
   - At $4 per million input tokens and $20 per million output tokens, the
     measured cost is `$16.252232`. Reasoning tokens are included in completion
     tokens and were not charged twice. No image-model cost was incurred.
   - The production homepage and first Chapter 5 card checks will run after
     cap4 merges and performs the routine redeploy.

## Verification

- `.claude/skills/ld-s10y-lesson/.venv/bin/python -m unittest discover -s .claude/skills/ld-s10y-lesson/tests -v`
  - 37 tests passed.
- `python3 -m unittest discover -s .claude/skills/ld-s10y-answer/tests -v`
  - 2 tests passed.
- `cd app && npm run test && npm run build`
  - 77 tests passed; production build passed.
- `cd app && node ../.intentfold/tickets/STEMROBIN-134/tmp/ac-check.mjs`
  - 32 card/viewport checks passed.
- Live database reconciliation
  - 16 lesson rows; 306 exercises; 306 answer keys; 306 interactions.

## Deviations

- The ticket began as a chore. Generator defects required code changes, so work
  paused until the human explicitly reclassified the ticket as a fix.
- Acceptance exposed a second-pass crop drift in page finalization. The
  generator now reuses previously audited geometry when both the scan hash and
  finalized box are unchanged.
- Re-running the current edition finalizer corrected one deterministic line
  break in lesson 44; that generated lesson and offline HTML were republished.

## Environment

- Acceptance server: `http://localhost:52134`
- Checkout:
  `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-134`
- Branch: `STEMROBIN-134-generate-chapter-five`
- Environment keys added, changed, or removed: none.
- Existing `LEMMADECK_DATABASE_URL` was used for publication.

## Residual

- Some exercises retain the current math-input fallback with
  `needsAuthoring` metadata for future dedicated choice or mixed-part widgets.
  They are usable and do not block this ticket.
