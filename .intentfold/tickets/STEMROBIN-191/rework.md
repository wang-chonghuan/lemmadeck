# STEMROBIN-191 — rework since the frozen handoff

`handoff.md` froze at `ce35869ef`, with `math3-c1-s2` produced and published and the
session's own consumption measured. Everything below was asked for after that commit.
Ten commits, 114 files, +10 623 / −59.

## 1. 「用了多少 token？值多少钱？实际用时几分钟？」

Measurement only, no repository change. Priced the frozen run against the published rate
card: 107,458,444 tokens ≈ $77.90, of which cache reads were 98.3% of the tokens and 68%
of the money. Reading the transcript for the price also showed that the recorded wall
clock, 2 h 52 m, contained a 2 h 09 m gap spent waiting for a human answer — real machine
time was 47 minutes. The handoff's wall-clock line is therefore misleading as written; it
is left frozen and corrected here rather than edited in place.

## 2. 「把工具改干净，push 一次，再跑全新的一课。禁止等我。」

**Tools** (`b58d592cf`). The six defects the frozen handoff had only recorded were closed,
each with its reason in the commit: the `owner-ex` regex that silently rewrote a closed
page, a cap1 check for printed column rows that would fuse when joined, an `assemble`
guard that refuses to overwrite a `lesson.json` a published edition binds to by sha256,
an `exerciseNumbering` warning, pre-seeded `mode`/`svg`/`render`/`review` in the figures
template, and a `meter.py` that separates fresh input from 5-minute and 1-hour cache
writes and prices the session. The delivery SOP gained one stage, one session; check the
context ceiling first; a stop is not a wait. Tool tests 68 pass.

**Lesson** (`761cd9c3a`). `math3-c1-s3`「重量单位」produced from physical pages 0037–0041,
29 exercises and 4 deterministic figures, no paid image call. Transcribing printed page 33
showed it carrying the tail of 长度单位 above the 重量单位 heading, so `math3-c1-s2` — already
published under this ticket — was missing exercises 129–133 and one figure. It was
completed and republished, its accepted rewrites for 117–128 reused byte for byte.

Cost of this round: 256 turns, 79,124,867 tokens, ≈ $50.64, 37 minutes with no idle gap.

## 3. 「你咋不开个新会话或者 sub agent 来做呢」

The answer was that a new session was the right call and had not been taken; a subagent
was not, because its tokens never reach this session's transcript and the ticket's whole
purpose is measurement. `math3-c1-s4`「时间单位，秒」was then produced in a fresh session,
which handed off at the cap3→cap4 boundary to a second one — the SOP rule exercised for
real (`950c5e416`, `c89c71d06`, `ff829d465`, `199e6eb5d`, `2431d764a`).

That session also reported that the SOP's rule 1 told it to refuse the lesson because its
model's window is 1M rather than 200K. The rule was wrong as drafted — the ceiling is the
point, not the model — and was restated (`f3f29f112`).

Cost: $46.00 over two sessions, 340 turns, 58.9M tokens, against $50.64 for round 2.
Average context fell 44%, from 309K to 173K, but turn count rose 33%, so the net saving
was 9%. Per-cap context readings: 90.7K at the SOP check, 233K at the handoff boundary.

## 4. 「一课这么贵，肯定不对，才几页 PDF，你从 0 思考一下」

Measurement only, no repository change. One lesson's irreducible content is about 8K
tokens in and 15K out, ≈ $0.42 at list price, against $46 paid — 110×. Of the 254 turns in
round 2's window, 107 called no tool and emitted no text, and the 132 shell commands
stand against roughly 20 the pipeline actually needs. The gap is turn count, not context
size: validators report one error class per round trip, and the model is made to supply
geometry (figure boxes, label positions) the machine can compute. The two changes made
earlier address the context term only, which is why they bought 9%.

## 5. Repairs found by that work (`86fa1e537`)

`math3-c1-s4` had shipped exercise 175 with its three columns run together
(`1分20秒3 500厘米`): the check added in round 2 fires only when both printed lines carry a
fullwidth equals sign, and this grid has none. `blocks.py` now also warns on the broader
shape — two lines both carrying the fullwidth column separator where the first does not end
in punctuation — which fires 10 times across the corpus's 1,587 pages, roughly six of them
real, so it warns rather than failing the page.

Re-assembling after that fix showed `math3-c1-s3` reaching exercises 163 and 164, which sit
on printed page 38 above the 时间单位 heading: the same mid-page boundary that had already
cost 长度单位 five exercises, now the third occurrence. Both lessons were republished with
their accepted rewrites reused (28 of 31 and 15 of 16). `math3-c1-ex1` lost its `section`
to `assemble` again and was restored.

## Criteria rechecked after the last change

Read back from the content database: `math3-c1-s2` 17 exercises (117–133, 3 figures),
`math3-c1-s3` 31 (134–164, 4 figures), `math3-c1-s4` 16 (165–179 + q1, 3 figures) with
exercise 175's columns separated, `math3-c1-ex1` untouched. Mechanical defence green:
`audit.py`, `validate.py`, 68 skill tests, app tests and `npm run build`.

## Net effect against the frozen handoff

The ticket's own acceptance — `math3-c1-s2` produced, published and read back — held
throughout and is stronger now, since that lesson was incomplete when the handoff froze.
Three lessons are live instead of one, the six recorded pipeline defects are closed rather
than merely listed, and the measurement the ticket exists for has three data points instead
of one. Still open and recorded rather than fixed: the mid-page lesson boundary has no
mechanical check and has now cost three lessons; `assemble` still drops `math3-c1-ex1`'s
section on every run; two weight denominations in `tbl-p0039-02` are illegible in the source
scan and are drawn as `?`.
