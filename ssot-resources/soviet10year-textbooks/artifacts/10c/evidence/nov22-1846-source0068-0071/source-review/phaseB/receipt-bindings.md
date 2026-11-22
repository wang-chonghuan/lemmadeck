# Exact release and first-native receipt bindings

All paths are aliases below R = `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck`.
W = `R/.tmp/stemrobin-184-six/source10c5255-work`.
C(N) = `W/artifacts/10c/pages/N`.
E(N) = `W/receipts/nov22-finalize-pN-01`.
A = `R/.tmp/stemrobin-184-six/source10c6871-review/phaseA`.

Only released TEXT files were read. Hashes below were computed from those text bytes; no image/PDF/crop/trace/runtime/tool bytes were read. Author optional `evidence.json` was not opened.

## Prior immutable text and author binding

| Text file | Actual SHA256 | Actual mode / release check |
| --- | --- | --- |
| `A/seal.md` | `ae8f6a7217424ae1bb1bfe6953b180315567ffea57edd7c87f9ddf214213bb70` | 0444; matches intaken seal |
| `A/p0068.freeze.md` | `1b189c3846604159a5df3cb1d32440a9a853b0ac40fe8dd1dc172c32fc74402b` | 0444; unchanged |
| `A/p0069.freeze.md` | `e7b0af2949b608d3a761c0710d12e2ae154c041ae38d9ba18c70fd0ae9fc9b55` | 0444; unchanged |
| `A/p0070.freeze.md` | `7c9a5e53a24e080602421f8b9787b0a8f8760ee5a05ef31889b7849739734874` | 0444; unchanged |
| `A/p0071.freeze.md` | `718a2b3bf7b94053b783c3b0c91ed0b4e2bd2f4b0d4ea9012c0348db5773bdaa` | 0444; unchanged |
| `R/.tmp/stemrobin-184-six/source10c6871-author/handoff.md` | `edcf1128ae3ca62a6c9aabb24021b6653b95f8a7293054e4fe0a2f794a6d4d73` | matches named author release; read only after PhaseB release |

## Current text files and output snapshots

| Page | `C(N)/page.md` = `E(N)/output-page.md` SHA256 | `C(N)/page.json` = output-page.json SHA256 | `C(N)/audit.json` = output-audit.json SHA256 |
| --- | --- | --- | --- |
| 0068 | `f77c878b26ff7d9a7e38731ae94e78d948f96a7ef46f27ac5614ca49f37771fb` | `3eba7552e57ad95e4b42f10cef562054530b164c816c5145bc4bce80b0677192` | `c7706de8561ceb21511820350ea154899c53fedb30a9286ce12c32fa9e655d21` |
| 0069 | `e1285d834d89d36f957cc0503156630afd8934e2d9c1b65b2bac50e25b7ef774` | `4957cebbe8b5492f0b0f8412f09051055c685f8b8a70336f588bad612d4875f0` | `cfccd95b8cca42e81515899d11ab205ea1e3ae58eb233292cf4d340ce74a9fcf` |
| 0070 | `5b4d0548115c56c228daccf33ae02fd968b0c07e99b95e12d35c7f3d32b39dd3` | `bc8216d3d4aaf209e5fe4313a5306a4ab1aa0f16a9db2b0c5940d5a1b94d1bce` | `46eb6a9f393b9bd9c40b91c72059cd7402605aad2ba26575ba0d103113720387` |
| 0071 | `85f27b4e7a01403d3f0da0e55dc99c624db34eb5e1a9c9a6f38284b91ac619f1` | `7e170eeb44a8d1d2ffb6f1c4de51875af51200772f3494507beca0f290d239fb` | `d4107036cf405c5e4ffa01b4d9efb6cac4e57ff3b2e7f24b8cfb7acfba18dd9f` |

All four current MDs matched the exact parent release hashes. JSON/audit/receipt hashes matched the named author table. Each output snapshot's actual hash and byte length matched its recorded receipt and current counterpart. Current MD/JSON block text and flags were compared; no projection omission apart from the already authored findings was found.

## Actual execution facts, not native reruns

All four recorded cwd values are exact R. Exact argv was checked: existing skill Python, `p2c.py finalize --book 10c --page N --root .tmp/stemrobin-184-six/source10c5255-work/artifacts --books ssot-resources/soviet10year-textbooks/sources --work .tmp/stemrobin-184-six/source10c5255-work`.

