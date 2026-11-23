import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const repo = "/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-181";
assert.equal(process.cwd(), repo);
const tmp = ".intentfold/tickets/STEMROBIN-181/tmp/";
const artifact = "ssot-resources/soviet10year-textbooks/artifacts/10p/";
const identity = "181-7 independent FIRST ENGLISH and key-blind choice reviewer";
const canonicalize = (value) => Array.isArray(value)
  ? value.map(canonicalize)
  : value && typeof value === "object"
    ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]))
    : value;
const hash = (value) => crypto.createHash("sha256").update(value).digest("hex");
const digest = (value) => hash(JSON.stringify(canonicalize(value)).replace(/[\u007f-\uffff]/g,
  (char) => "\\u" + char.charCodeAt(0).toString(16).padStart(4, "0")));
const load = (relative) => JSON.parse(fs.readFileSync(path.join(repo, relative), "utf8"));
const binding = (relative, inspection) => {
  assert.ok(!/\.(svg|png|jpe?g|webp)$/i.test(relative), "No image bytes may be read");
  const bytes = fs.readFileSync(path.join(repo, relative));
  return { path: path.join(repo, relative), bytes: bytes.length, sha256: hash(bytes), inspection };
};
const textBinding = (pointer, zh, en) => ({
  pointer, chinese_text_sha256: hash(zh), english_text_sha256: hash(en)
});

