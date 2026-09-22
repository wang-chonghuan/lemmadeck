const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")
const {
  inline,
  proseInline,
  proseParagraphs,
  proseOutline,
  sectionBreakIndices,
  proseFlow,
} = require("../tools/htmlfrag.js")
const { lessonOrderMap, publicationPlan, tocCardIds } = require("../tools/lesson_order.js")
const {
  preserveExerciseMetadata,
  sourceNumberForArtifact,
} = require("../tools/publish_merge.js")

const repo = path.resolve(__dirname, "../../../..")

const html = inline("题目：\n1) $x+1$；\n2) $x+2$.")
assert.match(html, /题目：<br>1\)/)
assert.match(html, /；<br>2\)/)

const proseHtml = proseInline("当 a=8 时，值为 72，且 $a+1=9$。")
assert.match(proseHtml, /当 <span class="sr-prose-math">a<\/span>=<span class="sr-prose-math">8<\/span>/)
assert.match(proseHtml, /值为 <span class="sr-prose-math">72<\/span>/)
assert.equal((proseHtml.match(/sr-prose-math/g) ?? []).length, 3)

assert.deepEqual(
  proseParagraphs("第一句。\n第二句。\n\n第三句。"),
  ["第一句。\n第二句。", "第三句。"],
)

assert.deepEqual(
  proseFlow([
    { kind: "p", text: "第一段。\n\n第二段。" },
    { kind: "p", text: "第三段。" },
  ], [1, 2]),
  [
    { kind: "p", text: "第一段。" },
    { kind: "p", text: "第二段。", sectionBreak: true },
    { kind: "p", text: "第三段。", sectionBreak: true },
  ],
)

const semanticProse = [
  { kind: "p", text: "定义说明。\n\n例：\n1) 第一项；\n2) 第二项。" },
  { kind: "p", text: "由 $a=b$，\n所以 $a+c=b+c$。" },
]
assert.deepEqual(
  proseOutline(semanticProse).map(({ index, text }) => ({ index, text })),
  [
    { index: 0, text: "定义说明。" },
    { index: 1, text: "例：\n1) 第一项；\n2) 第二项。" },
    { index: 2, text: "由 $a=b$，\n所以 $a+c=b+c$。" },
  ],
)
const semanticBreak = [{
  before: "定义说明。",
  after: "例：\n1) 第一项；\n2) 第二项。",
}]
assert.deepEqual(sectionBreakIndices(semanticProse, semanticBreak), [1])
assert.equal(proseFlow(semanticProse, semanticBreak)[1].sectionBreak, true)
assert.throws(
  () => sectionBreakIndices(semanticProse, [{
    before: "定义说明。",
    after: "由 $a=b$，\n所以 $a+c=b+c$。",
  }]),
  /exactly one adjacent paragraph pair/,
)

const appCss = fs.readFileSync(path.join(repo, "app/src/styles/app.css"), "utf8")
assert.match(
  appCss,
  /\.sr-read \.katex,\s*\.sr-prose-math\s*\{\s*font-size:\s*1\.1em;\s*\}/,
)
assert.match(
  appCss,
  /\.sr-prose-math\s*\{\s*font-family:\s*"KaTeX_Main",\s*serif;\s*\}/,
)
assert.match(
  appCss,
  /\.sr-read-p\s*\{[^}]*text-indent:\s*0;[^}]*\}/s,
)
assert.match(
  appCss,
  /\.sr-read-p\.sr-read-section\s*\{[^}]*border-top:\s*1px solid var\(--sr-line\);[^}]*\}/s,
)

