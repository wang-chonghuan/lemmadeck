const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { test } = require("node:test");

test("offline exercise numbers consume the whole matching circle prefix", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "s10y-render-prefix-"));
  try {
    const book = path.join(root, "book");
    const lesson = path.join(book, "lessons", "fixture");
    fs.mkdirSync(lesson, { recursive: true });
    const cases = [
      { number: 159, text: "159\u00b0. BODY_A", circle: true, body: "BODY_A" },
      { number: 164, text: "164\u00b0\uFF0E BODY_B", circle: true, body: "BODY_B" },
      { number: 165, text: "165\u00b0\u3002 BODY_C", circle: true, body: "BODY_C" },
      { number: 169, text: "169\u00b0 BODY_D", circle: true, body: "BODY_D" },
      { number: 170, text: " \t170\u00b0.\nBODY_E", circle: true, body: "BODY_E" },
      { number: 171, text: "172\u00b0. BODY_F", circle: false, body: "172\u00b0. BODY_F" },
      { number: 173, source_number: null, text: "173\u00b0. BODY_G", circle: false, body: "173\u00b0. BODY_G" },
      { number: 174, text: "174. BODY_H", circle: false, body: "BODY_H" },
      { number: 175, text: "175* BODY_I", circle: false, body: "BODY_I" },
      { number: 176, text: "$176^{\\circ}$. BODY_J", circle: true, body: "BODY_J" },
      { number: 177, text: "177$^{\\bullet}$. BODY_K", circle: false, body: "BODY_K" },
      { number: 441, text: "441\uFF0E BODY_L", circle: false, body: "BODY_L" },
      { number: 442, text: "442\u3002 BODY_M", circle: false, body: "BODY_M" },
      { number: 443, text: "444\uFF0E BODY_N", circle: false, body: "444\uFF0E BODY_N" },
    ];
    fs.writeFileSync(path.join(lesson, "lesson.json"), JSON.stringify({
      title: "Fixture", prose: [], section_breaks: [],
    }));
    fs.writeFileSync(path.join(lesson, "exercises.json"), JSON.stringify({
      count: cases.length,
      exercises: cases.map(({ number, text, source_number }) => ({
        number: String(number), text, figures: [],
        ...(source_number === null ? { source_number: null } : {}),
      })),
    }));
    const output = path.join(root, "output");
    const result = spawnSync(process.execPath, [
      path.join(__dirname, "render_lesson.js"), book, "--out", output,
    ], { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    const html = fs.readFileSync(path.join(output, "fixture", "exercises.html"), "utf8");
    assert(!html.includes("katex-error"));
    const rows = [...html.matchAll(/<li class="ex"[^>]*><div class="no">([\s\S]*?)<\/div><div class="body">([\s\S]*?)<\/div><\/li>/g)];
    assert.equal(rows.length, cases.length);
    for (const [index, fixture] of cases.entries()) {
      assert.equal(rows[index][2], fixture.body);
      if (fixture.circle) {
        assert(rows[index][1].includes(`<mn>${fixture.number}</mn>`));
        assert(rows[index][1].includes("\\circ"));
        assert(rows[index][1].endsWith(".</span>"));
      }
    }
    assert.equal(rows[5][1], "171.");
    assert.equal(rows[6][1], "");
    assert.equal(rows[7][1], "174.");
    assert.equal(rows[8][1], "175.*");
    assert(rows[10][1].includes("\\bullet"));
    assert.equal(rows[11][1], "441.");
    assert.equal(rows[12][1], "442.");
    assert.equal(rows[13][1], "443.");
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("offline captions stay with their uniquely identified figure", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "s10y-render-caption-"));
  try {
    const book = path.join(root, "book");
    fs.mkdirSync(path.join(book, "figures"), { recursive: true });
    for (const id of ["one", "two"]) {
      fs.writeFileSync(path.join(book, "figures", `${id}.svg`),
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text>${id}</text></svg>`);
    }
    const p = (text) => ({ kind: "p", text });
    const fig = (id, label) => ({ kind: "fig", id, label, text: "" });
    const cap = (label, text) => ({ kind: "cap", label, text });
    const cases = [
      {
        id: "separated",
        prose: [fig("one", "Figure 75"), p("FIRST"), p("SECOND"), cap("Figure 75", "CAP75")],
        bound: 1, standalone: 0,
      },
      {
        id: "adjacent",
        prose: [fig("one", "Figure 75"), cap("Figure 75", "CAP75")],
        bound: 1, standalone: 0,
      },
      {
        id: "reversed-captions",
        prose: [fig("one", "Figure 75"), fig("two", "Figure 76"),
          cap("Figure 76", "CAP76"), cap("Figure 75", "CAP75")],
        bound: 2, standalone: 0,
      },
      {
        id: "duplicate-figure-label",
        prose: [fig("one", "Figure 75"), fig("two", "Figure 75"), cap("Figure 75", "CAP75")],
        bound: 0, standalone: 1,
      },
      {
        id: "duplicate-caption-label",
        prose: [fig("one", "Figure 75"), cap("Figure 75", "CAP75"), cap("Figure 75", "OTHER")],
        bound: 0, standalone: 2,
      },
      {
        id: "unmatched-and-unlabelled",
        prose: [fig("one", "Figure 75"), cap("Figure 76", "CAP76"), cap(null, "UNLABELLED")],
        bound: 0, standalone: 2,
      },
    ];
    for (const fixture of cases) {
      const lesson = path.join(book, "lessons", fixture.id);
      fs.mkdirSync(lesson, { recursive: true });
      fs.writeFileSync(path.join(lesson, "lesson.json"), JSON.stringify({
        title: "Fixture", prose: fixture.prose, section_breaks: [],
      }));
      fs.writeFileSync(path.join(lesson, "exercises.json"), JSON.stringify({ count: 0, exercises: [] }));
    }
    const output = path.join(root, "output");
    const result = spawnSync(process.execPath, [
      path.join(__dirname, "render_lesson.js"), book, "--out", output,
    ], { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    for (const fixture of cases) {
      const html = fs.readFileSync(path.join(output, fixture.id, "text.html"), "utf8");
      assert.equal((html.match(/<figcaption class="figcap">/g) || []).length, fixture.bound, fixture.id);
      assert.equal((html.match(/<div class="figcap">/g) || []).length, fixture.standalone, fixture.id);
      assert.equal((html.match(/<p class="para">/g) || []).length,
        fixture.prose.filter((block) => block.kind === "p").length, fixture.id);
      for (const match of html.matchAll(/<figure\b[^>]*id="(one|two)"[\s\S]*?<\/figure>/g)) {
        if (!fixture.bound) {
          assert(!match[0].includes("<figcaption"), fixture.id);
          continue;
        }
        const expected = match[1] === "one" ? "CAP75" : "CAP76";
        assert(match[0].endsWith(`<figcaption class="figcap"><span class="prose-math">${expected}</span></figcaption></figure>`),
          fixture.id);
      }
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
