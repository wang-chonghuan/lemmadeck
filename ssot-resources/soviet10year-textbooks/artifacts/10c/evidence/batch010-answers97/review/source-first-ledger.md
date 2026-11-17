# Source-First Ledger: ana10-c7-s1-n97

## Freeze Identity

- Ticket: STEMROBIN-184; same existing invocation, no new workflow invocation.
- Role: INDEPENDENT STANDARD ANSWER REVIEWER.
- Stage: source-first Stage A only; all 10 exercises solved before candidate disclosure.
- Date: 2026-11-17, Europe/Dublin.
- Status: FROZEN STAGE A. Candidate verdict WITHHELD. WAIT for explicit Stage B.
- Owned directory: `.intentfold/tickets/STEMROBIN-184/tmp/production-answers10c97-review/`.
- Frozen companion: `source-first-solutions.md`.
- Companion whole-file SHA-256: `cac5206b7aff9323d4bf706d2e397e303b9513618d9b26601b4f4b432bfeccef`.
- This ledger's whole-file SHA-256 is returned separately after writing; no
  self-referential whole-file hash is embedded.

Only the two source-first Markdown files were created. No preexisting review
directory was present at the initial directory inspection, so no existing
reviewer file was replaced. Files outside this directory were not edited.

## Evidence and Access Boundary

| Evidence | Permitted use | Whole-file SHA-256 |
| --- | --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/10c/lessons/ana10-c7-s1-n97/exercises.json` | Sole mathematical input; complete 5,237-byte UTF-8 snapshot retained in both records | `153f222b103ba5e1b2e09bbb02f950bf70f0dddcc624dbb04ce91c8bd0f3ca5e` |
| `.claude/skills/ld-s10y-answer/SKILL.md` | Current cap2 contract, read only; no prepare/finalize/publish execution | `afc242003e5bc2f3165dfc5bee60e2e684ed85e2627c7d57ce3501cdd76bfc83` |
| `.claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md` | Current gate2 contract, read only; no full-gate or candidate verdict | `9f2c6e2b781b008af8141f9685c20fc7cefb2a2ef457d05ac689070c504274a9` |

Nonmathematical repository instructions read: `.intentfold/readme.md`,
`.intentfold/charter/engineering.md`, and
`/Users/yong/.agents/skills/intentfold/SKILL.md`. They supplied ownership and
workflow constraints, not answers. No IntentFold capability was invoked, and
no SkillHost refresh or ticket/backend mutation was performed.

No answers/book-answer data, modern worked examples, candidate author files
or keys, choices, scans, or other lessons were accessed. Page references below
are strings copied from the sole JSON source, not evidence of opening a page.
No images/browser/tests, finalize/prepare/publish, DB/env/app/dependencies/schema,
Charter edits, Git, new workflow, grill, or other-chat messaging occurred.
File reads and raw-byte/hash checks are provenance checks only, not application
tests or an automated mathematical grading decision.

## Source-Derived Task Inventory

| Source group | Exact group instruction | Exercises | Printed units | Mathematical obligation |
| --- | --- | --- | --- | --- |
| `g1` | `习题证明：函数 $F$ 是函数 $f$ 在给定区间上的原函数：` | 392-397 | `а)` and `б)` for each: 12 | Prove the printed fixed function satisfies `F'=f` on the printed open interval |
| `g2` | `求函数$f$在$R$上的原函数：` | 398-401 | One each: 4 | Find primitives on all of `R`; record arbitrary real constants |

Source order is exactly `392,393,394,395,396,397,398,399,400,401`.
Both `number` and `source_number` are retained, as are all `text`, `lines`,
`group`, `group_id`, `pages`, `figure_refs`, and `figures` fields in the snapshot.
Every source exercise has empty figure lists; none requires image inspection
for the mathematical obligations in this source-only review.

There are 10 distinct exercises and 16 distinct printed obligations, with no
missing, duplicated, or merged subpart in the independent solution record.

## Per-Unit Derivative and Reverse-Verification Ledger

The formulas below summarize the fully expanded calculations in the pinned
companion. `R` denotes the real line; `C` is a real constant independent of `x`.
For proof rows, the printed `F`, including its fixed constant, is used unchanged.
The labels `а)` and `б)` are the source's Cyrillic labels, not reassigned labels.

