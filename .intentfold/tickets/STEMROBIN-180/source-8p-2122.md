# Batch 27 SOURCE Author: 8p Physical 21/22

Status: AUTHOR CANDIDATES PENDING INDEPENDENT SOURCE REVIEW. No SOURCE approval,
assembly, promotion, publishing or ticket handoff/closure is granted or performed.
Work remains inside the existing active cap3 phase. Inflight: 0.

## Results

| Physical | Printed | First finalize exit | Blocks | Printed/MD rows | Figures | Tasks/groups/new headings | Normalizations | Actual repairs | Gate failure attempts |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 21 | 9 | 0 | 10 | 18/18 | 2: fig-06, fig-07 | 0/0/0 | 0 | 0/1 | 0 |
| 22 | 10 | 0 | 10 | 26/26 | 1: fig-08 | 0/0/0 | 0 | 0/1 | 0 |

Prepare was already performed by main once per page, with exit 0 as stated by the
human; no prepare receipt was supplied to this author. Author prepare calls: 0.
Author finalize calls: exactly 1 per page, 2 total. No gate rerun, repair,
startup repair, mechanical repair, or failure-after-repair occurred.

The candidate consistency gate and final packet/hash/permission gate each ran
once, both exit 0. They are scoped offline checks, not project fullchecks.
FIRST text rows, block types, continuation flags and captions are unchanged by
finalize; only tool-owned provenance, figure IDs/boxes and image references were
generated. Machine JSON and audit were never manually synchronized.

## Boundaries

Only the incoming 20 structural metadata supplied by the human was used.
Page 21 first block continues p0020#9 and closes. Page 21 last body is p0021#9,
kind p, cont false, open true, 1 row. Page 22 first block continues that object
and closes. Page 22 last body is p0022#9, kind p, cont false, open true, 2 rows.
Footers p0021#10 and p0022#10 are closed, contain italic digits 9 and 10, and
each retain two flanking dots outside the italic span.

Inherited context: h1 phy8-c1, h2 phy8-c1-s1, h3 phy8-c1-s1-n3. No headings,
exercise groups or tasks are printed on either owned page. The live catalog
entry's exerciseNumbering is UNSET. Actual first exercise/group on own pixels:
none. Numbering scope remains unestablished; no 7p convention was imported.
No catalog edit or assemble was performed.

Source 19/20 remains pending review, not a grant. Source 17/18 is BLOCKED.
No body, image, report or assembly across those gaps was read.

Outgoing 22 metadata is structural only, with no body tail, image or candidate
paths:
[outgoing22-structural.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-2122/frozen-review-packet/outgoing22-structural.json).
Its bytes are 887 and SHA-256 is
`33166f489b922ccde0339548ffd786b04bcaddfb31a9649d7d8b6f4b60985552`.

## Frozen Evidence

The editable candidates are separate from the read-only self-contained SOURCE
review packet. The packet has 75 files and 983333 payload bytes; every listed
payload hash passed verification and all packet files/directories are read-only.
The whole-book PDF and installed interpreter are hash-bound provenance, not
copied; offline review uses the packet's own raw page pixels.

[author-handoff.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-2122/frozen-review-packet/author-handoff.json):
2459 bytes, SHA-256
`5e56fc7efe8114e83277c973aeb452321454582652022a84ba0b9c5990aadb24`.

[manifest.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-2122/frozen-review-packet/manifest.json):
26557 bytes, SHA-256
`c89a8aacf6fabae651473155cb1acc3af6ed1877e16a4742b356b9c778810131`.

[packet-receipt.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-2122/packet-receipt.json):
586 bytes, SHA-256
`b5959904fdc18d9dbf9797a099b6255b6357d4fadc232cc6d6daa21db635cedb`.

FIRST freeze receipts are stored in `FIRST/0021/freeze.json` and
`FIRST/0022/freeze.json` inside this packet. They bind pre-finalize Markdown,
raw/grid PNG, layout, supplied template, invoked tool sources, profile, both
fresh skill reads, exact command, interpreter and source-PDF hashes.
FIRST Markdown:

| Page | Bytes | SHA-256 |
| --- | --- | --- |
| 21 | 2000 | `959b9637a46c2795dc596ad9fd2315029e4e09d517ec7009a7072797f20769f2` |
| 22 | 2704 | `ac5ece03c4f3f936b195ff492b463915194ab2bb671c80c2c4b02c4699783821` |

The source PDF SHA-256 is
`4ec6a3d5fafe2c5c861a5053cf8cf047a3a6bd7988a4de799859d6a4fef8cc46`.
Raw page PNG SHA-256 values are
`1a89ba33ff928f650764117b97b67a1774baf03b6722dc834ac544dfbeb1e4a1`
(21) and
`b672489af6be803dc533549b580d93e7d877c2b065912a599d0eb51bcc174839`
(22).

