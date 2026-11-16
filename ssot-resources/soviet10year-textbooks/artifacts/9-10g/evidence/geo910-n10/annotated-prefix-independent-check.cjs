const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");

const productionPath = path.resolve(
  __dirname,
  "../../../../.claude/skills/ld-s10y-lesson/tools/render_lesson.js",
);
const source = fs.readFileSync(productionPath, "utf8");
const startAnchor = "    const sourceNumber = printedNumber == null";
const endAnchor = '    out += `<li class="ex" id="ex-';
const start = source.indexOf(startAnchor);
const end = source.indexOf(endAnchor, start);
assert.ok(start >= 0 && end > start, "production prefix block must resolve");
assert.equal(source.indexOf(startAnchor, start + 1), -1);
assert.equal(source.indexOf(endAnchor, end + 1), -1);
const productionBlock = source.slice(start, end);

// Execute the real branch; identity inline exposes its label source, not KaTeX HTML.
const evaluate = vm.compileFunction(
  `${productionBlock}
return {
  accepted: Boolean(hasAnnotatedPrefix),
  number: hasAnnotatedPrefix ? annotatedPrefix[1] : null,
  mark: hasAnnotatedPrefix ? annotatedPrefix[2] : null,
  trailingStar: hasAnnotatedPrefix ? (annotatedPrefix[3] || "") : null,
  numberLabel,
  text,
};`,
  ["e", "printedNumber", "esc", "inline"],
  { filename: productionPath },
);

const body = "Body $x+1$.";
const cases = [];
const sourcePrefix = (form, number, mark, trailingStar, punctuation) =>
  form === "whole"
    ? `$${number}^{${mark}}$${trailingStar}${punctuation}`
    : `${number}$^{${mark}}$${trailingStar}${punctuation}`;

// Expectations are fixed from the supplied contract before any production call.
for (const form of ["whole", "split"]) {
  for (const mark of ["\\bullet", "\\circ", "*"]) {
    for (const punctuation of [".", "\uFF0E", "\u3002"]) {
      for (const trailingStar of ["", "*"]) {
        cases.push({
          id: `${form}/${mark}/${JSON.stringify(punctuation)}/outer-star=${Boolean(trailingStar)}`,
          category: "positive",
          printedNumber: "77",
          text: ` \t${sourcePrefix(form, "77", mark, trailingStar, punctuation)} \n${body}`,
          expected: {
            accepted: true,
            number: "77",
            mark,
            trailingStar,
            numberLabel: `$77^{${mark}}$${trailingStar}.`,
            text: body,
          },
        });
      }
    }
  }
}

for (const form of ["whole", "split"]) {
  cases.push({
    id: `actual-number-79/${form}/bullet/Chinese-period`,
    category: "positive",
    printedNumber: 79,
    text: `${sourcePrefix(form, "79", "\\bullet", "", "\u3002")} ${body}`,
    expected: {
      accepted: true,
      number: "79",
      mark: "\\bullet",
      trailingStar: "",
      numberLabel: "$79^{\\bullet}$.",
      text: body,
    },
  });
}

const negatives = [
  ["wrong-number/whole", "77", "$79^{\\bullet}$\u3002 Body $x+1$."],
  ["wrong-number/split", "77", "79$^{\\bullet}$\u3002 Body $x+1$."],
  ["wrong-number/ordinary", "77", "79. Body $x+1$."],
  ["strict-not-substring/whole", "77", "$177^{\\bullet}$\u3002 Body $x+1$."],
  ["strict-not-substring/split", "77", "177$^{\\bullet}$\u3002 Body $x+1$."],
  ["leading-zero/whole", "77", "$077^{\\bullet}$\u3002 Body $x+1$."],
  ["leading-zero/split", "77", "077$^{\\bullet}$\u3002 Body $x+1$."],
  ["missing-source-number/whole", null, "$77^{\\bullet}$\u3002 Body $x+1$."],
  ["missing-source-number/split", null, "77$^{\\bullet}$\u3002 Body $x+1$."],
  ["ordinary-numeric", "77", "77. Body $x+1$.", body],
  ["leading-formula", "77", "$x+1$ + $77^{\\bullet}$\u3002 Body $x+1$."],
  ["leading-numeric-formula", "77", "$77+1$ + $77^{\\bullet}$\u3002 Body $x+1$."],
  ["number-in-formula", "77", "$77x^{\\bullet}$\u3002 Body $x+1$."],
  ["noninitial-prefix", "77", "See $77^{\\bullet}$\u3002 Body $x+1$."],
  ["unsupported-mark/whole", "77", "$77^{\\dagger}$\u3002 Body $x+1$."],
  ["unsupported-mark/split", "77", "77$^{\\dagger}$\u3002 Body $x+1$."],
  ["missing-period/whole", "77", "$77^{\\bullet}$ Body $x+1$."],
  ["missing-period/split", "77", "77$^{\\bullet}$ Body $x+1$."],
  ["comma-is-not-period", "77", "$77^{\\bullet}$, Body $x+1$."],
  ["unbraced-superscript", "77", "$77^\\bullet$\u3002 Body $x+1$."],
  ["no-superscript", "77", "$77$\u3002 Body $x+1$."],
  ["literal-bullet-not-command", "77", "$77^{\u2022}$\u3002 Body $x+1$."],
  ["decimal-not-task-number", "77", "$77.5^{\\bullet}$\u3002 Body $x+1$."],
  ["ordinary-star-unchanged", "77", "77* Body $x+1$.", body, "77.*"],
];

for (const [id, printedNumber, text, remainingText, numberLabel] of negatives) {
  cases.push({
    id,
    category: "negative",
    printedNumber,
    text,
    expected: {
      accepted: false,
      number: null,
      mark: null,
      trailingStar: null,
      numberLabel: numberLabel ?? (printedNumber == null ? "" : `${printedNumber}.`),
      text: remainingText ?? text,
    },
  });
}

const failures = [];
for (const fixture of cases) {
  const actual = evaluate(
    { text: fixture.text },
    fixture.printedNumber,
    (text) => text,
    (text) => text,
  );
  for (const [field, expected] of Object.entries(fixture.expected)) {
    if (actual[field] !== expected) {
      failures.push({
        case: fixture.id,
        field,
        expected,
        actual: actual[field],
      });
    }
  }
}

const positive = cases.filter((fixture) => fixture.category === "positive").length;
const negative = cases.filter((fixture) => fixture.category === "negative").length;
console.log(JSON.stringify({
  scope: "production prefix branch only; no browser, suite, or answer review",
  production: productionPath,
  productionSha256: crypto.createHash("sha256").update(source).digest("hex"),
  firstProductionLine: source.slice(0, start).split("\n").length,
  cases: cases.length,
  positive,
  negative,
  status: failures.length ? "fail" : "pass",
  failures,
}, null, 2));
process.exitCode = failures.length ? 1 : 0;
