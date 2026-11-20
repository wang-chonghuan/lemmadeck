import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const cwd = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
if (process.cwd() !== cwd) throw new Error("Wrong cwd");
const own = path.join(cwd, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d138-t9-semantic-review");
const author = path.join(cwd, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d138-t9-choice-author");
const hash = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const sorted = value => Array.isArray(value) ? value.map(sorted) :
  value !== null && typeof value === "object" ?
    Object.fromEntries(Object.keys(value).sort().map(key => [key, sorted(value[key])])) : value;
const canonical = value => JSON.stringify(sorted(value))
  .replace(/[\u007f-\uffff]/g, char => "\\u" + char.charCodeAt(0).toString(16).padStart(4, "0"));
const binding = file => {
  const bytes = fs.readFileSync(file);
  return {path: file, bytes: bytes.length, sha256: hash(bytes)};
};
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const source = path.join(own, "source-first-solutions.json");
if (!fs.existsSync(source)) throw new Error("Source-first solution missing");
for (const name of ["author-freeze.json", "answers-author-freeze.json"]) {
  if (!fs.existsSync(path.join(author, name))) throw new Error("Both author freezes required");
}
const seedPath = path.join(cwd, ".tmp/STEMROBIN-181/d1816-d138/choice-repo/.tmp/d138/seed.json");
const output = {
  stage: "visible-only-projection-after-source-first-and-both-freezes",
  sourceFirst: binding(source),
  seed: {...binding(seedPath), canonicalSha256: hash(canonical(read(seedPath)))},
  authorFreezes: ["author-freeze.json", "answers-author-freeze.json"].map(name => binding(path.join(author, name))),
  locales: {}
};
for (const locale of ["zh", "en"]) {
  const file = path.join(author, `draft.${locale}.json`);
  const draft = read(file);
  output.locales[locale] = {
    draftBinding: {...binding(file), canonicalSha256: hash(canonical(draft))},
    newFigureCount: draft.new_figures.length,
    questions: draft.questions.map(question => ({
      id: question.id,
      view: {
        mode: question.view.mode,
        stem: question.view.stem,
        figure_ids: question.view.figure_ids,
        options: question.view.options.map(option => ({
          id: option.id, text: option.text, figure_ids: option.figure_ids
        }))
      }
    }))
  };
}
const destination = path.join(own, "visible-only.json");
fs.writeFileSync(destination, JSON.stringify(output, null, 2) + "\n", {flag: "wx"});
console.log(JSON.stringify({output: binding(destination), stage: output.stage}));
