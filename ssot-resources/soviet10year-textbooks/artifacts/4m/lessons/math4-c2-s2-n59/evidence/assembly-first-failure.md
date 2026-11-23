# N59 first scoped assembly failure

- Date: 2026-11-23.
- Cwd: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187`.
- Command: `.claude/skills/ld-s10y-lesson/.venv/bin/python .tmp/stemrobin-187/n59/assemble.py --exercise-first 976 --exercise-last 1008 --figure 220:fig-223`.
- Actual exit status: 1.
- Input pages: 216 through 221. The existing assembler emitted N59 with 33 exercises and one figure, but its authoritative cross-reference check failed on the preceding lesson's boundary table.
- Actual error: `tbl-p0216-01 指定给第 974 题，但本小节没有这道题`.
- The reported open block was `p0221#10`, the unfinished N60 boundary, not an incomplete N59 exercise.

Recovery is input-scope only: add existing completed page 215 as a read-only boundary so exercise 974 and its table can resolve. No source page, N58 lesson, figure, review, or modern content is changed. Only N59 outputs will be retained. This first failure is not source disapproval and is not rewritten as a pass.
