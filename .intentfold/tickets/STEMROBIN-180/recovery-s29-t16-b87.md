# B87 S29/T16 Technical Recovery

2026-11-19. Same cap3 invocation180-3. Recovery only; stopped after this report.
Scope: phy6-c3-s29, phy7-c1-s1-t16, old figure83/227 evidence. Parent owns n51.
B86 commit supplied by the human was not rechecked. Existing TEXT PASS is reused
from the four unchanged author/review reports; no semantic review or author rerun.

## Authoritative Recovered Paths

All destinations below are new recovery outputs, not the original author roots.
Original directory structure, including t16 double-adapt, is preserved.

- S29 templates: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b87-s29-t16-recovery/recovered/.tmp/ld-s10y-lesson/text-author-c3-s29/adapt/6p/modern-us-neutral/lessons/phy6-c3-s29/`
- T16 templates: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b87-s29-t16-recovery/recovered/.tmp/ld-s10y-lesson/text-author-7p-t16/adapt/adapt/7p/modern-us-neutral/lessons/phy7-c1-s1-t16/`
- Figure83: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b87-s29-t16-recovery/recovered/.tmp/s10y-image/6p/fig-83/`
- Figure227 handoff: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b87-s29-t16-recovery/recovered/.tmp/s10y-image/7p/fig-227-author/author-handoff.json`
- Genuine failure captures: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b87-s29-t16-recovery/genuine-historical-receipts/`

## Six Templates

| Directory / File | Bytes | SHA-256 |
| --- | ---: | --- |
| S29 / lesson.template.json | 12155 | `14863231e07755d6d705c36dff7912016d307c380a983b71543e94ed49337e4f` |
| S29 / exercises.template.json | 410 | `51e330931746ee77f740c6de09b700c9fc797f1cb2ffa100e04768059f76ddbd` |
| S29 / figures.template.json | 638 | `20c6685751f53d9ec2e1badda5e0f0d6dead31f57a7164c01e8ac6dc6373a0eb` |
| T16 / lesson.template.json | 25464 | `c9423737dc5e87bb32d78b2a9ea2395ae502be446b28588512a95a6e1df15765` |
| T16 / exercises.template.json | 419 | `c813dcaa6ff4806a4a560f4958495422d3afec50dda2142ba2a2cfb94845bd80` |
| T16 / figures.template.json | 1137 | `6e3a75f97e44c5ca7dd13a58ffede737154e9fff40dda1e367ff7ac91b6339e3` |

All five human-pinned hashes match exactly. The sixth, S29 figures template,
is the complete captured original prepared template, not a newly authored spec.
Its SHA above is computed from recovered bytes; an independently recorded
historical SHA was absent from the existing author/review reports and remains UNKNOWN.
S29: 8 blocks, 1 referenced figure, 0 exercises. T16: 18 blocks, 2 referenced
figures, 0 exercises. These are structural counts, not new acceptance decisions.

## Actually Recovered Figure Evidence

Figure83 files below are under the Figure83 directory above. Historical hashes
bind the recovered spec, reports, inventory and FIRST failure files.

| File | Bytes | SHA-256 / Historical Status |
| --- | ---: | --- |
| spec.json | 28324 | `592809874b68ced5500cee5ef891f585d29b102d5d9226dfb950b5b93727060b` |
| fig-83.render.json | 1384 | `878f59539a178c89115656f1f4bf803e3cad2826dfc7fb858d348fde5bc01773`; FAIL |
| source-inventory.md | 3646 | `b8700e993825f38f9f3fda382dd71e42f5d567dfa2edf862e41670e1a866bae8` |
| author-report.md | 4486 | `07b6e4d2f28aba2e7220767984538c2e9be02a8ba00b096190adbf69e47bbdef`; BLOCKED |
| failure-01-label-clearance/fig-83.render.json | 1397 | `524cf4abfccf9712e22de171160ee1b4b629b14fc977c75f4c7efb7b38c1fbd1`; FIRST FAIL |
| failure-01-label-clearance/failure-report.md | 1290 | `7073fa4724cfca7fc7707c0f4ac1f2ab25c2f333e1e4976fd46c63356a88407e` |

The FIRST render failed label/canvas clearance; collision scores were
1968.75 / 2033.349609375 / 1968.75. The final historical render remains FAIL
with three score10000 label/vessel-bottom collisions. No reinterpretation or repair.

Figure227 evidence actually recovered:

| Destination File | Bytes | SHA-256 / Historical Status |
| --- | ---: | --- |
| Figure227 author-handoff.json | 5218 | `99b0976d4b8ac0c1c9afc8c696587840ad7075ea364427b11f18abc23a53dce2`; BLOCKED |
| Genuine failures / fig-227-FIRST-generation.execution.json | 2242 | `2f95f05ff24d54600df32fd09cafb960e6e0988c762070cb6cf33bf9ec3f2af8`; FIRST local spawn ENOENT |
| Genuine failures / fig-227-author-mechanics-FIRST.stdout | 84 | `5f176cde61c2da875f7fbe1c2f4a749e3901c9d51ea3a1707d528101d00db233`; FAIL |

The original generation JSON retains intended imageRequestAttempts1. The
existing author report/handoff records actual requests0 for that ENOENT;
neither record was rewritten. Genuine mechanics stdout records checks25,
outsideFunnelPixels0 and erasedGreenPixels35. It is not the missing full
author-mechanics JSON. Historical render PASS is reported by the unchanged
author report, but its exact render file was NOT recovered.

The old t16 TEXT binding-preflight failure was also recovered, 890 bytes/SHA
`c39ff28c33079f1a6674fac1e4a1ca8d380f00b1eed5ad97e044acd5b31dce51`,
under the recovered t16 author root's `FIRST-fail/text-mechanics-preflight/failure.json`.
Existing repair counts are historical; this assignment performed no repair.

## Missing Bytes: FIRST UNKNOWN

These are original paths, not available recovered artifacts.

| Original Figure Root / File | Historical Bytes / SHA-256 | Recovery Status |
| --- | --- | --- |
| `.tmp/s10y-image/6p/fig-83/failure-01-label-clearance/spec.json` | 28324 / `e77fb6a88290316e205182e57546030668622cdec648c5ee581e62e54c0a7500` | FIRST UNKNOWN |
| `.tmp/s10y-image/6p/fig-83/fig-83.svg` | 74676 / `861c03c3066f33ef7bcfbcbc1c3b4d54c77b644f58b35b20e883229fe43c8d28` | FIRST UNKNOWN |
| `.tmp/s10y-image/7p/fig-227-author/spec.json` | 36034 / `c29212de7ee04e57bc61a140f9e9cb4701e5957907485e9337c753e80484a91a` | FIRST UNKNOWN |
| `.tmp/s10y-image/7p/fig-227-author/fig-227.render.json` | 1840 / `ec855887a5a5c4797ea86092995ca551fc46c7c2f4cdd2a7db805812f466fd50` | FIRST UNKNOWN |
| `.tmp/s10y-image/7p/fig-227-author/author-mechanics.json` | 4992 / `22a0506f8d9386e202c8e56e023bc94ff6e209b4fa8143c48f9efd711ad23858` | FIRST UNKNOWN |
| `.tmp/s10y-image/7p/fig-227-author/manifest.json` | 29755 / `de45b1f0561f1ab5f20dd5654bfce271a22d50514ea15f4db421bb4b4ff0106f` | FIRST UNKNOWN |
| `.tmp/s10y-image/7p/fig-227-author/source-first-inventory.json` | bytes/SHA UNKNOWN | FIRST UNKNOWN; captured original script is not the inventory file |
| `.tmp/s10y-image/7p/fig-227-author/artwork-opaque.png` | bytes/SHA UNKNOWN | Paid original artwork missing: UNKNOWN |
| `.tmp/s10y-image/7p/fig-227-author/fig-227.artwork.png` | 26862 / `4e626eb8baa89aeedbc5852c65fcc96c9fe3c32a574afd07ae98b5b2759a86e5` | Derived artwork missing: UNKNOWN |
| `.tmp/s10y-image/7p/fig-227-author/fig-227.svg` | 88473 / `e91853b008aa247196edb080aa58dbf5c0080f704e60d6881ea20d0c629d6ac3` | FIRST UNKNOWN |

Original roots are relative to `/Users/yong/.codex/worktrees/0f12/lemmadeck/`.
No image bytes were recovered or opened; source/preview images and paid-image
metadata also remain unavailable. No old construction command was replayed.

## Counts And Existing Manifests

22 distinct restored files, 117081 bytes, including six templates totaling
40223 bytes. Separately preserved failure captures and literal old script/tool
records are evidence, not additional restored targets or executed scripts.
At the last read-only inventory: scratch51 files/306354 bytes; evidence371
files/2215205 bytes. This report adds exactly one file: total423 files across
the two new output trees and this report. No subsequent expansion or copying.
Actual recovery image files0; image reads0; image payloads0; paid/model/image
requests0; renders0; reviews0; author reruns0; repairs0; pipeline calls0.
Setup/freshness/Git/app/DB/backend/other-chat/descendant calls0. Product
canonical/index/ledger changes0. Existing six reports show no byte drift.

Existing byte/path/provenance manifests, reused without another evidence layer:

- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b87-s29-t16-recovery/recovered-file-bindings.json`
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b87-s29-t16-recovery/template-recovery.json`
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b87-s29-t16-recovery/additional-byte-recovery.json`
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b87-s29-t16-recovery/figure227-genuine-failures.json`
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b87-s29-t16-recovery/FIRST-UNKNOWN-required.json`

All existing outputs were preserved at the stop instruction. No cleanup,
revert, new snapshot/event/script, reseal, generation or further search followed.
Both TEXT PASS decisions survive recovery. Neither figure is newly approved
or repaired, and missing bytes are not substituted by reports or guessed content.
