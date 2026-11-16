# Figure221 Author Handoff

Status: **BLOCKED**, author Feynman, mechanical-inclusive repair **1/1 exhausted**.
This is an author failure handoff, not independent approval or permission to promote.

## Authority And Inventory

The original durable fig221 PNG was actually opened in full before drafting.
The complete approved n87 upper text and all three prompts were read; context
SHA `392cea52840e9e193c43137fbf7ed2a4dede11c9b1a08aa3917b151fb1acce9c`,
Sagan text-review handoff SHA
`ef2f9b5477483ca3266bc95476ecfdfe1fd0e79a81a0a57e093c928ce9ef59fd`.
Source PNG SHA
`0f98df888e991073452bf7d96d75bbb0f7e2eb25722c15e1db835a29c2a128cf`.

Source-first inventory covers the full building/roof/two floors/basement,
boiler1, rising main2, expansion tank3, two headers4, two downpipes5,
eight radiators6 and return legs/mains7. Repeated source labels are retained.
No pump, flow arrow, calibration, numerical measurement or new exchanger
number was added. Radiator6 is the heat-exchanging component.

Route is hybrid: one genuinely generated natural apparatus plate supplies
boiler/radiator/tank sprites; deterministic geometry owns all pipes, functional
ports, building structure and English labels. Mirroring/reusing the radiator
eight times and alpha/crop derivations are explicit in artwork-derivation.json.
141 objects, 51 executable assertions, 15 inventory groups, 10 images,
26 labels. The source inventory is not a claim of independently approved
output fidelity.

## Actual Failures

First explicit canonical validator exited 2: source.authoritativeText was
incorrectly a string rather than a nonempty array of objects containing text.
The full first rejected snapshot remains in failure-01; manifest SHA
`27043aaee134426fbe6ba444e7e053d507b7be6330cc88e8be8601e6fc7883f3`.
Rejected spec SHA
`968ac19ddac3ba5dbae8bcef109cbbe1162b631f20eb7a8b9ca3fcc107376b6e`.

The sole repair only wrapped the identical approved text in [{lesson,text}].
The inverse comparison recorded in repair-01/repair-report.json proves that
objects, geometry, assertions, source text and assets were unchanged.
Repair validator exited 0. The subsequent sole renderer invocation exited 2:

| Label ID | Collision Score |
|---|---:|
| down-5-left-upper-label-label | 10000 |
| down-5-right-upper-label-label | 10000 |
| radiator-6-upper-left-outer-label-label | 10000 |
| radiator-6-upper-left-inner-label-label | 10000 |
| radiator-6-upper-right-inner-label-label | 10000 |
| radiator-6-upper-right-outer-label-label | 10000 |
| boiler-1-label-label | 255.999755859375 |

The renderer reports these as necessary collisions; the output is rejected.
No additional repair, regeneration, render or preview is allowed.
All rejected repair bytes remain in failed-repair-01, manifest SHA
`b0f9399e820691a071f58de24905b99d20dbd7a3b8583a83ec4bb347a939953e`.
No root failure history was overwritten.

## Outputs And Evidence Limits

Active rejected spec: repair-01/fig-221.spec.json,
SHA `0b35c75ed1b3ee7f1f7bd413ce1975da4a5dd5d8047a303376a2e89691c8c6f8`.
Produced SVG: repair-01/fig-221.svg,
SHA `ad8f22e5afe669ce0104dfd843b4f021f49fb7751d0a0c41224c8f1e069868db`.
Artwork layer: repair-01/fig-221.artwork.png,
SHA `1f1df89cf62709e15c113d4efeb737cb9576d8dbfe384337a26103e1120550db`.

Renderer width checks measured minimum labels 17.2125px at306 and 36px at640;
all ten image-fit checks passed. These partial checks do not override the
collision failure. Native six-theme-width previews: **0 executed, 0 observed**,
withheld after the sole-repair render failed. No native, theme, edge or complete
composite visual approval is claimed.

## Actual Calls

The eight recorded stages and their exact command arrays, exits, input copies,
stdout/stderr and before/after tool epochs are preserved in calls/*/record.json:
context0, generation0, background0, sprites0, spec0, validate2,
repair-validate0, repair-render2. Additional init and repair-binding each ran
once successfully outside that runner; Azure account inspection ran once.
There were two explicit validator CLI invocations plus the renderer's internal
validation, one renderer invocation, zero native preview invocations, and no
source/text gate, independent record, promotion, product, DB or Git operation.
Current tool bytes and historical call epochs are distinct manifest entries;
no historical checksum is claimed to describe a later file without comparison.

Actual Azure image-edit HTTP requests: **1**, retries: **0**, response images:1.
Prompt4320 characters, preflight limit32000; conservative planned allowance
USD2.35 per job, below the authorized USD5 cap. This is not an invoice.
Actual response usage: input2389 (text1973, image416), output1372 image tokens,
total3761. Actual billed USD is **unknown/null**.
Original artwork SHA
`f78e19376511467d6469f1ffed5831e5144664ec39fc92880a2e42d541f978f2`;
generation metadata SHA
`ac0f45da01455d3dc8daa4ae66ea0f959e2c6f69dc216c737baaaa2544c41d39`.
Generation was unchanged during the sole binding repair.

The renderer used task-owned isolated headless network-off contexts and closes
its browser in finally. No browser or command session remains active.
Both first and failed-repair snapshots, all source/context/generation/output
bytes, exact calls and this report are bound by author-manifest.json and
author-handoff.json. Work stops at BLOCKED; no selfapproval or promotion.
