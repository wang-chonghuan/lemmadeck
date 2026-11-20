const fs = require("node:fs");
const crypto = require("node:crypto");
const path = require("node:path");

const root = process.cwd();
const scratch = path.join(root, ".intentfold/tickets/STEMROBIN-188/tmp/n43-choice-review");
const input = path.join(root, ".intentfold/tickets/STEMROBIN-188/tmp/n43-choice-author/draft.json");
if (!fs.existsSync(path.join(scratch, "FIRST-source.md"))) {
  throw new Error("Source-first evidence must exist before view disclosure");
}
const bytes = fs.readFileSync(input);
const rawSha = crypto.createHash("sha256").update(bytes).digest("hex");
if (rawSha !== "ef87d49b05a9cecac970a65e7f9a4e2348fec630184db37bac86b3e128a1c700") {
  throw new Error(`Unexpected draft snapshot: ${rawSha}`);
}
const draft = JSON.parse(bytes.toString("utf8"));
const views = draft.questions.map((question) => question.view);
const output = path.join(scratch, "views-only.json");
fs.writeFileSync(output, JSON.stringify(views, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify(views, null, 2));
