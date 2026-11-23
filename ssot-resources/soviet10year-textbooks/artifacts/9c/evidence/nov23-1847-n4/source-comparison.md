# Bounded independent source-to-candidate text comparison

Ticket: STEMROBIN-184. Finish: review. Date: 2026-11-23.
Sole working directory: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

## Basis and scope

One substantive comparison against the already frozen independent observations:

`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n4/independent-source-first.md`

Candidate text files read:

- `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n4-nov23-source2324/artifacts/9c/pages/0023/page.md`
- `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n4-nov23-source2324/artifacts/9c/pages/0023/page.json`
- `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n4-nov23-source2324/artifacts/9c/pages/0024/page.md`
- `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n4-nov23-source2324/artifacts/9c/pages/0024/page.json`

No parent observations, neighboring pages, images, or machine-geometry evidence
were read. The original freeze and candidates were not modified.

## Actual candidate errors

None found in the compared printed prose, formulas, Cyrillic sequences/subparts,
or page/task continuations. Both Markdown and JSON represent the content and
boundaries recorded in the independent freeze.

## physical23: text PASS

- The opening remains a continuation of exposition, not a new exercise.
  The sole-element, two-letter, and three-letter explanations agree with the
  freeze.
- Cyrillic А, Б, В are retained. The two orders are АБ and БА; the six orders
  remain АБВ, АВБ, БАВ, БВА, ВАБ, ВБА in that order.
- The finite-set permutation definition, meaning of P_n, initial values
  P_1=1, P_2=2, P_3=6, and recurrence P_n=nP_{n-1} numbered (1) agree.
- The proof preserves the last-position choice and remaining n-1 positions,
  ending with nP_{n-1} ways. The printed calculation list from P_2 through P_8
  retains its factors and values, ending at 40320.
- The last calculation paragraph is marked open; physical24 begins with its
  continuation. There is no exercise heading or numbered exercise on
  physical23. Printed folio 16 agrees.
- The handwritten recurrence-like annotation is not inserted into textbook
  prose or formulas. No text change or added ink exclusion is requested.

## physical24: text PASS

- The initial continuation preserves P_9=362880, P_10=3628800, and
  P_11=39916800 with the recorded factors. The 11-guests/11-chairs example
  retains 39916800 ways.
- The reference to exercise 19, product formula (2), factorial notation and
  reading, formula (3), empty-set convention P_0=1, and
  P_1=1×P_0=1 agree with the freeze.
- The exercise heading separates exposition from tasks 32, 33, and 34.
- Task 32 retains Cyrillic а), б), в), г) and the respective sets
  {1}, {7,8}, {a,b,c}, {m,n,p,q}; the set variables are not substituted for
  the Cyrillic labels. It is a distinct complete task.
- Task 33 retains the red/blue/white horizontal-strip question and its
  second-line ending "三色旗？". It has no inserted answer or subpart.
- Task 34 retains the printed condition n>m and its visible first subpart
  а), (m+3)!/m!=(m+1)(m+2)(m+3), ending with a semicolon. It is a separate
  open exercise, not falsely closed or merged into task 33.
- Printed folio 17 agrees. The handwritten color-like sequences are not
  transcribed as printed tasks or answers.

The observed p23-to-p24 calculation continuation is confirmed. The p23 opening
and p24 task-34 open ending are consistent with the frozen page boundaries.
Candidate notes naming p22 or an existing p25 do not independently verify those
unread pages; no unseen continuation content is approved here.

## Retained count status and limits

Native count results supplied by the caller remain unchanged:

- p23 = 26/26 PASS.
- p24 = 25/24 FAIL.

The p24 mismatch remains a retained failure outside this text disposition.
It is neither source approval nor a reason to change prose, override a count,
or exclude ink. Machine geometry is not diagnosed here.

Disposition: physical23 candidate text PASS; physical24 candidate text PASS
against the frozen observations. No new printed SOURCE HOLD or actual text
error was identified. This is not full N4 completion and does not clear the
native p24 count FAIL or authorize downstream stages.

Image usage for this comparison: 0 new opens, crops, reopens, or decodes.
Cumulative independent-review image usage remains 2 original opens, one per page.
No native commands, exercise solving, browser/network/paid calls, candidate
edits, source edits, or additional evidence packages were performed.
