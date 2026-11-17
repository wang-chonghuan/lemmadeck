# Standard Answer Author Report

- Continuing invocation: STEMROBIN-184; no new workflow.
- Scope: book `10c`, edition `modern-us-neutral`, lesson `ana10-c7-s1-n97` only.
- Role: offline STANDARD ANSWER AUTHOR, not independent reviewer or publisher.
- Coverage: all 10 exercises, 392-401, and all 16 printed tasks.
- State: candidate written; WAIT for the parent's independent gate.

## Inputs and Provenance

The sole mathematical input was the prepared template, including its modern written exercise snapshot:

`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-answers10c97/10c/modern-us-neutral/lessons/ana10-c7-s1-n97/answer-keys.template.json`

The current cap2 rules and gate2 checklist were read from:

- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-answer/SKILL.md`
- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md`

All 16 tasks were independently solved before writing the candidate. No source-first reviewer output, choices, worked prose, original-book answers, source scans, or other lessons were read. No images were needed or opened.

Every answer has `source: "derived"`. The provided prompt, not a purported book answer, is the evidence. No `bookRaw` is present or fabricated. Display prose follows the Chinese modern snapshot and introduces no historical or cultural entities.

## Independent Solutions

Exercises 392-397 ask for proofs about the specific given functions, not replacement primitives. The candidate retains all supplied additive constants and proves differentiability and $F'=f$ on each stated interval.

### 392

a) For $x\in(0,\infty)$, $F(x)=3\sqrt[3]{x}=3x^{1/3}$ is differentiable, and $\sqrt[3]{x^2}>0$. The power rule gives

$$F'(x)=3\cdot\frac13x^{-2/3}=\frac{1}{\sqrt[3]{x^2}}=f(x).$$

b) On $\mathbb R$, the given $F(x)=\sin x+3$ is differentiable everywhere. The supplied constant remains in the function and contributes zero:

$$F'(x)=(\sin x+3)'=\cos x+0=f(x).$$

### 393

a) For $x\in(0,\infty)$, $\sqrt[3]{x^2}=x^{2/3}$ and $\sqrt[3]{x}>0$. Thus the given $F(x)=\frac32\sqrt[3]{x^2}-5$ is differentiable, and

$$F'(x)=\left(\frac32x^{2/3}-5\right)'=\frac32\cdot\frac23x^{-1/3}+0=\frac{1}{\sqrt[3]{x}}=f(x).$$

b) On $\mathbb R$, the given $F(x)=4-\cos x$ is differentiable everywhere:

$$F'(x)=(4-\cos x)'=0+\sin x=f(x).$$

### 394

a) For $x\in(0,\infty)$, $\sqrt[3]{x^4}=x^{4/3}$. The given $F(x)=\frac34\sqrt[3]{x^4}$ is differentiable, and

$$F'(x)=\frac34\cdot\frac43x^{1/3}=\sqrt[3]{x}=f(x).$$

b) On $(-\pi/2,\pi/2)$, $\cos x>0$, so both $\operatorname{tg}x=\tan x=\sin x/\cos x$ and $1/\cos^2x$ have nonzero denominators. The quotient rule and the derivative of the supplied constant give

$$F'(x)=(\tan x-\sqrt2)'=\frac{\cos^2x+\sin^2x}{\cos^2x}+0=\frac{1}{\cos^2x}=f(x).$$

### 395

a) For $x\in(0,\infty)$, $\sqrt{x^3}=x^{3/2}$ is real and differentiable. The given $F(x)=\frac23\sqrt{x^3}$ therefore satisfies

$$F'(x)=\frac23\cdot\frac32x^{1/2}=\sqrt{x}=f(x).$$

b) On $(0,\pi)$, $\sin x>0$, so $\operatorname{ctg}x=\cot x=\cos x/\sin x$ is defined and differentiable, and $1/\sin^2x$ is defined. The quotient rule gives

$$(\cot x)'=\frac{-\sin^2x-\cos^2x}{\sin^2x}=-\frac{1}{\sin^2x}.$$

For the actual supplied $F(x)=3-\cot x$,

$$F'(x)=0-\left(-\frac{1}{\sin^2x}\right)=\frac{1}{\sin^2x}=f(x).$$

### 396

a) On $(-\infty,0)$, $x\ne0$, so the given $F(x)=14-1/x$ is defined and differentiable, as is required for the proof:

$$F'(x)=(14-x^{-1})'=0-(-x^{-2})=\frac{1}{x^2}=f(x).$$

