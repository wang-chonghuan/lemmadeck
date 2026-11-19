import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";

const root = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const out = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d1295-n101-t11-first-independent-choice-review");
if (process.cwd() !== root) throw new Error("Wrong cwd");
const sha = value => crypto.createHash("sha256").update(value).digest("hex");
const freezePath = path.join(out, "independent-solutions-FIRST.json");
if (sha(fs.readFileSync(freezePath)) !== "ba8ef4750118e24e3f0d4501e194d2b69d2ef2f50f307abfa927f96fc90b9cd2") throw new Error("FIRST freeze changed");
const pass = evidence => ({ verdict: "pass", evidence });
const check = (option_id, truth, evidence) => ({ option_id, truth, evidence });
const records = [
  {
    card: "n101", question_id: "n101-mass-speed",
    task_fidelity: pass("Source 1 asks for the historical mass-speed formula. The view still requires selecting the complete functional relation for m at fixed invariant m0>0 over 0<=v<c, not copying a supplied numerical value. Definitions clarify the mass convention without stating the relation. Unaided recall and formula writing are not demonstrated by selection; the mathematical distinction is retained."),
    redundancy: pass("Three different functions are offered. At v=0.6c their ratios m/m0 are 0.8, 1.25 and 1.5625. Although all coincide at v=0, the task asks for a formula on the stated domain, not its value at a single endpoint. No two alternatives are the same domain-wide formula."),
    answer_leakage: pass("Neither the stem nor another visible stem states m=gamma m0 or selects an option ID. The rest-energy question defines gamma but does not supply the mass-speed identity; using gamma to recognize a function remains mathematical reasoning. This formula may support the later electron calculation, but no option supplies the inverted 40000-speed result."),
    mathematics: {
      verdict: "pass",
      independent_solution: "For fixed invariant m0, E=gamma m0 c^2 and historical m=E/c^2 imply m=m0/sqrt(1-v^2/c^2). This is a domain-wide identity. At v=0.6c, gamma=1.25. The complete true set is {b}, even though the formulas coincide accidentally at v=0.",
      correct: ["b"],
      option_checks: [
        check("a", "incorrect", "Multiplying by sqrt(1-beta^2) reverses the historical mass factor. At beta=0.6 it gives 0.8m0 instead of 1.25m0; it decreases toward zero rather than increasing. It is the result of using a contraction factor in place of its reciprocal."),
        check("b", "correct", "Division by sqrt(1-beta^2) gives gamma m0 for every allowed speed, including m=m0 at v=0; at beta=0.6 it gives 1.25m0. m0 remains invariant."),
        check("c", "incorrect", "Omitting the square root gives gamma^2 m0, not gamma m0. At beta=0.6 it gives 1.5625m0 rather than 1.25m0. Agreement at zero speed does not make it the required functional identity.")
      ]
    }
  },
  {
    card: "n101", question_id: "n101-mass-energy",
    task_fidelity: pass("Source 2 asks what the mass-energy law states. The multiple response requires distinguishing total energy from kinetic energy and historical mass from invariant system mass, including before/after rest conditions. The options preserve E=mc^2 and the relevant change relation. Choice loses independent explanatory wording, not the core physical distinctions."),
    redundancy: pass("a tests the total-energy historical-mass identity; c tests rest-energy/invariant-mass changes. They are related but not identical response units. b changes E to K and d incorrectly turns a bulk-speed change into an invariant-mass change, so the four options make distinct judgments."),
    answer_leakage: pass("K=E-E0 is a legitimate definition, not the answer K=mc^2 or its negation. No visible stem marks a or c correct. The heating item gives competing positive/zero/negative rest-energy explanations and supports application of the same law; it does not provide a labelled true statement. Reasonable elimination from K's definition still requires the source distinction."),
    mathematics: {
      verdict: "pass",
      independent_solution: "Historical m=E/c^2 relates total energy, not kinetic energy, to mass. At rest before and after, E0=m0 c^2 implies Delta m0=Delta E0/c^2. With internal state fixed, changing bulk speed leaves m0 unchanged while K varies. Complete true set: {a,c}; b and d fail as general relations.",
      correct: ["a", "c"],
      option_checks: [
        check("a", "correct", "E=mc^2 is the exact relation for total energy and historical relativistic mass in the chosen frame; this does not identify m with invariant m0 at nonzero speed."),
        check("b", "incorrect", "K=E-E0=(m-m0)c^2 for a massive body, not mc^2. A body at rest with m0>0 has K=0 but mc^2=m0c^2>0. The misconception drops rest energy when interpreting total energy."),
        check("c", "correct", "Taking the difference of E0=m0 c^2 for the same system at rest before and after gives exactly Delta m0=Delta E0/c^2, including retained internal-energy changes."),
        check("d", "incorrect", "For a fixed internal state, accelerate a massive body from rest to 0.6c: Delta m0=0 but Delta K/c^2=0.25m0. Delta K/c^2 measures the historical-mass increase, not the invariant-mass increase.")
      ]
    }
  },
  {
    card: "n101", question_id: "n101-rest-energy",
    task_fidelity: pass("Source 3 asks for rest energy. The view requires recognizing both its own-rest-frame definition and E0=m0c^2. The qualifier 'different speeds'/'for any speed' keeps the distinction from the chosen frame's total and kinetic energies. Definition recall and free explanation are lost, while the defining frame and quantity remain."),
    redundancy: pass("The alternatives are kinetic energy, chosen-frame total energy, and own-rest-frame energy. They are not the same definition. b coincides numerically with E0 only at v=0, and a coincides only at gamma=2; neither satisfies the requested speed-independent definition."),
    answer_leakage: pass("The stem supplies gamma's definition but neither E0=m0c^2 nor an answer position. The mass-energy stem distinguishes E0 from K and E but does not give E0's formula or its own-rest-frame definition. Choosing between the three meanings still requires the source concept."),
    mathematics: {
      verdict: "pass",
      independent_solution: "Rest energy is measured in the body's own rest frame and equals m0c^2 independently of its speed in another frame. The chosen-frame E=gamma m0c^2 and K=(gamma-1)m0c^2 are different quantities. Complete true set: {c}.",
      correct: ["c"],
      option_checks: [
        check("a", "incorrect", "The expression is kinetic energy of overall motion, not rest energy. At v=0 it is zero although E0=m0c^2>0; at 0.6c it is 0.25E0. An accidental equality at gamma=2 does not repair the definition."),
        check("b", "incorrect", "gamma m0c^2 is total energy in the chosen frame. At 0.6c it is 1.25E0. It equals E0 only when that frame is the rest frame; the view demands a definition valid at any chosen-frame speed."),
        check("c", "correct", "The body's own-rest-frame energy is E0=m0c^2. This is positive for m0>0 even when bulk kinetic energy vanishes, and does not vary merely with another frame's measured speed.")
      ]
    }
  },
  {
    card: "n101", question_id: "n101-heating-resolution",
    task_fidelity: pass("Source 4 asks why an ordinary heating mass increase is difficult to detect with the capabilities discussed in the historical source. The view preserves the causal choice: retained heat changes rest energy positively but gives a tiny mass difference relative to the period's balance resolution. Same body, retained matter and heat, and before/after rest conditions are explicit. Independent explanatory production and experimental argument writing are lost."),
    redundancy: pass("a predicts zero invariant-mass change, b positive change, and c negative change for Q>0. These are distinct causal accounts even though b and c share a resolution qualifier; the sign of retained energy is a necessary part of the task, not a repeated answer cell."),
    answer_leakage: pass("The stem states retained heat as internal energy, not the rest-energy formula or the correct option. The earlier mass-energy statement candidates are unlabelled and do not state the historical measurement limit. Rejecting zero and negative changes requires connecting internal energy to rest energy; recognizing the historical resolution scope is part of the task."),
    mathematics: {
      verdict: "pass",
      independent_solution: "For the unchanged body at rest, with supplied Q retained as internal energy, Delta E0=Q>0 and Delta m0=Q/c^2>0. With c approximately 3e8 m/s, the factor is approximately 1.11e-17 kg/J. Ordinary heating therefore gives a mass difference below the balances discussed for that period, not a zero change or timeless impossibility. Complete true set: {b}.",
      correct: ["b"],
      option_checks: [
        check("a", "incorrect", "Internal energy contributes to the body's rest energy. Retaining Q raises E0 by Q, so Delta m0 cannot be zero. This falsely excludes internal heat from total rest energy; lack of resolution is not lack of a physical change."),
        check("b", "correct", "Retained heat raises rest energy and invariant mass by Q/c^2>0. Joules divided by m^2/s^2 give kg. The period-specific balance-resolution limitation matches the source and does not say no era can measure such a change."),
        check("c", "incorrect", "A negative Q/c^2 is the sign for net rest-energy loss, not the stated positive retained input. For Q>0, Delta E0=Q makes the sign positive. The shared resolution statement cannot rescue the reversed energy-flow sign.")
      ]
    }
  },
  {
    card: "t11", question_id: "t11-event-order",
    task_fidelity: pass("Source 1 is about front A and rear B strikes assigned simultaneous event times by local train clocks. The view retains the B-to-A travel direction and asks ground-frame local-clock event order, explicitly not flash-arrival order. Selecting order loses the learner's independent spacetime explanation, but keeps the essential simultaneity and orientation judgment."),
    redundancy: pass("A-before-B, B-before-A and simultaneous are three mutually exclusive event-time outcomes for distinct positions and nonzero forward train motion. The water and electron questions use unrelated source data and cannot answer this order."),
    answer_leakage: pass("The stem clarifies the authority's local-clock convention without stating which point is earlier. It gives no receiving observer position or optical arrival shortcut. Neither other view supplies a strike-order result or a Lorentz-sign cue."),
    mathematics: {
      verdict: "pass",
      independent_solution: "Let train frame K' move at V>0 in the B-to-A direction relative to ground K. For the A-minus-B event differences, Delta t'=0 and Delta x'>0. Inverse Lorentz transformation gives Delta t=gammaV V Delta x'/c^2>0, so A occurs after B on ground clocks. Complete true set: {b}. No light-arrival inference is involved.",
      correct: ["b"],
      option_checks: [
        check("a", "incorrect", "A-before-B would require Delta t<0, but inverse transformation gives a positive difference for the stated forward direction. It results from reversing the Lorentz sign/direction or confusing arrival times with event times."),
        check("b", "correct", "Because tA-tB=gammaV V(x'A-x'B)/c^2>0, rear B is struck earlier and front A later in the ground frame."),
        check("c", "incorrect", "For V>0 and separated front/rear events, the transformation adds a nonzero positive position term even though Delta t'=0. Treating simultaneity as frame-independent deletes that term.")
      ]
    }
  },
  {
    card: "t11", question_id: "t11-electron-speed",
    task_fidelity: pass("Source 2 asks the speed for historical mass 40000 times invariant rest mass. The view keeps that convention and all data, and asks for the exact speed expression without supplying the inverted relation. It retains squaring and square-root distinctions; numerical evaluation and unaided algebraic inversion are production losses, not silent changes of the mass ratio."),
    redundancy: pass("a squares the mass ratio and retains the outer square root; b loses the ratio square; c loses the outer square root. The three speeds are distinct despite all being close to c. No choice is merely a repeated numeric cell."),
    answer_leakage: pass("The stem gives the ratio and the meanings of m,m0,c, not gamma's inversion or the result. A previously recognized mass-speed law can be applied, but substituting 40000 and solving for v remains the source's mathematical task. No visible item states this speed."),
    mathematics: {
      verdict: "pass",
      independent_solution: "m/m0=gamma=40000 gives 1-beta^2=1/40000^2=6.25e-10 and beta=sqrt(1-6.25e-10). The stable deficit 1-beta=x/(1+sqrt(1-x)) with x=6.25e-10 is about 3.125000000488281e-10; with optional rounded c=3e8 m/s, c-v is about 0.09375000001465 m/s. The exact result is strictly below c. Complete true set: {a}.",
      correct: ["a"],
      option_checks: [
        check("a", "correct", "Substitution into 1/sqrt(1-beta^2) gives exactly 40000. beta is approximately 0.9999999996875, not exactly 1, and the expression avoids discarding the decisive small deficit."),
        check("b", "incorrect", "Here 1-beta^2=1/40000, so gamma=sqrt(40000)=200 rather than 40000. This is precisely the result of failing to square the mass ratio when removing the reciprocal square root."),
        check("c", "incorrect", "Putting x=1/40000^2, this beta=1-x gives 1-beta^2=2x-x^2, hence gamma=1/sqrt(2x-x^2), approximately 28284.27, not 40000. The outer square root was dropped; closeness to c does not make the exact expression equivalent.")
      ]
    }
  },
  {
    card: "t11", question_id: "t11-water-mass",
    task_fidelity: pass("Source 3 asks the mass increase for 1 kg water heated through 50 deg C. The view preserves both data and explicitly adds rest, retained matter/heat, no phase change and negligible work conditions. It asks the general expression in mean specific heat rather than inventing a numerical seed constant. Selecting an energy-to-mass expression retains the two required physical relationships; independent derivation, property lookup, numerical evaluation and writing are not demonstrated."),
    redundancy: pass("a uses 323.15 K instead of the 50 K temperature difference, b adds an unwarranted half, and c uses the full mean-heat-capacity relation. Their mass increases are in the ratio 6.463:0.5:1, so every alternative makes a different mathematical claim."),
    answer_leakage: pass("The stem gives the meaning and units of mean heat capacity and states numerical data are absent, but does not give Q=M*cw*Delta T or Delta m=Q/c^2. Students must connect both relationships. The earlier heating question tests resolution with a pre-existing Q, not construction of the water's heat input from its mass and temperature change."),
    mathematics: {
      verdict: "pass",
      independent_solution: "Define mean cw over the interval by integral cw(T)dT divided by Delta T. Retained rest-energy gain is Q=(1 kg)*mean cw*(50 K), because a 50 deg C temperature rise equals 50 K, not 323.15 K. Dividing by c^2 gives the invariant-system mass gain in kg. The source alone has no numeric heat capacity. Only if optional cw=4200 J/(kg K), c=3e8 m/s are expressly added does the result become about 2.3e-12 kg (2.3e-9 g); these are not visible draft data. Complete true set: {c}.",
      correct: ["c"],
      option_checks: [
        check("a", "incorrect", "Adding 273.15 to a 50 deg C temperature difference is invalid; offsets apply to absolute temperatures only. It replaces Delta T=50 K by 323.15 K and gives 6.463 times the correct gain. No initial/final absolute temperature in the source justifies it."),
        check("b", "incorrect", "Mean cw already averages any temperature variation over the interval, so Q=M*mean cw*Delta T has no extra 1/2. Dividing by 2c^2 gives half the retained-energy mass increase, an unjustified kinetic/triangular-area factor."),
        check("c", "correct", "M*mean cw*(50 K) is the retained thermal energy for the explicitly added conditions, and Delta m0=Q/c^2. Units kg*J/(kg K)*K/(m^2/s^2)=kg. The general expression is valid without an invented numeric cw and respects retained system rest mass.")
      ]
    }
  }
];
const expectedHashes = {
  "n101/zh": "3280bca38356f8ee8c18e9a5d408bb1de61a937c065dffd14dfe7ed025af9937",
  "n101/en": "3693b1d22236a9e738e5a1cb3e643867bc267eb456962036c2617012d767c5fb",
  "t11/zh": "0a99d7df993a12a2caa76509c1181d5d7f94443d8ae3e1932522a1c4eb5acf58",
  "t11/en": "b2e3dfda60f97d372d08c675f76505cc4ae46a75c272432b763d8c2e193bfc86"
};
const snapshots = [];
for (const card of ["n101", "t11"]) {
  for (const language of ["zh", "en"]) {
    const draftPath = path.join(root, `.intentfold/tickets/STEMROBIN-181/tmp/d1289-n101-t11-first-choice/${card}/${language}/draft.json`);
    const bytes = fs.readFileSync(draftPath);
    const file_sha256 = sha(bytes);
    if (file_sha256 !== expectedHashes[`${card}/${language}`]) throw new Error("Draft changed after view inspection");
    const data = JSON.parse(bytes);
    const visible = data.questions.map(q => ({ id: q.id, source_numbers: q.source_numbers, view: q.view }));
    snapshots.push({
      card, language, draft_path: draftPath, file_sha256,
      visible_questions: visible,
      question_reviews: records.filter(r => r.card === card).map(({ card: ignored, ...record }) => record),
      bilingual_parity: "Manual semantic comparison of every stem and every option in zh and en found matching mode, identifiers, full option propositions, quantifiers, frame conventions, retained-energy assumptions, formulas, inequalities, kg and K units, and all 1, 50, 40000 and 323.15 values. English native source wording was checked only against approved d1277 text projections."
    });
  }
}
const gate = {
  schema: "s10y-choice-visible-independent-gate-FIRST-v1",
  checked_at: new Date().toISOString(),
  source_freeze_path: freezePath,
  source_freeze_file_sha256: sha(fs.readFileSync(freezePath)),
  review_order: ["Source solutions already frozen", "Task fidelity, redundancy and leakage assessed from visible views before option truth", "Every option solved and complete true sets recorded", "Author intent, rationales and keys NOT yet opened"],
  author_internals_seen: false,
  question_count: 14, option_count: 44,
  records: snapshots
};
fs.writeFileSync(path.join(out, "learner-visible-gate-FIRST.json"), `${JSON.stringify(gate, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ path: path.join(out, "learner-visible-gate-FIRST.json"), file_sha256: sha(fs.readFileSync(path.join(out, "learner-visible-gate-FIRST.json"))), questions: 14, options: 44, author_internals_seen: false }, null, 2));
