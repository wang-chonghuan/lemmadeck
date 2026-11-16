const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { after, test } = require("node:test");

const root = fs.mkdtempSync(path.join(os.tmpdir(), "s10y-display-"));
const book = path.join(root, "6a");
const lesson = path.join(book, "lessons", "display-fixture");
fs.mkdirSync(lesson, { recursive: true });
const title = "Function $y=ax^3$ <img src=x> & data";
const cases = [
  { number: "own", source_number: 646, text: "646. Evaluate $x^3$.", expected: "Evaluate " },
  { number: "whitespace", source_number: "646", text: "646.\t\nEvaluate $x^3$.", expected: "Evaluate " },
  { number: "null", source_number: null, text: "646. Keep this text.", expected: "646. Keep this text." },
  { number: "different", source_number: 646, text: "647. Keep this text.", expected: "647. Keep this text." },
  { number: "decimal", source_number: 646, text: "646.25 is data.", expected: "646.25 is data." },
  { number: "no-space", source_number: 646, text: "646.Evaluate.", expected: "646.Evaluate." },
  { number: "fullwidth", source_number: 646, text: "646\uFF0E Inspect.", expected: "Inspect." },
  { number: "fullwidth-attached", source_number: 646, text: "646\uFF0EInspect.", expected: "Inspect." },
  { number: "fullwidth-newline", source_number: 646, text: "646\uFF0E\nInspect.", expected: "Inspect." },
  { number: "fullwidth-chinese", source_number: 646, text: "646\uFF0E\u5229\u7528 $x^3$.", expected: "\u5229\u7528 " },
  { number: "fullwidth-null", source_number: null, text: "646\uFF0EInspect.", expected: "646\uFF0EInspect." },
  { number: "fullwidth-different", source_number: 646, text: "647\uFF0EInspect.", expected: "647\uFF0EInspect." },
  { number: "fullwidth-decimal", source_number: 646, text: "646\uFF0E25 is data.", expected: "646\uFF0E25 is data." },
  { number: "fullwidth-decimal-digits", source_number: 646, text: "646\uFF0E\uFF12\uFF15 is data.", expected: "646\uFF0E\uFF12\uFF15 is data." },
  { number: "leading-space", source_number: 646, text: " 646. Keep this text.", expected: " 646. Keep this text." },
  { number: "interior", source_number: 646, text: "Read 646. as data.", expected: "Read 646. as data." },
  { number: "prefix-only", source_number: 646, text: "646.", expected: "646." },
  { number: "646", text: "646. Legacy source number.", expected: "Legacy source number." },
  { number: "mapped", source_number: 645, text: "645. Mapped source number.", expected: "Mapped source number." },
];
fs.writeFileSync(path.join(lesson, "lesson.json"), JSON.stringify({
  title, chapter: "Chapter $y=ax^2$ <script> &", section: "Section $a\\ne0$", prose: [],
  start_printed: 181,
}));
fs.writeFileSync(path.join(lesson, "exercises.json"), JSON.stringify({
  count: cases.length, exercises: cases.map(({ expected, ...exercise }) => ({ ...exercise, figures: [] })),
}));
const result = spawnSync(process.execPath, [
  path.resolve(__dirname, "../tools/render_lesson.js"), book, "--out", path.join(root, "out"),
  "--lesson", "display-fixture",
], { encoding: "utf8" });
assert.equal(result.status, 0, result.stderr);
const text = fs.readFileSync(path.join(root, "out/display-fixture/text.html"), "utf8");
const exercises = fs.readFileSync(path.join(root, "out/display-fixture/exercises.html"), "utf8");
after(() => fs.rmSync(root, { recursive: true, force: true }));

test("visible headings and breadcrumbs typeset math while escaping ordinary markup", () => {
  for (const html of [text, exercises]) {
    const heading = html.match(/<h1>(.*?)<\/h1>/s)[1];
    const crumb = html.match(/<div class="crumb">(.*?)<\/div>/s)[1];
    assert.match(heading, /class="katex"/);
    assert.match(heading, /&lt;img src=x&gt; &amp; data/);
    assert.doesNotMatch(heading, /\$y=ax\^3\$|<img/);
    assert.equal((crumb.match(/class="katex"/g) || []).length, 2);
    assert.match(crumb, /&lt;script&gt; &amp;/);
    assert.doesNotMatch(crumb, /\$y=ax\^2\$|\$a\\ne0\$|<script/);
  }
});

test("document title stays escaped plain metadata", () => {
  for (const html of [text, exercises]) {
    const metadata = html.match(/<title>(.*?)<\/title>/s)[1];
    assert.match(metadata, /\$y=ax\^3\$ &lt;img src=x&gt; &amp; data/);
    assert.doesNotMatch(metadata, /class="katex"|<span|<img/);
  }
});

for (const fixture of cases) {
  test(`printed prefix: ${fixture.number}`, () => {
    const block = exercises.match(new RegExp(`<li class="ex" id="ex-${fixture.number}">(.*?)</li>`, "s"))[1];
    const body = block.match(/<div class="body">(.*?)<\/div>/s)[1];
    assert.ok(body.startsWith(fixture.expected), body);
    const printedNumber = Object.hasOwn(fixture, "source_number") ? fixture.source_number : fixture.number;
    const gutter = block.match(/<div class="no">(.*?)<\/div>/s)[1];
    assert.equal(gutter, printedNumber === null ? "" : `${printedNumber}.`);
    if (fixture.text.includes("$x^3$")) {
      assert.match(body, /class="katex"/);
      assert.match(body, /application\/x-tex">x\^3</);
      assert.ok(body.endsWith(".</span>"), body);
    } else {
      assert.equal(body, fixture.expected);
    }
  });
}