b) On $(0,\infty)$, $x\ne0$ again. The distinct supplied constant $9$ is retained in $F(x)=9-1/x$:

$$F'(x)=(9-x^{-1})'=0-(-x^{-2})=\frac{1}{x^2}=f(x).$$

No extension through $x=0$ is asserted.

### 397

a) On $(0,\infty)$, $F(x)=|x|=x$, so $F'(x)=1=f(x)$.

b) On $(-\infty,0)$, $F(x)=|x|=-x$, so $F'(x)=-1=f(x)$.

The derivative of $|x|$ does not exist at $0$, but neither stated interval contains $0$.

### 398

On $\mathbb R$, the complete family is

$$F(x)=\frac{x^4}{4}+C,\qquad C\in\mathbb R.$$

Every member is differentiable on all of $\mathbb R$, and $F'(x)=4x^3/4+0=x^3=f(x)$.

### 399

On $\mathbb R$, the complete family is

$$F(x)=\frac{x^5}{5}+C,\qquad C\in\mathbb R.$$

Every member is differentiable on all of $\mathbb R$, and $F'(x)=5x^4/5+0=x^4=f(x)$.

### 400

On $\mathbb R$, the complete family is

$$F(x)=\frac{x^2}{2}+C,\qquad C\in\mathbb R.$$

Every member is differentiable on all of $\mathbb R$, and $F'(x)=2x/2+0=x=f(x)$.

### 401

The printed $2\frac12$ is a mixed number:

$$2\frac12=2+\frac12=\frac52.$$

It is not $2\cdot\frac12$. On $\mathbb R$, the complete family is

$$F(x)=\frac52x+C,\qquad C\in\mathbb R.$$

Every member is differentiable on all of $\mathbb R$, and $F'(x)=5/2+0=f(x)$.

For each of 398-401, if $G$ is any other primitive and $F_0$ is the displayed zero-constant primitive, then $(G-F_0)'=0$ everywhere on the connected interval $\mathbb R$. Applying the mean value theorem between any two real points shows that $G-F_0$ is a single constant. This proves completeness, not merely existence. Each candidate display answer includes this reasoning and the arbitrary real constant.

## Grading and Gate Boundary

All 10 answers have `grading: "ungraded"` and `parts: []`. There are no `expected` fields or automatic judge declarations.

- 392-397 are two-part proofs. Matching a derivative expression would not establish the submitted domain and proof reasoning.
- 398-401 ask for arbitrary-constant families. No reliable automatic equivalence contract for complete primitive-family submissions was validated in this authoring scope. A match against one chosen primitive would not reliably judge the requested family.
- The 16 printed tasks are independently identified in this report and in the display prose. The ungraded answers intentionally do not turn those labels into machine-judged `parts`.
- The production schema remains `ld-s10y-answer/lesson-answers@1`. The candidate retains `status: "draft"` and does not claim to be finalized, accepted, or published.
- All exercise identifiers 392-401 appear once in the candidate, in the prepared order. The 12 proof subparts and four primitive tasks each receive explicit mathematical answers.

This report is author evidence, not the parent's independent gate result. The independent gate, promotion, finalization, and publication remain outstanding and belong to the parent.

## Files and Byte Fingerprints

Prepared input, unchanged:

`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-answers10c97/10c/modern-us-neutral/lessons/ana10-c7-s1-n97/answer-keys.template.json`

- Bytes: `3308`.
- Raw-byte SHA-256: `222565c49278261949bb5e27a685a3b8ccf800f683153832b08300fbbb12cf27`.
- SHA-256 matched before and after writing the candidate.

Candidate answer keys:

`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-answers10c97/author/answer-keys.json`

- Bytes: `6238`.
- Raw-byte SHA-256: `61d755410afbbed81b2b70ef6a8837cd2db1065633d22e0a54de42a6c2315b93`.

This report:

`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-answers10c97/author/author-report.md`

The report's own whole-file byte count and SHA-256 are recorded as detached command evidence after creation; they are not embedded recursively in the report. Fingerprints refer to saved file bytes, not parsed or reserialized JSON.

## Actions and Restrictions

Only the candidate answer keys and this report were written, using `apply_patch`. The prepared template was left unchanged and no other worker's files were modified.

No tests, validators, prepare/finalize/publish commands, database access, environment changes, app runs, dependency changes, schema changes, Charter edits, Git operations, browsers, images, new workflow/ticket actions, or messages to other chats were performed.

WAIT.
