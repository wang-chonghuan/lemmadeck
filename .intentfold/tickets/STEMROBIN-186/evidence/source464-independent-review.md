# Source464 Independent Review

Scope: original C only, source page 0464 (printed 453), rows 22-31 including footer. Independent pixel read recorded before opening candidate text; no answer, prior review conclusions, or parent correction read. One image batch, 3 images total (full source + existing middle/lower source crops); no images forwarded.

## Independent Expected Rows

Line wraps follow the scan; spaces between words/numerals are normalized. This is source transcription, not an exercise solution.

```text
22: 155. 第151题里所说房间中的空气是靠了砖砌的火炕升温的。若
23: 火炕的质量为800千克，问由于空气的升温，火炕的温度将降低多少
24: 度？
25: 156. 水桶中盛有5升温度为9°C的冷水。要得到30°C的温水，
26: 需向桶中倒入多少沸水？
27: 157. 钢质钻头工作时温度升高了100°C。若钻头的质量为90克，
28: 那么在它冷却到原来温度的过程中，它共放出多少热量？它工作时内
29: 能增加，然后内能又减少，都是通过什么途径实现的？
30: 158. 磨床对一钢质零件加工时所做的机械功为575千焦耳。这功
31: • 453 •
```

Continuation boundaries: exercise 158 is unfinished on this page; its visible tail is exactly `这功`. The page-top text also starts mid-exercise without a visible number. No adjacent page inspected: that incoming exercise's identity/owner, outgoing continuation text, and downstream lesson owner remain unverified. Footer 453 is page metadata, not exercise prose.

## Candidate Comparison

Result: **FAIL, three lexical substitutions required in each candidate**. Printed-row numbering is the flattened JSON `blocks[].lines[]`, not Markdown physical lines.

- Row 22: `砖砌的火炉升温的` -> `砖砌的火炕升温的` (one `炉` -> `炕`).
- Row 23: `火炉的质量为` -> `火炕的质量为`; `火炉的温度将降低多少` -> `火炕的温度将降低多少` (two `炉` -> `炕`).
- Locations: `page.md` physical lines 79-80; `page.json` exercise label `"155"`, `lines[0]` and `lines[1]`. These candidates agree with each other but disagree with source pixels.
- Fully source-reviewed rows 22-31; this task newly independently reviews rows 23-31. Row 23 fails only at those two nouns; its remaining wording, 800, unit and punctuation match. Rows 24-31 match locally, including 5 L / 9°C / 30°C, 100°C / 90 g, 575 kilojoules, the split `内` + `能`, open exercise 158, and footer.
- Rows 1-21 were visible as context but are **not certified** by this bounded review. No scientific repair, continuation completion, lesson-ownership assignment, or publish approval is implied.

Only this evidence note and `SHA256SUMS` were written, under the requested repair output directory. Original inputs remained read-only; no DB/env access, workers, browser, production command, or re-render. All five input hashes were unchanged on a post-comparison check.

## Evidence

All input paths below are relative to read-only original C `/Users/yong/.codex/worktrees/0f12/lemmadeck`.

| Input | SHA-256 |
| --- | --- |
| `.tmp/ld-s10y-lesson/b81-source464/work/7p/pages/0464/page.png` | `ac8b699e583533b5b74fc12590ba814295780de190f0e5f9596f1911ba273e07` |
| `.intentfold/tickets/STEMROBIN-180/tmp/b81-source464-first-review/original-middle.png` | `d04122ef53ebd49fa479eab56188c5fb9a326cf9c084afd1363616284f740cdb` |
| `.intentfold/tickets/STEMROBIN-180/tmp/b81-source464-first-review/original-lower.png` | `92829d8e7ec9396c8ca569991d6054cb9e0e583eaf4c300afb751346f8c15444` |
| `.tmp/ld-s10y-lesson/b81-source464/artifacts/7p/pages/0464/page.md` | `f43573caaf10081b443eb076114c1a9e0958fbdfdae84d801aeda2f7fdec3181` |
| `.tmp/ld-s10y-lesson/b81-source464/artifacts/7p/pages/0464/page.json` | `74824a3421fb3ec1090ce73f40adf32a2b291e453c8ec0ac60d1d03af3bdc99a` |