## Actual Command Receipts

CWD for both authorized calls:
`/Users/yong/.codex/worktrees/0f12/lemmadeck`.

```text
node .intentfold/tickets/STEMROBIN-180/tmp/record-step.mjs batch27-8p-source21-finalize-first /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 8p --page 21 --root .tmp/ld-s10y-lesson/source-author-8p-2122/artifacts --work .tmp/ld-s10y-lesson/source-author-8p-2122/work
node .intentfold/tickets/STEMROBIN-180/tmp/record-step.mjs batch27-8p-source22-finalize-first /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 8p --page 22 --root .tmp/ld-s10y-lesson/source-author-8p-2122/artifacts --work .tmp/ld-s10y-lesson/source-author-8p-2122/work
```

Complete actual stdout, stderr, call JSON and post-call outputs are frozen in
`attempts/0021/first/` and `attempts/0022/first/`. Both first calls passed, so
there are no failed gate bytes or repair-attempt receipts to fabricate.

| Receipt | Bytes | SHA-256 |
| --- | --- | --- |
| 21 stdout | 218 | `b1203709c445f154b654cc799c2448bbea93356105788f43cd98c72d68c58f25` |
| 21 call | 1012 | `138478e13e1ab751714366352ef22f20f84c8142aff433b854225ff74c43446d` |
| 22 stdout | 174 | `d843c8195c81f3f003ab2e81867283531999e4d69a175b1ca4438831a8991f18` |
| 22 call | 1012 | `591454c9a0b0d5707890027cbf558a6af3e0074d275b39daef537291738db5e7` |

Both stderr files are 0 bytes, SHA-256
`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
Candidate gate receipt: 1017 bytes, SHA-256
`3fc46930f292a6607e9caf2d830f8c66ae198f3bba3ebf47def974475a2bc89b`.
Package gate receipt: 967 bytes, SHA-256
`b6a5738f02f7f55897b1469e033290e5e928926e12ceaae1fcf705d20f83cd20`.
The package gate receipt is outside the already-sealed packet at
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-2122/verification/package.call.json`.

## Ledgers And Actual Edits

The packet contains row/task/emphasis/figure ledgers for each page, image ledger,
source provenance and a final figure-label supplement. The definition's bold
rows and nested italic term, three dotted-emphasis spans and punctuation outside
emphasis are preserved. Figure 7's two lowercase s labels retain their small
arrow accents, explicitly documented in `supplements/figure-label-detail.md`.

Actual image opens: 6; full-page reopens: 0; context total: 6/24; batch: 6/8;
parent opens: 0. Opened two source grids, one source emphasis crop and three
extracted figure crops. No image payload is returned.

Actual authored edits: two candidate Markdown files were written with
apply_patch; before FIRST, sentence periods were encoded as ASCII periods with
join spaces where needed. Author evidence builder, scoped verifier, final
figure-label supplement and this report were written using apply_patch.
Final candidate/tool outputs were generated by the authorized tools.
Actual post-gate repair edits: none. Actual gate failure attempts: none.

Two non-gate discovery commands returned nonzero: an rg probe named nonexistent
`page.py`/`md.py` paths (exit 2), and ls found the two expected not-yet-created
first-call receipts absent (exit 1). Neither was a finalize/startup/acceptance
failure; neither triggered a file repair or consumed a page repair budget.

No network, services, install, appdeps, fullchecks, IntentFold restart/handoff,
DB, publish, git, schema, charter, close, otherchat, SOURCE approval, modern,
vectorize, assembly, promotion, answers or private access was performed.

## Editable Candidate Hashes

All paths below share the absolute prefix
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-2122/artifacts/8p/pages/`.

| File | Bytes | SHA-256 |
| --- | --- | --- |
| 0021/page.md | 2881 | `cec86f4f78165fe4ba205182f09986eff5d74735798865aff2fd3dfbbb4a91fc` |
| 0021/page.json | 5035 | `99882ba7ebfd30822e7060babd49cb23db8240fa13833e5ce4e3d796330f57ae` |
| 0021/audit.json | 649 | `c5015fc3edd5f3d55760c28babaef3db47997b4b2ccdcbffb16acb6fac963f25` |
| 0022/page.md | 3422 | `746bc47013a990bb77c6e31d554622e02533aa668c16cb13f3873ef14bbcb170` |
| 0022/page.json | 5640 | `f3dc25a1fe8f75c1dbceee15935a48f611057030e67c0aa0014410b7b3226c94` |
| 0022/audit.json | 414 | `50ebccd3fe84b88004deb06c51ec2f6e68093b6795407c0c1416ed0e685c56ca` |