| Unit | Source anchor and group | Printed data and exact domain | Independent derivative calculation | Reversible check and domain safeguard |
| --- | --- | --- | --- | --- |
| 392 `а)` | `p0105#7`, `g1`, first line | `F=3\sqrt[3]{x}`, `f=1/\sqrt[3]{x^2}`, `x\in]0,\infty[` | `F'=3(1/3)x^{-2/3}=1/\sqrt[3]{x^2}` | For `u=\sqrt[3]{x}>0`, `u^3=x` gives `3u^2u'=1`; `u^2=\sqrt[3]{x^2}`. Reverse `f=x^{-2/3}=3(1/3)x^{1/3-1}`. Denominators nonzero; zero excluded. |
| 392 `б)` | `p0105#7`, `g1`, second line | `F=\sin x+3`, `f=\cos x`, `x\in]-\infty,\infty[` | `F'=\cos x+0=\cos x` | Reverse `f=(\sin x)'+(3)'`. The fixed `+3` differentiates to zero; both functions differentiable on `R`. |
| 393 `а)` | `p0106#1`, `g1`, first line | `F=(3/2)\sqrt[3]{x^2}-5`, `f=1/\sqrt[3]{x}`, `x\in]0,\infty[` | `F'=(3/2)(2/3)x^{-1/3}-0=1/\sqrt[3]{x}` | Root check with `u^3=x^2` gives `(3/2)u'=x/u^2=x/x^{4/3}`. Reverse `f=x^{-1/3}=(3/2)(2/3)x^{2/3-1}+(-5)'`. Fixed `-5`; real positive nonzero root. |
| 393 `б)` | `p0106#1`, `g1`, second line | `F=4-\cos x`, `f=\sin x`, `x\in]-\infty,\infty[` | `F'=0-(-\sin x)=\sin x` | Reverse `f=(4)'-(\cos x)'`; retain the double sign and fixed `4`. Domain all `R`. |
| 394 `а)` | `p0106#2`, `g1`, first line | `F=(3/4)\sqrt[3]{x^4}`, `f=\sqrt[3]{x}`, `x\in]0,\infty[` | `F'=(3/4)(4/3)x^{1/3}=\sqrt[3]{x}` | Root check `u^3=x^4` gives `(3/4)u'=x^3/u^2=x^{1/3}`. Reverse `f=x^{1/3}=(3/4)(4/3)x^{4/3-1}`. Positive interval validates each fractional power and division. |
| 394 `б)` | `p0106#2`, `g1`, second line | `F=\operatorname{tg}x-\sqrt2`, `f=1/\cos^2x`, `x\in]-\pi/2,\pi/2[` | `F'=[\cos^2x+\sin^2x]/\cos^2x-0=1/\cos^2x` by the quotient rule | Reverse `1/\cos^2x=(\cos^2x+\sin^2x)/\cos^2x`, recovering `(tg x)'-(\sqrt2)'`. Here `\cos x>0`; both endpoints excluded. `\sqrt2` is a constant principal root. |
| 395 `а)` | `p0106#3`, `g1`, first line | `F=(2/3)\sqrt{x^3}`, `f=\sqrt x`, `x\in]0,\infty[` | `F'=(2/3)(3/2)x^{1/2}=\sqrt x` | Chain check `(2/3)3x^2/(2\sqrt{x^3})=x^2/(x\sqrt x)=\sqrt x`. Reverse `f=x^{1/2}=(2/3)(3/2)x^{3/2-1}`. Principal roots; `x>0` makes divisions valid. |
| 395 `б)` | `p0106#3`, `g1`, second line | `F=3-\operatorname{ctg}x`, `f=1/\sin^2x`, `x\in]0,\pi[` | `(ctg x)'=[-\sin^2x-\cos^2x]/\sin^2x=-1/\sin^2x`; `F'=0-(-1/\sin^2x)=f` | Reverse `f=-[-(\sin^2x+\cos^2x)/\sin^2x]`, recovering the negative cotangent derivative plus `(3)'`. Fixed `3`; `\sin x>0` on the printed interval. |
| 396 `а)` | `p0106#4`, `g1`, first line | `F=14-1/x`, `f=1/x^2`, `x\in]-\infty,0[` | `F'=0-(-x^{-2})=1/x^2` | Quotient check `(1/x)'=(0x-1)/x^2=-1/x^2`; reverse `f=(14)'-(x^{-1})'`. Negative arguments are valid; zero excluded. Fixed `14`. |
| 396 `б)` | `p0106#4`, `g1`, second line | `F=9-1/x`, `f=1/x^2`, `x\in]0,\infty[` | `F'=0-(-x^{-2})=1/x^2` | Same reciprocal quotient identity on this separate positive interval; reverse `f=(9)'-(x^{-1})'`. Fixed `9`, not `14`; zero excluded. |
| 397 `а)` | `p0106#5`, `g1`, starred first line | `F=\lvert x\rvert`, `f=1`, `x\in]0,\infty[` | On this interval `\lvert x\rvert=x`, hence `F'=1` | For sufficiently small nonzero `h`, both `x` and `x+h` are positive; the difference quotient `((x+h)-x)/h=1`. Reverse branch identity recovers the printed absolute value; no derivative claim at zero. |
| 397 `б)` | `p0106#5`, `g1`, second line | `F=\lvert x\rvert`, `f=-1`, `x\in]-\infty,0[` | On this interval `\lvert x\rvert=-x`, hence `F'=-1` | For sufficiently small nonzero `h`, both arguments are negative; `(-(x+h)-(-x))/h=-1`. The negative branch is retained; zero is excluded and has no two-sided derivative. |
| 398 | `p0106#7`, `g2`, single line | `f=x^3`, `x\in R` | `F=x^4/4+C`; `F'=(1/4)4x^3+0=x^3` | Reverse coefficient equation `(a x^4)'=4a x^3`, `4a=1`, `a=1/4`. Polynomial domain is all `R`; `C\in R`; `C=0` gives one primitive. |
| 399 | `p0106#8`, `g2`, single line | `f=x^4`, `x\in R` | `F=x^5/5+C`; `F'=(1/5)5x^4+0=x^4` | Reverse `(a x^5)'=5a x^4`, `5a=1`, `a=1/5`. All real arguments, including zero; `C\in R`; `C=0` gives one primitive. |
| 400 | `p0106#9`, `g2`, single line | `f=x`, `x\in R` | `F=x^2/2+C`; `F'=(1/2)2x+0=x` | Reverse `(a x^2)'=2a x`, `2a=1`, `a=1/2`. No excluded real arguments; `C\in R`; `C=0` gives one primitive. |
| 401 | `p0106#10`, `g2`, single line | Printed `f=2\frac12=2+1/2=5/2`, `x\in R` | `F=(5/2)x+C`; `F'=(5/2)1+0=5/2` | Reverse `(a x)'=a`, hence `a=5/2=2+1/2`, recovering the mixed number, not a product. All `R`; `C\in R`; `C=0` gives one primitive. |

