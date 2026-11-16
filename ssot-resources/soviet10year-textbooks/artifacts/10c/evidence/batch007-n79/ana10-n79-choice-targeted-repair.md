# n79 CHOICE: one authorized targeted author repair

## Role and disposition

STEMROBIN-184 worker B remains the sole choice author, not an independent reviewer. This is the same single repair authorized after Peirce's complete initial Stage3 REVISE, not a new attempt after parent compaction. The author repair is complete and frozen. Independent changed-only review is pending; there is no author PASS review or approval.

Only Q2(e), Q3(d), Q7(e) and their directly corresponding derivation/misconception records changed. No Q1 wording, option reordering, key/truth, stem, mode, intent/source_solution, coverage, source text, seed or figure changed. No second repair was made.

## Three replacement false distractors

### Q2(e): endpoint rate, not the externally disclosed zero-point tangent slope

Visible replacement: 从区间内趋近任一端点时，函数变化速度的绝对值趋于 $1$。

Author derivation: for f(x)=sin x, f'(x)=cos x. Approaching either endpoint of the original open interval from inside gives |f'(x)| tending to 0, not 1. The reproducible error instead computes the endpoint limits of |sin x|, getting 1, and confuses function value with rate without differentiating.

The original Q4 candidate universe concerns tangent slopes at 0 and pi, not the limiting rate at +/-pi/2. It no longer directly negates this assertion irrespective of which Q4 candidate wins. The new assertion is separate from Q2's interior derivative trends and convexity claims.

### Q3(d): bounded derivative on the whole original branch