const offlineRenderer = fs.readFileSync(
  path.join(repo, ".claude/skills/ld-s10y-lesson/tools/render_lesson.js"),
  "utf8",
)
const publisher = fs.readFileSync(
  path.join(repo, ".claude/skills/ld-s10y-lesson/tools/publish.mjs"),
  "utf8",
)
assert.doesNotMatch(
  publisher,
  /["'](?:EASYAPP_DATABASE_URL|DATABASE_URL)["']/,
)
assert.match(
  offlineRenderer,
  /p\.para \.katex,\.prose-math\{font-size:1\.1em\}/,
)
assert.match(
  offlineRenderer,
  /\.prose-math\{font-family:KaTeX_Main,serif\}/,
)
assert.match(
  offlineRenderer,
  /p\.para\{[^}]*text-indent:0;[^}]*\}/s,
)
assert.match(
  offlineRenderer,
  /p\.para\.section\{border-top:1px solid var\(--rule\);[^}]*\}/,
)

const answerKey = { grading: "auto", parts: [{ expected: ["8"] }] }
const interaction = { widget: "math", parts: [{}] }
assert.deepEqual(
  preserveExerciseMetadata(
    [{ number: "1", html: "new" }, { number: "2", html: "new" }],
    {
      edition: "modern-us-neutral",
      exercises: [
        { number: 1, answerKey, interaction },
        { number: 3, answerKey: { grading: "ungraded" } },
      ],
    },
    "modern-us-neutral",
  ),
  [
    { number: "1", html: "new", answerKey, interaction },
    { number: "2", html: "new" },
  ],
)
assert.deepEqual(
  preserveExerciseMetadata(
    [{ number: "1", html: "new" }],
    {
      edition: "another-edition",
      exercises: [{ number: "1", answerKey, interaction }],
    },
    "modern-us-neutral",
  ),
  [{ number: "1", html: "new" }],
)
assert.equal(sourceNumberForArtifact({ number: "14" }), "14")
assert.equal(sourceNumberForArtifact({ number: "q1", source_number: null }), null)
assert.equal(sourceNumberForArtifact({ number: "g2-1", source_number: "1" }), "1")

assert.deepEqual(
  [...lessonOrderMap({
    lessons: [
      { id: "alg6-c1-s1-n1", number: "1" },
      { id: "alg6-c1-ex", number: null },
      { id: "alg6-c2-s1-n2", number: "2" },
    ],
  }).entries()],
  [
    ["alg6-c1-s1-n1", 1],
    ["alg6-c1-ex", 2],
    ["alg6-c2-s1-n2", 3],
  ],
)

const toc = {
  subject: "algebra",
  grade: 6,
  contents: [
    {
      id: "alg6-c1",
      kind: "chapter",
      lessons: [
        {
          id: "alg6-c1-s1",
          kind: "section",
          topics: [
            { id: "alg6-c1-s1-n1", printedNumber: 1 },
            { id: "alg6-c1-s1-n2", printedNumber: 2 },
          ],
        },
        { id: "alg6-c1-ex", kind: "exercises" },
      ],
    },
    {
      id: "alg6-c2",
      kind: "chapter",
      lessons: [
        {
          id: "alg6-c2-s1",
          kind: "section",
          topics: [{ id: "alg6-c2-s1-n3", printedNumber: 3 }],
        },
      ],
    },
  ],
}
assert.deepEqual(tocCardIds(toc), [
  "alg6-c1-s1-n1",
  "alg6-c1-s1-n2",
  "alg6-c1-ex",
  "alg6-c2-s1-n3",
])
assert.deepEqual(tocCardIds({
  contents: [{
    id: "phy6-c2",
    kind: "chapter",
    lessons: [{
      id: "phy6-c2-s4",
      topics: [{ id: "phy6-c2-s4-t1", printedNumber: null }],
    }],
  }],
}), [
  "phy6-c2-s4",
  "phy6-c2-s4-t1",
])
assert.deepEqual(
  [...publicationPlan(toc).orders.entries()],
  [
    ["alg6-c1-s1-n1", 1001],
    ["alg6-c1-s1-n2", 1002],
    ["alg6-c1-ex", 1003],
    ["alg6-c2-s1-n3", 1004],
  ],
)
assert.deepEqual(
  { subject: publicationPlan(toc).subject, stage: publicationPlan(toc).stage },
  { subject: "math", stage: 6 },
)
