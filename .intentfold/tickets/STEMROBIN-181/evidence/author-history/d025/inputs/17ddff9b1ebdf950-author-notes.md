# n105 Prose Author Notes

Role: PROSE AUTHOR ONLY. STEMROBIN-181; D027 author work for the explicitly authorized D025 replacement of blocked n102. Date: 2026-11-16.

## Reader And Question

Reader: the charter's eight-year-old independent learner, reading the existing source-complete n105 after gas discharge.

Job story: when encountering ionized gas, I want to understand why it can contain charged particles yet remain nearly neutral overall, so I can connect the same idea to lamps, metals, stars and fusion.

Question: what is plasma, and where does this idea apply?

The source's nine-block flow is binding. Short paragraphs explain the original concepts without replacing the scientific structure with a summary. No solved examples, questions, exercises or new figures are authored.

## Source Authority And Coverage

Authority is the current source lesson, its complete Markdown, its zero-count exercises object, its page-block references, and the already saved native assembly receipt:

- `ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/phy9-c2-s4-n105/{lesson.json,lesson.md,exercises.json}`.
- `.intentfold/tickets/STEMROBIN-181/tmp/d026-source260-263-finalization/assemble.json`: exitCode 0; n105 has nine prose blocks, zero exercises and zero figures.
- The existing effective source reviews and finalization receipts for pages 256-259 and 260-263 are inherited at their exact hashes, not reviewed or executed again.

n105 itself uses physical pages 260-262, printed pages 251-253. It begins at `p0260#6` ("105. 等离子区") and ends before `p0262#3` ("106. 真空中的电流"). Source blocks `p0260#8 + p0261#1` and `p0261#7 + p0262#1` have already closed across pages. The current book's unrelated open-tail warnings are retained, not repaired and not reclassified.

| Source block | Original refs | Retained scientific coverage |
| --- | --- | --- |
| 0 | p0260#7 | Charge balance, overall neutrality, electron/positive-ion two-component case, neutral atoms and partial ionization. |
| 1 | p0260#8; p0261#1 | Cathode-region excess positive charge versus the nearly neutral positive column; discharge plasma. |
| 2 | p0261#2 | Neon and fluorescent tubes, radiation, wall phosphors and near-white light. |
| 3 | p0261#3 | Gas lasers as an application, distinctive radiation and a source-relative pointer to later optics. |
| 4 | p0261#4 | Liquid/solid metals, mobile electrons, positive lattice constituents, vibrations, the original density range/unit and quantum description. |
| 5 | p0261#5 | Ionization in stars including the Sun through heat and other ionizing influences. |
| 6 | p0261#6 | Sparse interstellar charged particles, electrons and ions including bare nuclei, and the contrast with stellar plasma. |
| 7 | p0261#7; p0262#1 | Stellar energy supply and thermonuclear fusion. |
| 8 | p0262#2 | Controlled fusion on Earth and its energy promise, with an explicit engineering limitation. |

`source-coverage.json` derives source membership by reading the current bound native page objects; it does not execute assembly. The source lesson's `figures` array is empty and the source prose has no numbered figure references. The exercises array is empty. Figure 204 precedes the n105 heading on page 260 and belongs to the preceding lightning prose. Page 262's figure 202 reference belongs to n106, after the next heading. Neither is borrowed. No original figure PNG is required for n105, so no image is opened, generated or requested and no English figure-context package is created.

## Author Corrections

These are proposed edition prose corrections, not source edits, registered mathematical errata or SCI decisions. All original `source_text`, `source.data`, `source_refs`, block identity/order, displayed density formula tokens and units remain intact. `numeric_changes` stays empty.

### Terminology And Neutrality

Use the current Chinese term "等离子体" in the modern title and prose; keep "等离子区" in the original printed title and source snapshots. "阳电辉区" is introduced as the original name for the positive column, "正柱区". Partial ionization becomes "部分电离", with neutral particles still present.

Overall neutrality is explained as approximate charge balance over a sufficiently large region, not exact equality at every point. The original cathode-region/positive-column contrast is kept. The source itself distinguishes a region with net positive charge from overall neutrality, so its definition must not be read as a claim of exact pointwise equality. A brief explanation of mutual electrical influence supplies the physical reason this is not just a list of independent particles. These are author terminology/clarity proposals, not a new review.

### Gas Laser Power

Original claim at `p0261#3`: gas lasers are the highest-power light sources. Replace the universal ranking with a description of gas-discharge excitation, concentrated laser radiation, and dependence of power on the device.

Author rationale: a gas gain medium identifies how a laser is made, not an absolute power ranking across all lasers or all light sources. Power also depends on the particular apparatus and operating conditions; the source supplies no comparison or restriction that could justify its unrestricted superlative. The source's laser application, special radiation and later-optics pointer remain; no replacement power value, named facility, record claim or new comparison exercise is introduced.

### Solid Metal Model

