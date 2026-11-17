# First Adapt Finalize

Actual command selected n91+n92; exit 2.
n91 passed (9/10 rewritten prose, 0/5 rewritten exercises, no figures).
n92 failed only on prose[7]: adding a non-formula numeric 2 was not declared;
want=['5','4','7'], got=['5','4','2','7'].

Repair: use "整理后得到" without the added numeric literal; mathematical
formula, source snapshot and all other prose are unchanged. Update the matching
adjacent-text boundary. Retry only n92, not the already-passed n91.

First n92-only retry exited 2: the later boundary used the same changed paragraph
as its `before` text and still contained the old added numeric phrase. Repaired
that boundary text only; no prose/formula/source changes in this second repair.
