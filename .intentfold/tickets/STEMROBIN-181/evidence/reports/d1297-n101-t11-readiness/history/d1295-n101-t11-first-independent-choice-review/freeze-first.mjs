import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const out = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d1295-n101-t11-first-independent-choice-review");
if (process.cwd() !== root) throw new Error("Wrong cwd");
const sha = value => crypto.createHash("sha256").update(value).digest("hex");
const canonical = value => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.keys(value).sort().map(k => `${canonical(k)}:${canonical(value[k])}`).join(",")}}`;
  }
  return JSON.stringify(value).replace(/[\u007f-\uffff]/g, c => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
};
const read = relative => {
  const file = path.join(root, relative);
  const bytes = fs.readFileSync(file);
  return { path: file, file_sha256: sha(bytes), data: JSON.parse(bytes) };
};
const bindText = (record, selector, text) => ({
  path: record.path, file_sha256: record.file_sha256, selector,
  text, text_sha256: sha(text)
});
const seeds = ["n101", "t11"].map(card => {
  const record = read(`.intentfold/tickets/STEMROBIN-181/tmp/d1289-n101-t11-first-choice/${card}/seed.json`);
  if (record.data.figures.length || record.data.exercises.some(e => e.figure_ids.length)) throw new Error("Unexpected figures");
  return {
    card, path: record.path, file_sha256: record.file_sha256,
    canonical_sha256: sha(canonical(record.data)),
    source_text_bindings: record.data.exercises.map((e, i) => bindText(record, `exercises[${i}].text`, e.text)),
    selected_concept_text_bindings: record.data.concepts.map((c, i) => bindText(record, `concepts[${i}].text (block ${c.block})`, c.text))
  };
});
const concepts = [];
const n101 = read("ssot-resources/soviet10year-textbooks/artifacts/10p/editions/modern-us-neutral/lessons/phy10-c2-s4-n101/lesson.json");
for (const [i, block] of n101.data.prose.entries()) concepts.push(bindText(n101, `prose[${i}].text`, block.text));
const n95 = read("ssot-resources/soviet10year-textbooks/artifacts/10p/editions/modern-us-neutral/lessons/phy10-c2-s4-n95/lesson.json");
concepts.push(bindText(n95, "prose[2].text", n95.data.prose[2].text));
for (const language of ["zh", "en"]) {
  const n97 = read(`.intentfold/tickets/STEMROBIN-181/tmp/d1218-n97-rigid-rod-affected-repair/${language}/lesson.template.json`);
  for (const i of [19, 21]) concepts.push(bindText(n97, `prose[${i}].text`, n97.data.prose[i].text));
}
const english = [];
for (const card of ["n101", "t11"]) {
  const base = `.intentfold/tickets/STEMROBIN-181/tmp/d1277-n101-t11-first-native/${card}/en/artifacts/10p/editions/modern-us-neutral/lessons/phy10-c2-s4-${card}`;
  for (const name of ["lesson.json", "exercises.json"]) {
    const record = read(`${base}/${name}`);
    const blocks = name === "lesson.json" ? record.data.prose : record.data.exercises;
    english.push({
      path: record.path, file_sha256: record.file_sha256,
      text_bindings: blocks.map((b, i) => bindText(record, `${name === "lesson.json" ? "prose" : "exercises"}[${i}].text`, b.text))
    });
  }
}
const solutions = [
  {
    card: "n101", source_number: "1",
    independent_solution: "For an object with positive invariant rest mass m0 and speed 0 <= v < c, the source's historical relativistic mass is m = gamma m0 = m0/sqrt(1-v^2/c^2). At v=0, m=m0. For 0<v<c, m>m0 and grows with speed. This is not a claim that the object's invariant rest mass changes merely through bulk motion.",
    required_tasks: ["State the mass-speed formula", "Distinguish historical relativistic mass from invariant rest mass"],
    written_production_loss_to_check: "Recognizing a complete formula does not establish unaided formula recall or writing."
  },
  {
    card: "n101", source_number: "2",
    independent_solution: "In a chosen inertial frame the source defines historical relativistic mass by m=E/c^2, so total energy E=mc^2=gamma m0 c^2. For the same system in the same frame, Delta m=Delta E/c^2. If the system is at rest before and after, these are changes in rest energy and invariant system mass. Increasing bulk speed at fixed internal state increases E and historical m, not invariant m0. A same-matter system at rest that retains heat has increased internal/rest energy and therefore increased invariant system mass; individual molecules do not acquire larger invariant rest mass merely by moving faster.",
    required_tasks: ["State the mass-energy relation", "Use total energy and the historical mass convention", "Qualify invariant-mass changes by system rest and retained internal energy"],
    written_production_loss_to_check: "Selecting a statement does not establish independently worded explanation or derivation."
  },
  {
    card: "n101", source_number: "3",
    independent_solution: "Rest energy is the total energy of the object in its own rest frame, where its bulk speed is zero. E0=m0 c^2 is nonzero for m0>0 even though its bulk kinetic energy is zero. At any speed the kinetic energy relative to the chosen frame is K=E-E0=(gamma-1)m0 c^2. Internal energy is part of rest energy; zero bulk speed does not imply zero total energy.",
    required_tasks: ["Define rest energy", "Give E0=m0 c^2", "Separate zero kinetic energy from nonzero rest energy"],
    written_production_loss_to_check: "Choice cannot demonstrate unaided definition writing."
  },
  {
    card: "n101", source_number: "4",
    independent_solution: "For the same body and retained matter at rest before and after, retained heat Q increases the body's rest energy by Q (with no other energy transfer), giving Delta m=Q/c^2>0. The coefficient 1/c^2 is tiny: using c about 3e8 m/s, one joule corresponds to about 1.11e-17 kg. Ordinary heating therefore gives a mass increase below the experimental resolution discussed by the historical source. The change is real, not zero, and the source does not assert measurement impossibility in every era. Matter loss, escaping heat, work or other energy transfer must not be silently included in Q retained.",
    required_tasks: ["Explain small but positive mass increase", "Connect magnitude to the tiny coefficient and ordinary heating energy", "Keep the historical measurement-capability qualifier"],
    written_production_loss_to_check: "Choice demonstrates discrimination of explanations rather than independent explanatory production."
  },
  {
    card: "t11", source_number: "1",
    independent_solution: "Let K be the ground frame and K' the train frame, moving at V>0 along +x relative to K. A is forward and B rearward, so Delta x'=x'A-x'B>0. Synchronized local train clocks assign Delta t'=t'A-t'B=0 to the two strike events. Inverse Lorentz transformation gives Delta t=gammaV(Delta t'+V Delta x'/c^2)=gammaV V Delta x'/c^2>0. Therefore B strikes earlier on the ground and A later. Equivalently Delta t=V Delta x/c^2 with Delta x>0 for these events. This compares event times, not receipt times of flashes; a receiving observer's unspecified position cannot determine event order.",
    required_tasks: ["Determine ground event order B before A", "Preserve forward/backward orientation", "Distinguish synchronized local event clocks from light-arrival observations"],
    written_production_loss_to_check: "Choice can recognize a time-order argument without producing it unaided."
  },
  {
    card: "t11", source_number: "2",
    independent_solution: "The given mass ratio is gamma=m/m0=40000, not an invariant-mass increase. Squaring the defining relation yields 1-v^2/c^2=1/40000^2=1/1600000000=6.25e-10. Thus v=c sqrt(1-1/40000^2), beta=0.999999999687499999951171875...<1. To avoid catastrophic subtraction, 1-beta=(1/40000^2)/(1+sqrt(1-1/40000^2))=3.12500000048828125e-10 approximately. With the optional rounded c=3e8 m/s, c-v=0.09375000001464844 m/s and v about 299999999.90625 m/s. v may round to c at coarse precision, but it is never equal to c for finite gamma.",
    required_tasks: ["Invert the gamma-speed relation", "Preserve the square of 40000", "Retain strict subluminality and adequate precision"],
    written_production_loss_to_check: "Recognizing an expression does not prove independently performing the inversion or cancellation-stable calculation."
  },
  {
    card: "t11", source_number: "3",
    independent_solution: "The source gives water mass M=1 kg and temperature rise Delta T=50 deg C=50 K but no numerical specific heat or light-speed convention. For the same water at rest before and after, no matter loss, no phase change, and retained supplied heat with negligible other energy transfers, Delta m=Qret/c^2. For constant specific heat cw in J/(kg K), Qret=M cw Delta T and Delta m=(1 kg) cw (50 K)/c^2. More generally for temperature-dependent specific heat Delta m=M integral(Ti to Ti+50K) cw(T) dT /c^2, subject to the same retained-energy convention. A unique high-precision numerical mass gain is not determined from the source alone. If optional standard classroom constants cw=4200 J/(kg K), c=3e8 m/s are explicitly supplied, Q=210000 J and Delta m=2.333333333333333e-12 kg=2.333333333333333e-9 g (about 2.3e-12 kg at two significant figures). These constants and physical assumptions must be declared additions, never alleged seed data.",
    required_tasks: ["Compute retained thermal energy from mass and temperature rise", "Divide retained energy by c squared", "Respect kg/g conversion and temperature-difference units", "Separate a general answer from optional added constants"],
    written_production_loss_to_check: "Choice cannot establish independent heat-capacity selection, algebraic production or significant-figure reasoning."
  }
];
const freeze = {
  schema: "s10y-choice-independent-solutions-FIRST-v1",
  ticket: "STEMROBIN-181",
  review_round: 1,
  reviewer: { kind: "independent_agent", identity: "Codex reviewer in user-designated d1295 scope; not the d1289 author" },
  cwd: root,
  frozen_at: new Date().toISOString(),
  phase: "FIRST: seven full source solutions frozen before opening any author solution, draft, key, report or conclusion",
  source_count: 7,
  seeds, concept_authority_text_bindings: concepts,
  english_prompt_prose_authority: english,
  authority_limits: "Concept authority only: current canonical n101 prose.text, current canonical n95 prose[2].text, approved d1218 n97 zh/en prose[19,21].text. English prompt/prose only from the four explicitly approved d1277 edition JSON files. No solved examples used as definitions.",
  images: { source_figures: 0, images_opened: 0, observation: "Both seeds contain figures=[] and every source has figure_ids=[]; no actual figure exists to inspect." },
  exposure_before_freeze: { author_source_solutions: false, drafts: false, keys: false, report_conclusions: false, historical_answer_keys: false },
  solutions
};
fs.writeFileSync(path.join(out, "independent-solutions-FIRST.json"), `${JSON.stringify(freeze, null, 2)}\n`, { flag: "wx" });
const bytes = fs.readFileSync(path.join(out, "independent-solutions-FIRST.json"));
fs.mkdirSync(path.join(out, "receipts"), { recursive: true });
const receipt = {
  path: path.join(out, "independent-solutions-FIRST.json"),
  file_sha256: sha(bytes), canonical_sha256: sha(canonical(freeze)),
  completed_at: new Date().toISOString(), source_count: 7, images: 0,
  no_author_material_opened_before_freeze: true,
  first_execution_failure: {
    kind: "directory inventory",
    command: "rg --files .agents/skills/ld-s10y-choice .intentfold/tickets/STEMROBIN-181/tmp/d1289-n101-t11-first-choice .intentfold/tickets/STEMROBIN-181/tmp/d1218-n97-rigid-rod-affected-repair .intentfold/tickets/STEMROBIN-181/tmp/d1277-n101-t11-first-native .intentfold/tickets/STEMROBIN-181/tmp/d1295-n101-t11-first-independent-choice-review",
    exit_code: 2,
    stderr: "rg: .intentfold/tickets/STEMROBIN-181/tmp/d1295-n101-t11-first-independent-choice-review: No such file or directory (os error 2)",
    recovery: "Created only the user-owned d1295 directory through apply_patch; no source was altered or re-solved."
  }
};
fs.writeFileSync(path.join(out, "receipts/independent-freeze-FIRST.json"), `${JSON.stringify(receipt, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify(receipt, null, 2));