| Page | `E(N)/execution.json` SHA256 | Actual start/end UTC, 2026-11-22 | Recorded exit | Saved audit print/body; stdout result |
| --- | --- | --- | ---: | --- |
| 0068 | `89eab45c83e7af7aa60fa27ec0ab8a3747c54614148f8ea47cd1f9f14f4f3489` | 05:22:58.253175 / 05:22:59.187262 | 0 | 12/12; native gates passed |
| 0069 | `180b42361bad1d5f8c6173af2cde2cf9144a1f6d8e17db5024c9bc82af7d3441` | 05:23:30.679212 / 05:23:31.567967 | 0 | 23/23; native gates passed |
| 0070 | `23ecaa203e9aea9f991ae80ed44fcda0fd652831bd0ebb9d6bc7004445fc38a1` | 05:24:05.883880 / 05:24:06.755033 | 1 | 26/25; FAIL, original line-gate error retained |
| 0071 | `d938218b5c0088e6bc12120efc8fb555aa197e8fb9fd5acb86a2f2a240016cb0` | 05:24:57.676193 / 05:24:58.436647 | 0 | 22/22; native gates passed |

These are historical first-native facts, not PhaseB command failures or independent content approval. 0070 full saved error:
`行数对不上：印刷 26 行，块体 25 行（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）`.
No rerun, diagnostic, line-padding, counter, override or exclusion application was executed.

## Input and stream bindings

Each actual file was checked against its receipt `path`, `bytes` and `sha256`; every path was within the exact E(N), no alias/out-of-scope path was followed.

| Page | `input-page.md` SHA256 (bytes) | `stdout.txt` SHA256 (bytes) | `stderr.txt` SHA256 (bytes) |
| --- | --- | --- | --- |
| 0068 | `9b97f13d21f2b91116c4c539f0c8e38d088d1c82432fff6624ab7f81b1579706` (1882) | `ac14feb74f5cc546e35151eef3b7ad8c9471bd978b3fcf6cebadc6b7ee721d7a` (220) | `2c505e8e5c186947b596111ce2c660e4804800bf997c90412d11c13c4333a5bb` (475) |
| 0069 | `873d40158fa060b46cde7a5f64a34c3c8a1d32c9c49fc8b463da36d0ccf3df4a` (2427) | `22f82b99d1c9013e85e31ed2dec100b8acd473584f9073f71f6a9a9038093de9` (130) | `d3d1bae1b6a1205821a4240170922b5cd90c5829d11176888ab4a1401c1c8594` (475) |
| 0070 | `1c99bbf76c0e7456be8b929fb4eab876568a4770c5449f6ae2a5843c7fedf1d9` (2435) | `9100beec3185342ec07a3595d89d9eabc8e4090b8703b696feaf270451db23a9` (267) | `af134f3e8c4b0fc8884fc0e8c6a7343a2eb225dd35245a102260299336d86f8a` (475) |
| 0071 | `fd4e67316ad459c155850eb7d9dae556b91bd9d6ad1c7e5168e261e2f239adb1` (3035) | `b1ce9c53e048afcda72408fcacc0a60231d1a87a4c2d58a9828c836274790735` (131) | `0b44bdc36501772eadbbbd6a70c6ecdd00c52446aefb14fbf8d5bcc6c4b5db6b` (475) |

Current/output MD bytes are 2316,2529,2703,3137; JSON bytes 3881,4371,5286,6851; audit bytes 892,203,561,203. Receipt JSON bytes 3052,3051,3051,3051 in page order.

Raw input/output MD hashes differ because native metadata and figure declarations/links change. A separate TEXTONLY literal-payload comparison, excluding JSON frontmatter/comment headers/generated image links, confirmed identical prose/formula/caption/footer text in every input/output pair. Native rough-to-snapped figure declarations and generated links are recorded structural changes, not source-word correction.

All four stderr files actually contain ignored `_removeHandlerRef` logging-shutdown exceptions routed through existing instrumentation `sitecustomize.py:18 profile`, ending `AttributeError: 'NoneType' object has no attribute 'startswith'`. Instrumentation/trace files were not read or repaired. Successful recorded exits remain 0 on 68/69/71; 70 remains 1. Coverage outside the saved text receipts is UNKNOWN.