const assessments = {
  12: {
    own: "d1816-d1997-n12-first-en-review",
    inputs: "d1816-d1974-n12-en-choice-review-inputs",
    author: "d1816-d1966-n12-first-en-author",
    native: "d1816-d1972-n12-first-en-native",
    preparation: "d1816-d1968-n12-preparation",
    figures: ["16", "08"],
    expected: { prose: 7, flow: 14, written: 5, answers: 5, choices: 5, options: 20, single: 4, multiple: 1 },
    prose: {
      0: [
        "Ideal light-spring and small-angle pendulum free motion remains conditionally SHM: neglecting friction alone is not sufficient without the restoring model.",
        "Small resistance still changes energy and amplitude; no zero-resistance or constant-amplitude claim replaces the Chinese qualification."
      ],
      1: [
        "The no-continuing-drive system loses mechanical energy through negative resistive work into internal energy of system and medium. Total energy does not disappear; weak oscillatory damping lowers amplitude.",
        "Underdamped back-and-forth motion remains distinct from nonoscillatory approach under stronger resistance; no universal shrinking-wave representation is asserted.",
        "The source's exhausted-reserve wording remains attributed, with finite exact zero explicitly not guaranteed and linear viscous decay allowed to approach zero asymptotically.",
        "Experimental 'stopped' remains an observational threshold; different friction mechanisms and schematic curves cannot establish one exact stopping time."
      ],
      2: [
        "Figure 16 is a schematic damped displacement-time curve, not an exact period, decay-rate or stopping-time record. Figure 8 is introduced only as the sand-pendulum recording apparatus.",
        "The original-book cardboard-on-string damping method remains attributed; the pre-existing perspective sand trace is not relabeled as an exact damping graph."
      ],
      5: [
        "Ammeter and wattmeter pointers may oscillate near the measured-value equilibrium and need settling time; a suitable damping device reduces the wait.",
        "Excessive damping may slow nonoscillatory approach. The moving metal plate between poles and the particular magnetic-field arrangement remain necessary context for induced currents.",
        "Current-field interaction opposes motion and dissipates pointer mechanical energy into internal energy; a stationary plate alone does not guarantee continuous damping currents."
      ],
      6: [
        "The moving vehicle remains continually road-excited; shock absorbers reduce oscillation without making all motion free or guaranteeing a motionless body. Hydraulic piston/cylinder roles are retained.",
        "Piston-driven liquid flow through oil passages produces resistance and dissipation. 'Stopping quickly' remains ordinary descriptive language, not an exact finite stopping time.",
        "Continuing road disturbances can excite new oscillations; this final qualification survives the English paragraph split."
      ]
    },
    written: [
      "Current prompt retains fixed displacement amplitude, frequency doubling, both amplitude ratios and both increases. The full answer retains omega*A and omega^2*A, ratios 2/4 and increases 1/3; the provenance note says derived standard explanation, not a captured short book answer.",
      "Current prompt retains signed displacement versus distance, side and branch, direction versus magnitude. The complete answer preserves both formulas, approach/departure signs, opposite branch velocities at the same nonturning displacement, and the across-equilibrium nonuniform speed/|a| trends. No unique trend is imposed on the ambiguous source sentence.",
      "Prompt and answer retain same uncompensated clock, warmer summer/colder winter, thermal equilibrium, positive expansion, point bob, negligible rod mass, fixed pivot/g and ignored secondary effects. T=2*pi*sqrt(ell/g), colder contraction and faster winter rate retain the model and compensation limits.",
      "Prompt and answer reject the fixed-spring mass-independence premise. The exact spring and pendulum formulas, fixed k, inverse-square-root mass scaling and fixed ell/g pendulum cancellation remain; false source wording is not endorsed.",
      "Prompt and answer retain matched shape, air, equal-speed drag, equal small initial amplitude, weak damping and relative-amplitude comparison. The full answer preserves force/inertia and approximate matched-amplitude energy reasoning, not permanently identical actual paths, a linear drag law or an exact stopping time."
    ],
    coverage: [
      "Source 1 maps only to n12-frequency-scaling. Both amplitude ratios and both increase ratios remain in one complete response unit. The two declared losses are independent differentiation/result generation and written ratio explanation; no scientific condition is omitted.",
      "Source 2 maps only to n12-signed-branches. The two correct complete judgments cover positive/negative approach/departure, restoring signs and the original ambiguity. Independent ambiguity discovery/counterexample derivation and written branch organization are explicitly lost, not misrepresented as measured abilities.",
      "Source 3 maps only to n12-thermal-clock. Temperature-to-length-to-period-to-relative-clock-rate and compensation scope are retained. Independent derivation and written explanation of thermal/model conditions are the two declared losses; actual seasonal temperature is not silently replaced by calendar identity.",
      "Source 4 maps only to n12-mass-premise. False-premise diagnosis, fixed-k scaling and pendulum cancellation are retained. Independent discovery/equation derivation and full comparative written organization are explicitly lost; no explanation of a false premise is fabricated.",
      "Source 5 maps only to n12-air-damping. Comparable drag, geometry, weak damping, relative decay and scope are retained. Independent resistance/energy argument and written counterexample construction are explicitly lost. No exact decay law, stopping time or universal mass-only ranking is imported."
    ],
    reconciliation: [
      [
        "The author's first-power acceleration error actually yields ratios 2,2 and increases 1,1, matching false a.",
        "The correct rationale uses omega*A and omega^2*A and subtracts one from 2,4, exactly matching true b.",
        "The author's unallowed simultaneous A->2A and omega->2omega yields 4,8 then increases 3,7, exactly matching false c; the independent false-option finding does not depend on this diagnosis.",
        "The author's mistaken fixed velocity amplitude plus a_max=omega*v_max yields 1,2 and increments 0,1, exactly matching false d."
      ],
      [
        "The rationale derives both approach signs and opposite signed-velocity trends from a_x and v_x^2; no signed velocity/magnitude substitution changes true a.",
        "The rationale derives both departure branches and decreasing signed x on the negative side; it matches true b.",
        "Copying positive-side leftward approach to the negative side yields the stated false universal signs and trends. The negative-side departure counterexample remains explicit.",
        "Copying negative-side leftward departure to the positive side yields the stated false universal signs and trends. The positive-side approach counterexample remains explicit."
      ],
      [
        "The rationale identifies removal of the no-compensation condition after an otherwise correct length/period/rate chain; false a really makes that extension.",
        "Mistaking omega's inverse-length relation for T yields shorter summer period and greater summer rate, matching false b.",
        "Mistaking clock rate for proportionality to T after correctly lengthening T yields false c's summer dial advance.",
        "Positive expansion, T proportional to sqrt(l) and inverse-T dial rate support all of true d, with compensation excluded."
      ],
      [
        "Swapping mass-scaled pendulum restoring action and fixed spring stiffness yields both incorrect cancellation claims in a.",
        "Inverting k/m to m/k yields sqrt(m/k) and m^(1/2), matching b's false spring relation, while its pendulum clause remains right.",
        "Fixed-k omega^2=k/m and pendulum mg/l versus inertia m cancellation support every clause of true c.",
        "Dropping m from pendulum restoring coefficient mg/l yields the spurious m^(-1/2) relation in false d. This deliberately wrong derivation is not an endorsed equation."
      ],
      [
        "The correct rationale uses matched-speed F_d/m and matched-amplitude E proportional to m; true a is qualitative under weak damping, not an exact envelope formula.",
        "Equating equal absolute dissipative power to equal fractional loss produces b. Its omission of E proportional to m is concretely false.",
        "Treating fixed Delta E/E as increasing with E produces c's false relative-loss ranking; the denominator reversal is an actual mistaken procedure.",
        "Dropping equal-drag and negligible-other-loss conditions produces d's universal extension. The retained b-heavy/m-heavy > b-light/m-light counterexample can reverse decay ranking for differing drag; it is not imported as this question's drag law."
      ]
    ],
    figureEvidence: {
      "16": "Inherited observations: one displacement/time frame, alternating shrinking lobes and source-visible terminal merge, without calibrated ticks, envelopes or decay constants. The original reviewer explicitly refused a finite exact stopping inference. Current English prose preserves that scope.",
      "08": "Inherited N12 context observations: connected support/cord/hopper/paper recording apparatus and an uncalibrated perspective sand trace. The existing trace is not a measured damped graph; adding cardboard is a source-attributed method, not new pixel evidence."
    },
    boundaries: [
      "Dissipation and qualified stopping -> schematic curve and recording apparatus",
      "Recording apparatus and nonmeasurement trace -> instrument-pointer damping",
      "Electromagnetic mechanical-to-internal-energy dissipation -> road-excited hydraulic damping"
    ],
    limitations: [
      "One existing internal counterexample keeps Chinese mathematical subscripts in b-heavy/m-heavy > b-light/m-light (actual original expression is retained byte-for-byte). This review does not translate mathematical notation.",
      "Figure/source identity labels remain Chinese intentionally; only native visible cap text Figure 16 is independently text-reviewed.",
      "No full English ARIA/accessibility, geometry, image, pixel, browser, native execution, retention, publication or course approval is asserted."
    ]
  },
  16: {
    own: "d1816-d1998-n16-first-en-review",
    inputs: "d1816-d1989-n16-en-choice-review-inputs",
    author: "d1816-d1981-n16-first-en-author",
    native: "d1816-d1988-n16-first-en-native",
    preparation: "d1816-d1982-n16-preparation",
    figures: ["22"],
    expected: { prose: 9, flow: 18, written: 5, answers: 5, choices: 5, options: 22, single: 3, multiple: 2 },
    prose: {
      0: [
        "One initial push in a dissipative system leads to decaying free motion; maintained motion needs energy replenishment. Forced motion's externally prescribed time-varying force is retained.",
        "Periodic external forcing can sustain a damped steady response. Self-oscillation instead lets motion control replenishment; no independent external periodic timing does not mean no force or no energy use.",
        "Stored internal reserves and continuous external energy supplies remain possible; the feedback mechanism determines transfer timing."
      ],
      1: [
        "The pendulum clock remains an energy-and-feedback example, with raised-weight gravitational or compressed-spring elastic reserves and the illustrated slanted-tooth wheel in Figure 22.",
        "Anchor ab, its two pallets, alternating lock/release, clock-hand gearing and small-portion energy transfer retain their distinct roles; escapement names that mechanism.",
        "The original figure-attributed pallet b push to the left, disengagement after equilibrium, and pallet a opposite-half-cycle interaction are retained. No new direction is inferred from unseen geometry.",
        "Left/right remain figure-relative, no exact push size/timing is read from the schematic, and two energy inputs per period compensate loss. Timing remains pendulum/escapement-controlled, not perpetual or independently clock-forced."
      ],
      4: [
        "Near-natural frequency is conditional on small amplitude and small damping/push effects; length, surroundings and escapement conditions still affect timekeeping. The 1657 Huygens/Netherlands statement is explicitly attributed to the source.",
        "The source's historical date is retained without claiming a complete clock chronology. The spring-driven balance wheel, torsional oscillation, restoring spring, energy source and loss compensation remain distinct.",
        "The clock/feedback definition, circuit-interrupting bell, continuous-airflow organ pipes/whistles and source heart/lung analogies are retained; none is claimed as a newly observed apparatus.",
        "Physiological analogies include energy and regulation; an isolated lung is not an automatic perpetual oscillator and a pendulum clock is not a complete model of living rhythms."
      ],
      5: [
        "Self-oscillation requires an energy supply, own-state feedback and suitable conditions, not an independent periodic driving schedule. The source term 'undamped' concerns nondecaying operating amplitude, not absent friction/dissipation.",
        "Failure of energy-supply or control conditions can weaken or stop oscillations; no unconditional self-sustainment is introduced."
      ],
      6: [
        "Drive-frequency equality remains limited to the stated steady periodic response; amplitude depends on drive frequency, strength, natural properties and damping, with possible decaying startup transients.",
        "Self frequency and steady amplitude jointly depend on oscillator, source, feedback and loss. Different starts can share amplitude only on entering the same stable state; neither every-start success nor unique amplitude is asserted.",
        "Free motion has no ongoing mechanical-energy supply; damped and ideal undamped free cases remain distinct, so nondecay cannot uniquely classify self motion. Initial conditions determine free energy/amplitude."
      ],
      8: [
        "The chapter synthesis retains instantaneous position/velocity as well as amplitude/period/frequency. Spacecraft and planets under gravity are not contrasted by abandoning instantaneous kinematics.",
        "Restoring action, inertia, energy and loss are shared comparisons, while supply/timing differs. Drive strength, natural/drive frequency and damping all matter; changing damped amplitude and stable versus transient states are not conflated."
      ]
    },
    written: [
      "Prompt, answer and notes preserve an open authentic-observation task, permission to report none, facts versus interpretation, oscillator/driver/frequency-selectivity evidence and safety. The windowpane example remains an analytic hypothetical, not a claimed personal observation or unique answer.",
      "Prompt and complete answer retain 50 N versus 0.005 N, unchanged door/force point, ideal lossless approximately linear range, timed positive work and external energy source. Static holding, gradual dynamic opening, unspecified time/amplitude and real-system limits remain separate.",
      "Prompt and complete answer retain comparable drive/coupling, weak damping and near-resonant excitation, sufficient build-up time, displacement-peak shift with damping, no finite steady amplitude at exact sustained undamped resonance, and noninevitable damage.",
      "Prompt still asks for examples outside the lesson. The complete bowed-string stick-slip and DC feedback-circuit explanations retain energy sources, state-controlled timing, stable-operation conditions, amplitude limiting and dissipation balance. Unpowered LC motion or plucking alone is not mislabeled self-oscillation.",
      "Prompt and full answer preserve free/forced/self energy and timing distinctions, ideal free amplitude, forced single-frequency linear steady scope, startup transients, average self energy-loss balance and same-stable-state convergence. Starting thresholds, several stable states and changing operating conditions remain counterexamples to unconditional initial-state independence."
    ],
    coverage: [
      "Source 1 maps only to choice-1. Evidence sufficiency remains central. Personal observation/example selection and real evidence collection/account organization are explicitly lost in the hypothetical recognition unit; the authentic open written question and complete nonunique answer remain separate.",
      "Source 2 maps only to choice-2. The force values, dynamic/static distinction, timed net work, missing time data and arbitrary-dissipation limit all remain. Independent force-scheme design and written causal organization are the two declared losses.",
      "Source 3 maps only to choice-3. Weak damping, near-natural drive, coupling and damage limits are assessed jointly. The steady-response restriction does not test a learner-generated transient explanation; this is explicitly declared in limitations and coverage. Exact-undamped-growth and brief-push distinctions remain in the full open prompt/answer, not silently claimed as elicited by choices.",
      "Source 4 maps only to choice-4. The cart/control scheme is absent from the lesson's clock, balance-wheel, bell, organ-pipe/whistle and physiological examples. Original-example generation and independent mechanism design are explicitly lost; recognition is not called creation.",
      "Source 5 maps only to choice-5. Energy, timing, frequency/amplitude, transients, ideal-free counterexample and same-stable-state conditions remain. Independent full three-way writing and counterexample production are explicitly lost. The compressed choice comparison is supplementary; explicit damped-free comparison remains in the current original prompt and full answer."
    ],
    reconciliation: [
      [
        "Treating noticeable amplitude as sufficient evidence deletes frequency-selectivity/natural-property checks, actually producing false A.",
        "The rationale preserves neither-confirm-nor-exclude and comparable frequency-response investigation, matching true B.",
        "Turning missing natural-frequency data into proof of nonresonance produces false C; subsequent relevant evidence can change the assessment.",
        "Substituting equality of forced response and drive frequencies for equality to natural frequency produces false D; ordinary off-resonant forcing is a counterexample."
      ],
      [
        "Mistaking longer constant-force duration for repeated net energy input and dynamic motion for static balance produces false A. A constant force cannot meet the 50 N holding requirement.",
        "Continually timed positive net work under the lossless linear range supports B's gradual possible opening, not guaranteed immediate opening.",
        "Missing inertia, restoring/dynamic properties and force-time protocol support C's inability to determine an opening time.",
        "The same-position static requirement remains approximately 50 N irrespective of dynamic arrival, supporting true D.",
        "Deleting the lossless restriction allows losses to balance small-drive input before the target position, refuting E's arbitrary-dissipation guarantee."
      ],
      [
        "Dropping coupling from the resonance conditions produces A's false sufficiency claim.",
        "Reversing dissipative energy loss into retention produces B's false stronger-damping argument.",
        "The correct rationale preserves weak damping, effective coupling, near-natural drive and no guaranteed damage under the stem's steady/linear/comparable conditions.",
        "Replacing response enhancement with an exceeded structural failure threshold produces D's unsupported inevitable-damage conclusion."
      ],
      [
        "Classifying any powered repeated motion as self ignores an independent external clock; A is forced driving.",
        "Treating initial spring/kinetic energy exchange as continual net supply ignores stated loss; B is damped free motion after disconnection.",
        "Equating a continuously powered constant force with positive net work each closed cycle ignores equilibrium shift and feedback; C is not self-sustaining.",
        "State sensing, suitable-phase supply and amplitude regulation support D under suitable conditions; no separate periodic clock is introduced."
      ],
      [
        "Deleting the steady-response restriction produces A's false absence of initial-condition homogeneous transients.",
        "No loss and no ongoing drive allow conserved initial energy/amplitude, supporting B and refuting amplitude-only classification.",
        "Using the energy source's location as the classification replaces the actual drive-timing/feedback distinction and produces false C. External DC supply can power self feedback.",
        "Joint source/feedback/oscillator/loss dependence and restriction to the same stable state support D; arbitrary-start convergence is not claimed.",
        "The explicit steady periodic scope and separate amplitude dependencies support E. Startup frequency equality is not asserted."
      ]
    ],
    figureEvidence: {
      "22": "Inherited observations: arched anchor, upper pivot, b-left/a-right pallets, visible toothed wheel/spokes, drum, both chain strands, right-hand weight and rod/bob; hidden tooth/link counts and exact timing are not measured. Current English prose preserves the attributed schematic directions and two-energy-inputs-per-period account, without new geometry inference."
    },
    boundaries: [
      "General energy supply and feedback -> pendulum clock and escapement",
      "Qualified clock/physiological examples -> self-oscillation definition",
      "Free/forced/self supply and stable-state comparison -> chapter synthesis, skipping empty separator"
    ],
    limitations: [
      "The provisional source-only buzzer candidate was later found already listed in the full lesson, so it is not approved as a new source-4 example. It was never used to alter a choice key. The actual cart option and written bowed-string/DC circuit examples are outside the lesson's list.",
      "The source's 1657 date is retained as attributed history, not newly researched or independently certified. Huygens and the Netherlands retain their source identities.",
      "Figure/source identity labels and protected provenance remain Chinese intentionally; native visible cap Figure 22 is newly text-reviewed.",
      "No full English ARIA/accessibility, geometry, image, pixel, browser, native execution, retention, publication or course approval is asserted."
    ]
  }
};