### Root, Sign, Constant, and Interval Accounting

- Real cube roots are unambiguous; positive `x` permits the power reductions
  in 392 `а)`, 393 `а)`, and 394 `а)`. Root/chain checks in the companion
  confirm the same derivatives directly.
- Square roots in 395 `а)` are principal nonnegative roots. The identity
  `\sqrt{x^3}=x\sqrt x` is used only for `x>0`; the displayed divisions do not
  cross zero. The separate `\sqrt2` in 394 `б)` is a fixed real constant.
- Tangent and cotangent are differentiated in radians by the quotient rule.
  Nonzero cosine and sine are established on their respective open intervals.
- The constants in given proof functions are accounted for individually:
  392 `б)` has `+3`; 393 `а)` has `-5`; 393 `б)` has `+4`;
  394 `б)` has `-\sqrt2`; 395 `б)` has `+3`;
  396 `а)` has `+14`; 396 `б)` has `+9`. Each has derivative zero.
  The remaining given proof functions have no printed additive constant.
- Reciprocal signs and absolute-value branches are checked separately on each
  printed interval. No proof silently combines the two halves across zero.
- In 398-401, every `C\in R` works. Conversely, the difference of any two
  primitives has derivative zero everywhere on the connected real line;
  the mean value theorem implies that difference is a single constant.
  Thus each displayed family is complete mathematically, with no automatic
  grading policy asserted.

## cap2 / gate2 Contract Application