Original claim at `p0261#4`: all liquid and solid metals may be considered plasma, with all charged-particle motion described only by quantum mechanics. Keep metals and the electron/positive-constituent comparison but identify an electron-plasma model used for collective electronic motion, not an assertion that a solid metal is an ionized gas.

Explain "离子实" as the positive atomic remainder after accounting for conduction electrons. In the ideal crystalline solid, these occupy lattice positions and usually vibrate nearby; the electrons can move through the metal. Retain the contrast with liquids and gas-discharge plasma. Qualify the original absolute immobility as the usual lattice model, not a denial of every diffusion process. Quantum mechanics is needed for an accurate treatment of dense conduction electrons, not because every small lattice vibration must always be treated only quantum mechanically.

The original `$10^{22}\sim10^{23}$` and `厘米$^{-3}$` are preserved exactly, with a plain-language explanation of number density. No numerical conversion, added formula, or density update is made.

Author rationale: the source immediately distinguishes lattice-bound positive constituents from a gas and a liquid, so its opening "can be considered" should be presented as a model with that limitation, not a reclassification of the material's state. Its density and quantum points remain, but the quantum statement is scoped to the dense mobile electrons rather than used to deny every classical description of lattice motion.

### Interstellar Temperature

Original claim at `p0261#6`: interstellar plasma has a very low temperature. Keep the sparse interstellar medium and charged-particle coverage, but distinguish its ionized component from all interstellar matter and state that temperature varies by region; low density does not imply low temperature.

Author rationale: density counts particles per volume, whereas temperature concerns their motion/energy; sparsity by itself cannot establish coldness. Interstellar ionized regions do not all share one temperature. The draft retains both warm and hot possibilities rather than the source's universal cold assertion. No numerical temperature or named observational result is added. The temperature comparison remains an explicit concept in the same source-relative position.

### Stellar Fusion And Energy Outlook

Original claim at `p0262#2`: solving controlled thermonuclear fusion gives an effectively inexhaustible energy source. Preserve the promise of substantial future energy, but do not state that research has already yielded a practical, unlimited energy supply or promise a deployment date.

Explain the original thermonuclear energy source through fusion of light nuclei, scoped to a star such as the Sun. On Earth, distinguish causing/controlling fusion from a practical power system: sustained operation, fuel supply, materials and overall energy use must all be addressed.

Author rationale: obtaining energy from an individual nuclear reaction is not the same as sustained useful net energy from a complete apparatus. The source's research outlook therefore remains conditional. Fuel, operation, materials and the system's energy balance are constraints on that inference, not new exercises or a promise of completion. No facility result, latest record, timetable, fuel abundance number or commercial-status claim is introduced.

## Evidence Limit For Corrections

The corrections above are explicitly requested author proposals. They do not acquire SCI approval from the source's approved transcription or from this author's hash checks. Public primary-source search was attempted without opening a browser, but the available search tool returned no usable response. No outside document is claimed to have been retrieved or read, and no unverified URL or institutional attribution is recorded as evidence. A subsequent independent science reviewer must judge the proposed modern statements; that review is outside this role.

## Layout And Ownership

Every source prose block is kept in position. Within it, complete sentences occupy separate lines and two or three closely related sentences form short paragraphs. Bold labels remain attached to the relevant concept. The four conceptual dividers are selected from the native `prose_flow.mjs` output by adjacent paragraph text: applications, metals, celestial plasma and terrestrial controlled fusion. No integer indices are authored in `section_breaks`.

The only native adaptation preparation is recorded in `adapt-prepare.receipt.json`. It uses a fresh `native-prepare-work` below this author directory because the native tool unconditionally emits `book.template.json`. That new isolated draft is kept as preparation evidence; no existing source, edition or shared scratch index is rewritten. The three lesson templates are copied once into the authorized canonical directory. Only `lesson.template.json` is manually edited; the empty exercises and figures templates remain byte-identical to preparation.

The final author freeze binds the original lesson/Markdown/exercises, pages 256-263 and their existing completion evidence, the three edition templates, all author-owned changed files and the native paragraph-boundary evidence. A read-only hash comparison checks preservation; it is not an app test or a scientific review.

During the first freeze attempt, the shared modern `book.json` changed from its baseline hash. Read-only comparison with the isolated preparation's existing-lessons snapshot showed the addition of `phy9-c2-s4-n101`, no removed or changed existing entries, and no n105 entry before or after. This concurrent work is preserved. `freeze-attempt-1.json` records the interrupted author-only hash check; no final prose-flow invocation or freeze had happened at that point. The final freeze records the shared index's baseline and observed hashes without claiming that it stayed byte-identical, while retaining strict equality for n105 source inputs and page/completion evidence.

## Status Limit

AUTHORED DRAFT ONLY. No SOURCE replay, counter, native page finalize, science review, browser, Git, DB, app/build/test, figure authoring, adaptation finalize/render, durable promotion or production operation is performed. No SCI, figure, display or complete-card approval is claimed.