for (const [number, spec] of Object.entries(assessments)) {
  const unit = `phy10-c1-s2-n${number}`;
  const own = tmp + spec.own;
  const inputs = tmp + spec.inputs;
  const chinese = artifact + `editions/modern-us-neutral/lessons/${unit}`;
  const english = artifact + `editions/modern-us-neutral-en/lessons/${unit}`;
  const source = load(own + "/source-freeze.json");
  const blind = load(own + "/blind-view-freeze.json");
  const seed = load(inputs + "/seed.json");
  const draft = load(inputs + "/draft.json");
  const views = load(inputs + "/views.json");
  assert.equal(source.seed_sha256, digest(seed));
  assert.equal(blind.views_file_sha256, binding(inputs + "/views.json").sha256);
  assert.deepEqual(views, draft.questions.map((question) => question.view));
  const zh = {
    lesson: load(chinese + "/lesson.json"),
    exercises: load(chinese + "/exercises.json"),
    answers: load(chinese + "/answer-keys.json"),
    figures: load(chinese + "/figures.json"),
    seed: load(chinese + "/choice-set/seed.json"),
    draft: load(chinese + "/choice-set/draft.json"),
    review: load(chinese + "/choice-set/review.json")
  };
  const en = {
    lesson: load(english + "/lesson.json"),
    exercises: load(english + "/exercises.json"),
    answers: load(english + "/answer-keys.json"),
    figures: load(english + "/figures.json")
  };
  assert.equal(zh.review.outcome, "pass");
  assert.equal(zh.review.seed_sha256, digest(zh.seed));
  assert.equal(zh.review.draft_sha256, digest(zh.draft));
  assert.deepEqual(zh.figures.figures, en.figures.figures);
  assert.deepEqual(zh.lesson.source, en.lesson.source);
  assert.deepEqual(zh.exercises.source, en.exercises.source);

  const questions = blind.question_reviews.map((frozen, index) => {
    const question = draft.questions[index];
    assert.equal(frozen.view_ordinal, index + 1);
    assert.deepEqual(frozen.mathematics.correct, question.key.correct);
    assert.equal(question.source_numbers.length, 1);
    assert.equal(question.source_numbers[0], String(index + 1));
    const { view_ordinal, ...review } = frozen;
    review.question_id = question.id;
    review.mathematics.option_checks = frozen.mathematics.option_checks.map((option, j) => {
      assert.equal(option.option_id, question.view.options[j].id);
      assert.equal(option.option_id, question.key.rationales[j].option_id);
      assert.equal(option.truth, question.key.rationales[j].truth);
      return { ...option, evidence: option.evidence + " Post-blind reconciliation: " + spec.reconciliation[index][j] };
    });
    return review;
  });
  const sourceReviews = source.source_reviews.map((row, index) => ({
    ...row, coverage: { verdict: "pass", evidence: spec.coverage[index] }
  }));
  const review = {
    schema: "s10y-choice-review-v1",
    seed_sha256: digest(seed),
    draft_sha256: digest(draft),
    reviewer: { kind: "independent_agent", identity },
    source_reviews: sourceReviews,
    figure_checks: [],
    new_figure_reviews: [],
    question_reviews: questions,
    outcome: "pass"
  };

  const files = [
    binding(inputs + "/seed.json", "Source-first complete seed"),
    binding(inputs + "/views.json", "Learner-only second phase; all options frozen before key disclosure"),
    binding(inputs + "/draft.json", "Post-blind complete draft, all intents, rationales, misconceptions and coverage"),
    ...["lesson.json", "exercises.json", "answer-keys.json", "figures.json"].flatMap((name) => [
      binding(chinese + "/" + name, "Current approved Chinese counterpart, with answers read only after both blind freezes"),
      binding(english + "/" + name, "Current native English counterpart; all current prose/title/cap/prompt/answer/notes inspected")
    ]),
    ...["seed.json", "draft.json", "review.json"].map((name) =>
      binding(chinese + "/choice-set/" + name, name === "review.json"
        ? "After blind freeze: schema/outcome/canonical Chinese bindings only; not used to solve English"
        : "After blind freeze: complete Chinese content counterpart")),
    binding(tmp + spec.author + "/source-binding/report.json", "Author provenance and claimed preservation, not semantic approval"),
    ...["lesson.template.json", "exercises.template.json", "answer-keys.json", "draft.json", "figures.template.json"]
      .map((name) => binding(tmp + spec.author + "/" + name, "Post-blind author/native textual and snapshot comparison")),
    binding(tmp + spec.native + "/result.json", "Parent native result and current-file snapshot references; no native command rerun"),
    binding(tmp + spec.preparation + "/prepared.json", "Parent Chinese/figure input-byte bindings; not image observation"),
    binding(".agents/skills/ld-s10y-choice/references/review.md", "Required semantic-gate instructions"),
    binding(".agents/skills/ld-s10y-choice/references/contract.md", "Exact review contract"),
    binding(".agents/skills/ld-s10y-choice/scripts/validate.py", "Schema as needed; official validator runs once only after reports")
  ];

  const proseReviews = en.lesson.prose.map((block, index) => {
    const other = zh.lesson.prose[index];
    assert.equal(block.kind, other.kind);
    assert.equal(block.id, other.id);
    assert.equal(block.label, other.label);
    assert.deepEqual(block.source_refs, other.source_refs);
    assert.equal(block.source_text, other.source_text);
    const englishParagraphs = block.kind === "p" && block.text.trim()
      ? block.text.split(/\n\s*\n/) : [];
    const chineseParagraphs = other.kind === "p" && other.text.trim()
      ? other.text.split(/\n\s*\n/) : [];
    assert.equal(englishParagraphs.length, chineseParagraphs.length);
    assert.equal(englishParagraphs.length, spec.prose[index]?.length ?? 0);
    return {
      index, kind: block.kind, source_refs: block.source_refs, verdict: "PASS",
      ...textBinding(`/prose/${index}/text`, other.text, block.text),
      evidence: block.kind === "cap"
        ? `Native visible '${block.text}' translates '${other.text}', preserving figure number. Identity label stays Chinese. This is the first English caption-text review, not an image review.`
        : block.kind === "fig"
          ? "Empty figure slot and Chinese source/identity label are retained; no visible geometry inspection claimed."
          : !block.text.trim()
            ? "Empty separator stays empty; no textual task is omitted."
            : "Every paragraph below was independently compared with its current Chinese counterpart.",
      flow_paragraph_reviews: englishParagraphs.map((paragraph, j) => ({
        local_index: j,
        ...textBinding(`/prose/${index}/text/paragraph/${j}`, chineseParagraphs[j], paragraph),
        verdict: "PASS", evidence: spec.prose[index][j]
      }))
    };
  });

  const writtenReviews = en.exercises.exercises.map((exercise, index) => {
    const other = zh.exercises.exercises[index];
    const answer = en.answers.answers[index];
    const otherAnswer = zh.answers.answers[index];
    assert.equal(exercise.text, seed.exercises[index].text);
    assert.equal(exercise.text, answer.prompt);
    assert.deepEqual(exercise.lines, exercise.text.split("\n"));
    assert.equal(answer.grading, "ungraded");
    assert.deepEqual(answer.parts, []);
    for (const key of ["number", "source_number", "group", "group_id", "pages", "figure_refs", "figures", "source_text"])
      assert.deepEqual(exercise[key], other[key]);
    for (const key of ["exercise", "source", "grading", "parts", "figureEvidence", "historical_entities", "bookRaw"])
      assert.deepEqual(answer[key], otherAnswer[key]);
    return {
      source_number: exercise.number, verdict: "PASS", evidence: spec.written[index],
      prompt_binding: textBinding(`/exercises/${index}/text`, other.text, exercise.text),
      answer_prompt_binding: textBinding(`/answers/${index}/prompt`, otherAnswer.prompt, answer.prompt),
      complete_answer_binding: textBinding(`/answers/${index}/displayAnswer`, otherAnswer.displayAnswer, answer.displayAnswer),
      complete_notes_binding: textBinding(`/answers/${index}/notes`, otherAnswer.notes, answer.notes),
      grading: answer.grading, parts: answer.parts,
      bookRaw: answer.bookRaw === undefined ? "Absent in Chinese and English; no raw answer invented" : "Protected in place",
      notes_assessment: number === "12"
        ? "All five notes faithfully preserve read-only/full-standard-explanation, no legacy input/interaction and no captured short-book-answer provenance; they do not claim reviewer authorship of derivations."
        : "All five notes faithfully preserve open observation/example/reasoning, full read-only reference explanation, no unique example/automatic grading and no legacy interaction."
    };
  });

  const choiceReviews = draft.questions.map((question, index) => {
    const other = zh.draft.questions[index];
    assert.deepEqual(question.source_numbers, other.source_numbers);
    assert.deepEqual(question.intent.concept_blocks, other.intent.concept_blocks);
    assert.equal(question.view.mode, other.view.mode);
    assert.deepEqual(question.key.correct, other.key.correct);
    assert.equal(question.intent.limitations.length, other.intent.limitations.length);
    return {
      question_id: question.id, source_numbers: question.source_numbers, verdict: "PASS",
      first_english_semantic_approval: "Independent; frozen learner-only evidence precedes author/key comparison. Chinese pass is not relabeled.",
      source_coverage_evidence: spec.coverage[index],
      view_binding: textBinding(`/questions/${index}/view/stem`, other.view.stem, question.view.stem),
      intent_bindings: ["task", "source_solution", "unit_reason"].map((field) =>
        textBinding(`/questions/${index}/intent/${field}`, other.intent[field], question.intent[field])),
      intent_assessment: questions[index].task_fidelity.evidence + " The translated task, full source solution and unit rationale preserve the same complete reasoning unit and scope; independent blind solution agrees.",
      limitations: question.intent.limitations.map((text, j) => ({
        ...textBinding(`/questions/${index}/intent/limitations/${j}`, other.intent.limitations[j], text),
        verdict: "PASS", evidence: text
      })),
      options: question.view.options.map((option, j) => {
        const otherOption = other.view.options[j];
        const rationale = question.key.rationales[j];
        const otherRationale = other.key.rationales[j];
        assert.equal(option.id, otherOption.id);
        assert.deepEqual(option.figure_ids, otherOption.figure_ids);
        assert.equal(rationale.truth, otherRationale.truth);
        assert.equal(rationale.misconception === null, otherRationale.misconception === null);
        return {
          option_id: option.id, truth: questions[index].mathematics.option_checks[j].truth,
          ...textBinding(`/questions/${index}/view/options/${j}/text`, otherOption.text, option.text),
          rationale_binding: textBinding(`/questions/${index}/key/rationales/${j}/derivation`, otherRationale.derivation, rationale.derivation),
          misconception_binding: rationale.misconception === null ? null
            : textBinding(`/questions/${index}/key/rationales/${j}/misconception`, otherRationale.misconception, rationale.misconception),
          evidence: questions[index].mathematics.option_checks[j].evidence
        };
      })
    };
  });

  const coverageReviews = draft.coverage.map((row, index) => {
    const other = zh.draft.coverage[index];
    assert.equal(row.source_number, other.source_number);
    assert.deepEqual(row.question_ids, other.question_ids);
    assert.equal(row.omitted_tasks.length, other.omitted_tasks.length);
    assert.deepEqual(row.question_ids, draft.questions.filter((q) => q.source_numbers.includes(row.source_number)).map((q) => q.id));
    return {
      source_number: row.source_number, question_ids: row.question_ids, verdict: "PASS",
      evidence: spec.coverage[index],
      omitted_tasks: row.omitted_tasks.map((text, j) => ({
        ...textBinding(`/coverage/${index}/omitted_tasks/${j}`, other.omitted_tasks[j], text),
        evidence: text, verdict: "PASS"
      })),
      reason_binding: textBinding(`/coverage/${index}/reason`, other.reason, row.reason),
      independent_written_task_remains: true
    };
  });

  const flow = en.lesson.prose.filter((p) => p.kind === "p")
    .flatMap((p) => p.text.trim() ? p.text.split(/\n\s*\n/) : []);
  const boundaryReviews = en.lesson.section_breaks.map((row, index) => {
    const before = flow.indexOf(row.before), after = flow.indexOf(row.after);
    assert.ok(before >= 0 && after === before + 1);
    return {
      index, verdict: "PASS", before_flow_index: before, after_flow_index: after,
      evidence: "Exact adjacent current-English paragraph text anchors preserve: " + spec.boundaries[index] + ". Textual adjacency only; no native flow/render replay.",
      before_binding: textBinding(`/section_breaks/${index}/before`, zh.lesson.section_breaks[index].before, row.before),
      after_binding: textBinding(`/section_breaks/${index}/after`, zh.lesson.section_breaks[index].after, row.after)
    };
  });

  const figures = spec.figures.map((id) => {
    const relative = artifact + `editions/modern-us-neutral/figures/fig-${id}.independent-review.json`;
    const original = load(relative);
    assert.equal(original.status, "pass");
    assert.equal(original.lesson, unit);
    const b = binding(relative, "Post-blind original approved Chinese observation record; reused, not performed again");
    files.push(b);
    files.push(binding(artifact + `editions/modern-us-neutral/figures/fig-${id}.review.json`, "Original approved review sidecar"));
    files.push(binding(artifact + `editions/modern-us-neutral/figures/fig-${id}.render.json`, "Parent-carried render/hash metadata only, no pixel inspection"));
    return {
      figure_id: `fig-${id}`, status: "REUSED_APPROVED_CHINESE_OBSERVATIONS",
      reused_after_both_blind_freezes: true,
      reviewer: original.reviewer, original_review: b,
      source_asset_binding: original.bindings.source,
      modern_asset_binding: original.bindings.svg,
      original_observations: original.independentSourceInventory ?? [],
      original_assessment: original.assessment,
      original_limits: original.limits,
      inherited_observation_record: original.inheritedReview ?? null,
      current_english_context_evidence: spec.figureEvidence[id],
      asset_bytes_read_by_this_reviewer: false,
      binding_scope: "Original hash-bound observations and parent preparation transfer evidence only; no fresh asset rehash, image, geometry or pixel approval."
    };
  });

  const counts = {
    prose: en.lesson.prose.length, flow: flow.length, written: writtenReviews.length,
    answers: en.answers.answers.length, choices: draft.questions.length,
    options: draft.questions.reduce((sum, q) => sum + q.view.options.length, 0),
    single: draft.questions.filter((q) => q.view.mode === "single").length,
    multiple: draft.questions.filter((q) => q.view.mode === "multiple").length
  };
  assert.deepEqual(counts, spec.expected);
  const englishReview = {
    schema: "stemrobin-181/independent-first-english-review@1",
    authorization: "181-7", ticket: "STEMROBIN-181", unit,
    book: "10p", edition: "modern-us-neutral-en", status: "PASS",
    reviewer: { kind: "independent_agent", identity },
    workdir: repo, owned_directory: path.join(repo, own),
    review_scope: "First independent current-English text and choice-semantic comparison against approved CURRENT Chinese equivalents. Source/key-blind order preserved. Native/render/display/pixels/retention remain parent-owned.",
    independence: {
      author_or_product_edits: 0,
      source_freeze: binding(own + "/source-freeze.json", "Saved before views"),
      blind_view_freeze: binding(own + "/blind-view-freeze.json", "Saved before drafts, author outputs, answers, keys or prior reviews"),
      source_phase: "Only seeds, current Chinese source prompts and seed-selected concept definitions, plus instructions/schema; no answers",
      blind_view_phase: "Only learner-only views, with all true sets and every option frozen",
      post_blind_phase: "Full draft reconciliation, full native/Chinese English text review, then unchanged Chinese figure-observation reuse",
      first_english_approval_not_inherited_from_chinese: true
    },
    counts, findings: [], minimal_required_delta: null,
    headings: ["title", "printed_title", "chapter", "section"].map((field) => ({
      field, chinese: zh.lesson[field], english: en.lesson[field], verdict: "PASS",
      ...textBinding(`/${field}`, zh.lesson[field], en.lesson[field]),
      evidence: field === "section"
        ? "The first-chapter ordinal and Mechanical Oscillations meaning are retained; native punctuation is textually acceptable."
        : "Current English preserves the Chinese heading's subject, printed lesson ordinal where present, and chapter identity."
    })),
    prose_reviews: proseReviews,
    written_and_full_ungraded_answer_reviews: writtenReviews,
    choice_reviews: choiceReviews,
    coverage_reviews: coverageReviews,
    source_figure_reviews: figures,
    new_figure_reviews: [],
    boundary_reviews: boundaryReviews,
    protected_identity_and_source_scope: {
      lesson_source_snapshot_deep_equal: true,
      exercises_source_snapshot_deep_equal: true,
      all_prose_source_refs_text_ids_labels_preserved: true,
      figure_manifest_entries_deep_equal: true,
      written_groups_and_source_identity_preserved: true,
      ungraded_answer_parts_empty: true,
      bookRaw: "Absent in both units' current Chinese and English answers; absence preserved",
      chinese_identity_labels_not_visible_caption_language: true,
      historical_entities: en.lesson.prose.flatMap((p) => p.historical_entities ?? []),
      mathematics_not_translated: true,
      full_english_accessibility_certified: false
    },
    limits: spec.limitations,
    counters: {
      image_opens: 0, image_bytes_read: 0, browser_calls: 0, network_calls: 0,
      database_calls: 0, paid_calls: 0, git_commands: 0,
      product_edits: 0, author_edits: 0, native_commands: 0,
      new_geometry_reviews: 0, new_science_image_reviews: 0,
      official_choice_validator_runs: "One run after these reports; exact stdout/stderr/exit recorded separately"
    },
    contract_field_resolution: "Exact CONTRACT review.json uses figure_checks=[] because no choice/source seed uses figures, new_figure_reviews=[], and source_reviews[].coverage. The requested source_figure_reviews and coverage_reviews are here, not added as rejected unknown fields to review.json.",
    inspected_file_byte_bindings: files,
    official_validation: {
      receipt: path.join(repo, own, "validation-receipt.json"),
      stdout: path.join(repo, own, "validation.stdout.txt"),
      stderr: path.join(repo, own, "validation.stderr.txt"),
      exit: path.join(repo, own, "validation.exit.txt"),
      meaning: "Mechanical checker result is separate from independent semantic approval."
    }
  };
  for (const [name, value] of [["review.json", review], ["english-review.json", englishReview]]) {
    const destination = path.join(repo, own, name);
    fs.writeFileSync(destination, JSON.stringify(value, null, 2) + "\n", { flag: "wx" });
    console.log(JSON.stringify({ file: destination, bytes: fs.statSync(destination).size, sha256: hash(fs.readFileSync(destination)), outcome: name === "review.json" ? review.outcome : englishReview.status }));
  }
}
