import fs from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { fileURLToPath } from "node:url";

const evidence = path.dirname(fileURLToPath(import.meta.url));
const complete = path.join(path.dirname(evidence), "d042-10p-n36-author/complete");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const raw = read(path.join(complete, "frozen/raw/lesson.json"));
const ledger = read(path.join(complete, "historical-bindings.json"));
const templates = Object.fromEntries(["zh", "en"].map((l) => [l, read(path.join(complete, `${l}/work/adapt/10p/modern-us-neutral/lessons/phy10-c1-s4-n36/lesson.template.json`))]));
const numericTokens = (s) => s.match(/\d+(?:\.\d+)?/g) || [];
const mathTokens = (s) => s.match(/\$[^$]+\$/g) || [];
const compact = (s) => s.replace(/\s+/g, "");
const entities = ledger.entities.map((e) => {
  const r = raw.prose[e.prose_index];
  const checks = {
    rawSourceTermPresent: r.text.includes(e.source_term),
    rawRefsEqual: isDeepStrictEqual(r.source_refs, e.source_refs),
    zhTermPresent: compact(templates.zh.prose[e.prose_index].text).includes(compact(e.zh)),
    enTermPresent: compact(templates.en.prose[e.prose_index].text).includes(compact(e.en)),
    contextRefsResolve: (e.context_refs || []).every((ref) => raw.prose.some((b) => b.source_refs.includes(ref))),
  };
  return { ...e, checks, passed: Object.values(checks).every(Boolean) };
});
const quantities = ledger.quantities.map((q) => {
  const r = raw.prose[q.prose_index];
  const checks = {
    rawQuantityPresent: r.text.includes(q.source),
    rawRefsEqual: isDeepStrictEqual(r.source_refs, q.source_refs),
    zhQuantityPresent: compact(templates.zh.prose[q.prose_index].text).includes(compact(q.zh)),
    enQuantityPresent: compact(templates.en.prose[q.prose_index].text).includes(compact(q.en)),
  };
  return { ...q, checks, passed: Object.values(checks).every(Boolean) };
});
const literals = raw.prose.map((r, i) => {
  const numbers = numericTokens(r.text), math = mathTokens(r.text);
  const checks = Object.fromEntries(["zh", "en"].map((l) => [l, isDeepStrictEqual(numbers, numericTokens(templates[l].prose[i].text)) && isDeepStrictEqual(math, mathTokens(templates[l].prose[i].text))]));
  return { blockIndex0: i, sourceRefs: r.source_refs, sourceNumbers: numbers, sourceMath: math, checks, passed: Object.values(checks).every(Boolean) };
});
const result = {
  schema: "ld-s10y-lesson/text-only-localization-binding-verification@1",
  card: raw.card_id,
  entities, quantities, literals,
  entityCount: entities.length, quantityCount: quantities.length, proseLiteralCheckCount: literals.length * 2,
  status: [...entities, ...quantities, ...literals].every((r) => r.passed) ? "PASS" : "FAIL",
  scope: "Literal source/translation presence and bound references only. Numeric words, historical attribution, contextual country identity and physical meaning were also reviewed manually in the sibling review report. The English native historical_entities arrays are empty; this evidence verifies the frozen bilingual ledger, not nonexistent native declarations.",
  imagesOpened: 0,
};
fs.writeFileSync(path.join(evidence, "localization-bindings.json"), JSON.stringify(result, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({ status: result.status, entityCount: result.entityCount, quantityCount: result.quantityCount, proseLiteralCheckCount: result.proseLiteralCheckCount, failures: [...entities, ...quantities, ...literals].filter((r) => !r.passed) }, null, 2));
if (result.status !== "PASS") process.exitCode = 1;
