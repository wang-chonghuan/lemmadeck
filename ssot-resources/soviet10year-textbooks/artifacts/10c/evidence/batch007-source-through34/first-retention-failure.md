# Initial Evidence-Copy Failure

2026-11-16. Observed command:
`node .intentfold/tickets/STEMROBIN-184/tmp/retain-source-10c-through34.mjs`
exited1, before copying the first input. This note transcribes the actual
terminal observation; it is not a newly executed result.

Node v24.16.0 reported `ENOENT` in `fs.copyFileSync` at script line40,
called from line45. The existing input was
`.intentfold/tickets/STEMROBIN-184/tmp/source-10c-p19-p22-author.md`;
the missing parent of the destination was
`ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch007-source-through34/ticket/`.

The script had created only the evidence root. No input bytes were copied,
changed or removed. The exact initial script is retained beside this note
as `retain-source-10c-through34.first-failed.mjs`. The bounded continuation
adds parent-directory creation in the file-copy branch and resumes from
this empty-input checkpoint; no source/figure/choice validation is rerun.