| Contract obligation | Stage A evidence or boundary |
| --- | --- |
| Correct exercise identity and domain | Source `number`, `source_number`, group head, ordered printed subparts, and page strings retained; 16 ledger rows align to those exact source obligations. No modern/candidate/scan alignment claim is made. |
| Derived answers require full solution | All 16 units have explicit derivative calculations and reversible verification in the companion, with domain, root, sign, and constant accounting. Mathematical provenance is independent derivation only. |
| Every printed subpart must be covered | Both `а)` and `б)` covered separately for each of 392-397; single tasks covered for each of 398-401. No production `parts` field was created or evaluated. |
| Proof display needs reasons, not just a conclusion | Full differentiability/domain justification and `F'=f` calculations are recorded, including direct root/quotient/branch checks. Candidate display adequacy remains withheld. |
| Existing book answers must be verified when used | None used or read. No `bookRaw` or book-provenance assertion is invented. |
| Production edition semantics and answer provenance | This explicitly source-only Stage A uses the authorized original JSON, not an edition or candidate. Any later edition/candidate comparison requires Stage B. |
| Reliable grading and actual editor input-chain validation | Not evaluated or executed. No `expected`, grading, or infinite-family autograding decision. No tests, browser, or MathLive invocation. |
| Full gate completion followed by finalize/publish | Not requested and not performed. These two scratch records do not claim a full gate pass or production readiness. |

## Exact Mathematical Source Snapshot

The raw UTF-8 bytes inside this single JSON fence, including the final newline,
are the complete 5,237-byte mathematical source, not a normalized or selected
excerpt. Snapshot SHA-256:
`153f222b103ba5e1b2e09bbb02f950bf70f0dddcc624dbb04ce91c8bd0f3ca5e`.
The source includes both exact group instructions and every printed subpart.