Visible replacement: 函数的一阶导函数在整个 $]-\frac{\pi}{2},\frac{\pi}{2}[$ 上有界。

Author derivation: g'(x)=1/cos²x tends to positive infinity approaching either endpoint from within the branch. It is not bounded on the whole open interval. The reproducible error reverses the reciprocal factor, writes cos²x as the derivative, and transfers 0<cos²x<=1 to the actual g'.

Q6/Q7 merely stating a graph point or branch at zero does not decide whole-interval derivative boundedness. Nor do Q6's candidate center slopes determine an endpoint limit. This assertion is not Q3(c)'s erroneous global convexity claim under another spelling.

### Q7(e): center symmetry confused with tangent-axis symmetry

Visible replacement: 两个分支分别以各自中心点处的切线为对称轴，关于该切线反射后各自保持不变。

Author derivation: for either center c=0 or -pi, translate to u=x-c, v=y. The branch is v=tg u and its center tangent is v=u. Reflection about this line exchanges u and v. The original branch has bounded horizontal domain (-pi/2,pi/2) and full-real vertical range, so the reflected set is not the original branch. The actual symmetry is central symmetry. The generating error correctly uses tg(c+u)=-tg(c-u), but confuses the central inversion (u,v)->(-u,-v) with reflection (u,v)->(v,u).

Every Q6 candidate having nonzero center slopes no longer directly rules this assertion out. Determining symmetry requires graph/coordinate reasoning. It is not a duplicate of Q7(b)'s local above/below-tangent claim.

These are author explanations for source relevance and removal of the three recorded direct leakage routes. They are not independently established answer_leakage PASS findings. Peirce must judge the changed learner snapshot before comparing its internal records. All other semantic evidence is eligible for reuse rather than whole-package re-solving.

## Strict mechanical changed-only comparison

The failing-capable structured comparison against complete pre-repair bytes succeeded:

- Exactly 9 draft leaf differences: `/questions/1/view/options/4/text`, `/questions/1/key/rationales/4/{derivation,misconception}`; `/questions/2/view/options/3/text`, `/questions/2/key/rationales/3/{derivation,misconception}`; `/questions/6/view/options/4/text`, `/questions/6/key/rationales/4/{derivation,misconception}`.
- Exactly 3 view leaf differences: those three option text fields. Both old and new `{id,view}` projections strictly equal their complete corresponding draft snapshots.
- 10 questions and 45 options remain; the other 42 complete option objects are deeply equal. Object/list keys, question order, option order and identifiers are unchanged.
- All 10 correct sets and 45 truth flags remain unchanged. The selected three rationales remain `incorrect`.
- Full initial draft/views/source-solve/notes/seed/structural stdout equal the additional complete before snapshot byte for byte.
- Current seed, source-solve, author notes, rejection, Stage2/Stage3 and initial display evidence equal their retained before bytes.

The exact before/after strings and complete changed paths are frozen in:

`.intentfold/tickets/STEMROBIN-184/tmp/ana10-n79-choice-targeted-repair-evidence/after/strict-changed-diff.json`

Raw SHA-256: `7590cfb7c4e8b42a3e4423301d6a19e371ab9b813a22b69e5bb02dd34bf43a67`.

The retained true sets are q1={a}, q2={a,b,d}, q3={a,b,e,f}, q4={a}, q5={a,b,e}, q6={a}, q7={a,b,c}, q8={a}, q9={a}, q10={a}. Q1's secondary rationale wording and the original key-position pattern are unchanged because neither repair nor reordering was authorized.

## Immutable bindings

All paths below are under `.intentfold/tickets/STEMROBIN-184/tmp/`.

| Artifact | Raw SHA-256 |
| --- | --- |
| `ana10-n79-choice-draft.json` | `aa42d3d2eca2a262439aedb271c51fb9ead4fd85215338b1f6f9cef16d3a75a6` |
| `ana10-n79-choice-views.json` | `87628a48b699fd305bb7679e1671de3551dad5c738dd3eb37890787c094e9c4c` |
| `ana10-n79-choice-views-repaired.json` | `87628a48b699fd305bb7679e1671de3551dad5c738dd3eb37890787c094e9c4c` |
| Initial draft in both complete before locations | `d5da87442e13b653fc2a5bf297543eefc147f00cc2579bbbe777e363739a4196` |
| Initial views in both complete before locations | `6bae66d6b2b69d2368450a64571ed7a5216f05274012cce31d92681a355e4666` |
| Unchanged source-solve | `fdbbae4ed392970ebcc79a80a702b119786e851b172f874cf2df68ca3d98fd20` |
| Unchanged author notes | `7743f45804844d29b94870a2c0679d676cdc60fc682397fe2d0b83508778e333` |
| Unchanged seed | `d851d70bdfbfb58e2c076e6d015e07697661cd5990bab8ded0ebf1f2399b7960` |
| Retained rejected review | `f964105fc77d9565eebdad9b5d9b89ac4aa0ff5d4d805a4f8ba8e9b83693d366` |
| Retained Peirce Stage2 | `0785f48de52d4e4070d145a33fce662475f5075bf17e4a79da434f187316d017` |

Canonical digests from official `prepare.py digest`:

```text
seed:           2991cf9c5f035c1804151c289a764d246781fec8018fc2860c6103b7738f56b2
repaired draft: f616dbe40f40684d0b4982eabec5e801595832fe351f0d1a26adf7d6666bd1df
repaired views: 48553092cf1b88a90785afb413e98e6deaa9281b1e2333b43546c26d1c366fa5
```

## Actual repaired structural command

Run exactly once, without review:

```bash
.claude/skills/ld-s10y-lesson/.venv/bin/python -B \
  .agents/skills/ld-s10y-choice/scripts/validate.py \
  --repo . \
  --seed .intentfold/tickets/STEMROBIN-184/tmp/ana10-n79-choice-seed.json \
  --draft .intentfold/tickets/STEMROBIN-184/tmp/ana10-n79-choice-draft.json
```

Actual exit: **0**. Actual stdout: `mechanical checks passed; semantic review still required`. Stderr is empty. This checks structure/current input binding, not semantic or display approval.

New command evidence is under `ana10-n79-choice-targeted-repair-evidence/after/`:

| File | Raw SHA-256 |
| --- | --- |
| `structure.stdout.txt` | `1c46f6519fd9f330b0c6109ab08c85474ff02f961f0fb5eb11550590e646f90b` |
| `structure.stderr.txt` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `structure-command.json` | `09606d55ff061988d18ab2a6bdcabd7d51c1f8bc8297e77e2bf1acd498e17352` |

## Preservation and stop

Complete initial author bytes remain in `ana10-n79-choice-initial/`. Additional complete author/rejection/Stage2/Stage3 snapshots and old screenshot/report/script/HTML bytes remain in `ana10-n79-choice-targeted-repair-evidence/before/`. Full repaired draft and both repaired learner projections remain in its `after/` directory. No rejected report was overwritten or rebound to the repaired snapshot.

Old desktop/mobile display evidence is preserved as initial-only evidence; it does not prove rendering of the changed strings. No browser or display check was opened or rerun. No source, modern text, tool, dependency, figure, DB, app, service, Git, other-chat or promotion action occurred.

Author repair is stopped immutable. The remaining gate is Peirce's authorized changed-only semantic comparison and any separately coordinated changed-text display check. If an essential defect remains, stop rather than attempt a second repair.