```json
{
  "lesson": "ana10-c7-s1-n97",
  "count": 10,
  "exercises": [
    {
      "number": "392",
      "source_number": "392",
      "group": "习题证明：函数 $F$ 是函数 $f$ 在给定区间上的原函数：",
      "group_id": "g1",
      "text": "392. а) $F(x)=3\\sqrt[3]{x}$，$f(x)=\\frac{1}{\\sqrt[3]{x^2}}$，$x\\in]0,\\infty[$；б) $F(x)=\\sin x+3$，$f(x)=\\cos x$，$x\\in]-\\infty,\\infty[$.",
      "lines": [
        "392. а) $F(x)=3\\sqrt[3]{x}$，$f(x)=\\frac{1}{\\sqrt[3]{x^2}}$，$x\\in]0,\\infty[$；",
        "б) $F(x)=\\sin x+3$，$f(x)=\\cos x$，$x\\in]-\\infty,\\infty[$."
      ],
      "pages": [
        "p0105#7"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "393",
      "source_number": "393",
      "group": "习题证明：函数 $F$ 是函数 $f$ 在给定区间上的原函数：",
      "group_id": "g1",
      "text": "393. а) $F(x)=\\frac{3}{2}\\sqrt[3]{x^2}-5,\\ f(x)=\\frac{1}{\\sqrt[3]{x}},\\ x\\in]0,\\infty[;$ б) $F(x)=4-\\cos x,\\ f(x)=\\sin x;\\ x\\in]-\\infty,\\infty[.$",
      "lines": [
        "393. а) $F(x)=\\frac{3}{2}\\sqrt[3]{x^2}-5,\\ f(x)=\\frac{1}{\\sqrt[3]{x}},\\ x\\in]0,\\infty[;$ ",
        "б) $F(x)=4-\\cos x,\\ f(x)=\\sin x;\\ x\\in]-\\infty,\\infty[.$"
      ],
      "pages": [
        "p0106#1"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "394",
      "source_number": "394",
      "group": "习题证明：函数 $F$ 是函数 $f$ 在给定区间上的原函数：",
      "group_id": "g1",
      "text": "394. а) $F(x)=\\frac{3}{4}\\sqrt[3]{x^4},\\ f(x)=\\sqrt[3]{x},\\ x\\in]0,\\infty[;$ б) $F(x)=\\operatorname{tg}x-\\sqrt{2},\\ f(x)=\\frac{1}{\\cos^2 x},\\ x\\in]-\\frac{\\pi}{2},\\frac{\\pi}{2}[.$",
      "lines": [
        "394. а) $F(x)=\\frac{3}{4}\\sqrt[3]{x^4},\\ f(x)=\\sqrt[3]{x},\\ x\\in]0,\\infty[;$ ",
        "б) $F(x)=\\operatorname{tg}x-\\sqrt{2},\\ f(x)=\\frac{1}{\\cos^2 x},\\ x\\in]-\\frac{\\pi}{2},\\frac{\\pi}{2}[.$"
      ],
      "pages": [
        "p0106#2"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "395",
      "source_number": "395",
      "group": "习题证明：函数 $F$ 是函数 $f$ 在给定区间上的原函数：",
      "group_id": "g1",
      "text": "395. а) $F(x)=\\frac{2}{3}\\sqrt{x^3},\\ f(x)=\\sqrt{x},\\ x\\in]0,\\infty[;$ б) $F(x)=3-\\operatorname{ctg}x,\\ f(x)=\\frac{1}{\\sin^2 x},\\ x\\in]0,\\pi[.$",
      "lines": [
        "395. а) $F(x)=\\frac{2}{3}\\sqrt{x^3},\\ f(x)=\\sqrt{x},\\ x\\in]0,\\infty[;$ ",
        "б) $F(x)=3-\\operatorname{ctg}x,\\ f(x)=\\frac{1}{\\sin^2 x},\\ x\\in]0,\\pi[.$"
      ],
      "pages": [
        "p0106#3"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "396",
      "source_number": "396",
      "group": "习题证明：函数 $F$ 是函数 $f$ 在给定区间上的原函数：",
      "group_id": "g1",
      "text": "396. а) $F(x)=14-\\frac{1}{x},\\ f(x)=\\frac{1}{x^2},\\ x\\in]-\\infty,0[;$ б) $F(x)=9-\\frac{1}{x},\\ f(x)=\\frac{1}{x^2},\\ x\\in]0,\\infty[.$",
      "lines": [
        "396. а) $F(x)=14-\\frac{1}{x},\\ f(x)=\\frac{1}{x^2},\\ x\\in]-\\infty,0[;$ ",
        "б) $F(x)=9-\\frac{1}{x},\\ f(x)=\\frac{1}{x^2},\\ x\\in]0,\\infty[.$"
      ],
      "pages": [
        "p0106#4"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "397",
      "source_number": "397",
      "group": "习题证明：函数 $F$ 是函数 $f$ 在给定区间上的原函数：",
      "group_id": "g1",
      "text": "397. * а) $F(x)=|x|,\\ f(x)=1,\\ x\\in]0,\\infty[;$ б) $F(x)=|x|,\\ f(x)=-1,\\ x\\in]-\\infty,0[.$",
      "lines": [
        "397. * а) $F(x)=|x|,\\ f(x)=1,\\ x\\in]0,\\infty[;$ ",
        "б) $F(x)=|x|,\\ f(x)=-1,\\ x\\in]-\\infty,0[.$"
      ],
      "pages": [
        "p0106#5"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "398",
      "source_number": "398",
      "group": "求函数$f$在$R$上的原函数：",
      "group_id": "g2",
      "text": "398. $f(x)=x^3.$",
      "lines": [
        "398. $f(x)=x^3.$"
      ],
      "pages": [
        "p0106#7"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "399",
      "source_number": "399",
      "group": "求函数$f$在$R$上的原函数：",
      "group_id": "g2",
      "text": "399. $f(x)=x^4.$",
      "lines": [
        "399. $f(x)=x^4.$"
      ],
      "pages": [
        "p0106#8"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "400",
      "source_number": "400",
      "group": "求函数$f$在$R$上的原函数：",
      "group_id": "g2",
      "text": "400. $f(x)=x.$",
      "lines": [
        "400. $f(x)=x.$"
      ],
      "pages": [
        "p0106#9"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "401",
      "source_number": "401",
      "group": "求函数$f$在$R$上的原函数：",
      "group_id": "g2",
      "text": "401. $f(x)=2\\frac{1}{2}.$",
      "lines": [
        "401. $f(x)=2\\frac{1}{2}.$"
      ],
      "pages": [
        "p0106#10"
      ],
      "figure_refs": [],
      "figures": []
    }
  ]
}
```

## Freeze Evidence and Stop

The companion snapshot was compared with the source as raw bytes before the
companion hash was pinned here: byte equality held, snapshot/source SHA-256 was
`153f222b103ba5e1b2e09bbb02f950bf70f0dddcc624dbb04ce91c8bd0f3ca5e`,
and source size was 5,237 bytes. The final read-only provenance check compares
both JSON snapshots with the unchanged source, confirms the pinned companion
hash, and returns the final whole-file hashes without rewriting either record.

Source-first completeness: 10/10 exercises, 16/16 printed obligations.
Mathematical derivations are frozen independently of any candidate.
Candidate disclosed: NO. Candidate verdict: WITHHELD.
Stage B authorization: NOT GIVEN. Next action: WAIT for explicit Stage B.
