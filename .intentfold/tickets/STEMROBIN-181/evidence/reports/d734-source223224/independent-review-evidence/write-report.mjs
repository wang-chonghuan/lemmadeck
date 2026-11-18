import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
assert.equal(process.cwd(), repo);
const own = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d718-source223224-first-review");
const tmp = path.dirname(own);
const snapshotPath = path.join(own, "file-bindings.json");
const snapshot = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));
const files = snapshot.files;
const hash = bytes => createHash("sha256").update(bytes).digest("hex");

// Bind judgments to the already-previewed bytes; never regenerate a native stage.
for (const entry of Object.values(files)) {
  assert.equal(hash(fs.readFileSync(entry.path)), entry.sha256, `Input changed during review: ${entry.path}`);
}
function bind(id, filename, purpose) {
  const bytes = fs.readFileSync(filename);
  files[id] = { path: filename, sha256: hash(bytes), bytes: bytes.length, purpose };
}
bind("first_author_0223_md", path.join(tmp, "d716-source223224-first-author/root/10p/pages/0223/page.md"), "Historical failed page; read only to identify notation-only continuation");
bind("first_author_code", path.join(tmp, "d716-source223224-first-author/author-once.mjs"), "Original page224 template remained in this author script after page223 stopped");
bind("continuation_code", path.join(tmp, "d717-source223224-native-continuation/continue-once.mjs"), "Historical continuation implementation, not executed");
bind("binding_snapshot", snapshotPath, "Pre-SVG-open file hash snapshot");
bind("preview_code", path.join(own, "preview-svg.mjs"), "Review-only preview code");
bind("report_code", path.join(own, "write-report.mjs"), "Review-only report authoring and hash binding code");

const body = text => text.slice(text.indexOf("<!--"));
const old223 = body(fs.readFileSync(files.first_author_0223_md.path, "utf8"));
const new223 = body(fs.readFileSync(files["0223_page.md"].path, "utf8"));
assert.equal(old223.replace("彩图\u2160", "彩图 I").replace("彩图\u2161", "彩图 II"), new223);

const receipt = id => JSON.parse(fs.readFileSync(files[id].path, "utf8"));
const firstFailure = receipt("first_failure_receipt");
assert.equal(firstFailure.exitCode, 1);
assert.ok(firstFailure.stdout.includes("Ⅰ(U+2160), Ⅱ(U+2161)"));
const candidateSummary = receipt("candidate_report");
for (const entry of candidateSummary.files) {
  assert.equal(hash(fs.readFileSync(path.join(repo, entry.path))), entry.sha256);
}
const native = [];
for (const page of ["0223", "0224"]) {
  const json = receipt(`${page}_page.json`);
  const audit = receipt(`${page}_audit.json`);
  assert.equal(json.meta.render.sha256, files[`${page}_source`].sha256);
  assert.equal(audit.lines_printed, 26);
  assert.equal(audit.lines_md, 26);
  for (const stage of ["finalize", "vectorize"]) {
    const saved = receipt(`${page}_${stage}`);
    assert.equal(saved.exitCode, 0);
    native.push({
      page: Number(page),
      stage,
      status: "PASS_REUSED",
      rerun: false,
      receipt: files[`${page}_${stage}`],
      stdout: saved.stdout,
      ...(stage === "finalize" ? { linesPrinted: audit.lines_printed, linesMd: audit.lines_md } : {}),
    });
  }
}

const findings = [
  {
    id: "223-SOURCE-01",
    page: 223,
    layer: "SOURCE",
    severity: "P2",
    kind: "literal-punctuation-substitution",
    source: files["0223_source"],
    location: { paragraph: 2, paragraphPrintedLine: 8, candidateMarkdownLine: 78, candidateBlockIndex0: 4 },
    sourceExcerpt: "那末又会获得白光（彩图Ⅱ），分解出来的光谱",
    expectedCandidateExcerpt: "那末又会获得白光（彩图 II），分解出来的光谱",
    actualCandidateExcerpt: "那末又会获得白光（彩图 II）. 分解出来的光谱",
    affectedFiles: [files["0223_page.md"], files["0223_page.json"]],
    reason: "The source comma after plate II became a full stop. Period-glyph or Roman-glyph normalization does not authorize changing a comma into a sentence boundary.",
    requestedCorrection: "Restore the comma after the existing plate II reference in a separately authorized candidate repair; no science or plate content change.",
  },
  {
    id: "224-SOURCE-01",
    page: 224,
    layer: "SOURCE",
    severity: "P2",
    kind: "literal-wording-substitution",
    source: files["0224_source"],
    location: { paragraph: 4, paragraphPrintedLine: 3, candidateMarkdownLine: 79, candidateBlockIndex0: 5 },
    sourceExcerpt: "那么它就呈白色",
    expectedCandidateExcerpt: "那么它就呈白色",
    actualCandidateExcerpt: "那么它就是白色",
    affectedFiles: [files["0224_page.md"], files["0224_page.json"]],
    reason: "The printed verb 呈 is replaced by 是. Even a near-equivalent paraphrase is not literal source transcription.",
    requestedCorrection: "Restore 呈 in a separately authorized candidate repair.",
  },
  {
    id: "224-SOURCE-02",
    page: 224,
    layer: "SOURCE",
    severity: "P2",
    kind: "literal-wording-insertion",
    source: files["0224_source"],
    location: { paragraph: 4, paragraphPrintedLine: 7, candidateMarkdownLine: 83, candidateBlockIndex0: 5 },
    sourceExcerpt: "入射到它那里的太阳光线",
    expectedCandidateExcerpt: "入射到它那里的太阳光线",
    actualCandidateExcerpt: "入射到它那里去的太阳光线",
    affectedFiles: [files["0224_page.md"], files["0224_page.json"]],
    reason: "The candidate inserts 去 after 那里; the source does not contain that character.",
    requestedCorrection: "Remove the inserted 去 in a separately authorized candidate repair.",
  },
  {
    id: "224-SOURCE-03",
    page: 224,
    layer: "SOURCE",
    severity: "P2",
    kind: "literal-punctuation-substitution",
    source: files["0224_source"],
    location: { paragraph: 3, paragraphPrintedLine: 5, candidateMarkdownLine: 73, candidateBlockIndex0: 4 },
    sourceExcerpt: "就会显出紫色，但是没有出现这种现象",
    expectedCandidateExcerpt: "就会显出紫色，但是没有出现这种现象",
    actualCandidateExcerpt: "就会显出紫色. 但是没有出现这种现象",
    affectedFiles: [files["0224_page.md"], files["0224_page.json"]],
    reason: "The source comma before 但是 becomes a full stop. This changes the printed sentence boundary.",
    requestedCorrection: "Restore the comma before 但是 in a separately authorized candidate repair.",
  },
];
for (const finding of findings) {
  const json = receipt(`${String(finding.page).padStart(4, "0")}_page.json`);
  assert.ok(json.blocks[finding.location.candidateBlockIndex0].lines.join("").includes(finding.actualCandidateExcerpt));
}

const source223 = {
  status: "FAIL",
  scope: "Literal source transcription only; not modern scientific approval",
  evidence: ["0223_source", "0223_page.md", "0223_page.json", "0223_audit.json"].map(id => files[id]),
  findings: ["223-SOURCE-01"],
  independentlyReadParagraphs: [
    {
      number: 1,
      candidateBlockIndices0: [0, 3],
      printedLines: 12,
      sourceText: "牛顿的基本实验是非常简单的。他想到了把横截面小的光束射向棱镜。太阳光束通过护窗板上的一个小孔进入黑暗的房间，射入玻璃棱镜后，光线折射，并在对面的墙上产生一个有虹彩颜色的伸长了的图像（图196）。很多世纪以来传统地认为虹是由七种基本颜色组成的。牛顿也分出了七种颜色：紫、靛、蓝、绿、黄、橙黄的和红。牛顿把这七色光带叫做光谱。",
      result: "PASS",
      observations: [
        "Small-cross-section sunlight enters a dark room through an aperture, passes a glass prism and forms an elongated rainbow-colored image on the opposite wall.",
        "All seven printed color names and their source order are retained; the historical count is not a modern-science finding.",
        "The source's figure196 caption remains a separate caption block with samerow and is transparent to first-p-open / p-cont pairing.",
      ],
    },
    {
      number: 2,
      candidateBlockIndices0: [4],
      printedLines: 10,
      sourceText: "用红玻璃把小孔挡住，牛顿在墙上仅仅看到红色斑点。用蓝玻璃挡住小孔，看到的是蓝色斑点，以此类推。由此可知过去推测棱镜把光染了色是不对的。棱镜没有改变光的颜色，而仅仅是把光分解为各组成成分（彩图Ⅰ）。白光具有复杂的结构。由白光可以分解出各种不同颜色的光，只是因为它们的共同作用，对我们产生了白光的印象。事实上，如果利用相对第一块棱镜转动了180°的第二块棱镜，把光谱全部光束会合起来，那末又会获得白光（彩图Ⅱ），分解出来的光谱的任何一个部分，例如绿色光，使其光线再通过一块棱镜，不能得到颜色的进一步变化。",
      result: "FAIL",
      observations: [
        "Red/blue glass, prism decomposition rather than dyeing, white-light recombination with a second prism rotated180deg, and green-light non-further-change account are all retained as source claims.",
        "The explicit 180-degree source value is represented by $180^\\circ$ without changing its value.",
        "Both color plate references are actually printed in this source paragraph; ASCII I/II denotes the same references, not acquired or invented plate artwork.",
        "Only the comma after plate II fails the literal comparison here.",
      ],
    },
    {
      number: 3,
      candidateBlockIndices0: [5],
      printedLines: 3,
      sourceText: "牛顿又得出了另外一个重要的结论，就是在《光学》论文中他阐述的如下内容：“颜色不同的光在折射程度上是不同的”（玻璃对它们具有不同的折射率）。紫色光的折射率最大，",
      result: "PASS",
      observations: [
        "The Newton quotation, work title, glass parenthesis, violet-maximum clause and trailing comma are retained.",
        "Final p-open legitimately continues into page224 first p-cont, not a new unit.",
      ],
    },
  ],
  caption: {
    text: "图 196",
    candidateBlockIndex0: 2,
    samerow: true,
    sourceSharedRowText: "纪以来传统地认为虹是由",
    captionEmbeddedInRaw: false,
  },
  footer: { text: "213", retainedAsFoot: true },
  rowCount: { prose: 25, foot: 1, sharedCaptionAdditionalRows: 0, total: 26 },
};

const source224 = {
  status: "FAIL",
  scope: "Literal source transcription only; not modern scientific approval",
  evidence: ["0224_source", "0224_page.md", "0224_page.json", "0224_audit.json"].map(id => files[id]),
  findings: ["224-SOURCE-01", "224-SOURCE-02", "224-SOURCE-03"],
  independentlyReadParagraphs: [
    {
      number: 1,
      candidateBlockIndices0: [0],
      printedLines: 2,
      sourceText: "其他颜色的光中折射率最小的是红光。光的折射率与它们的颜色的关系称为色散。",
      result: "PASS",
      observations: [
        "This continues page223's violet-maximum statement, finishes red-minimum and retains the source's bold dispersion definition.",
        "Not a new heading; the continuation marker does not fabricate unit closure.",
      ],
    },
    {
      number: 2,
      candidateBlockIndices0: [1],
      printedLines: 8,
      sourceText: "而后为了获得更纯的光，牛顿进一步改进了自己对光谱的观察。因为通过棱镜的光束的彩色圆形斑，有一部分彼此互相遮盖（图196），用明亮的光源照亮的狭缝代替圆孔，在缝后面放一个透镜，使光在屏幕上成白色的窄条纹的像。如果在光路上放一个棱镜（图197），则狭缝的像就展开为光谱。",
      result: "PASS",
      observations: [
        "The original overlapping round spots, bright-source-lit slit replacing a round aperture, lens, narrow white image and added prism are retained.",
        "Both source figure references196 and197 remain correctly distinguished.",
      ],
    },
    {
      number: 3,
      candidateBlockIndices0: [4],
      printedLines: 6,
      sourceText: "因为折射率取决于光在该物质中的速度，那么显然折射较小的红光的速度最大，紫光的速度最小。正因为如此，棱镜才能分解白光。在真空中不同颜色的光速是相等的。如果不这样，那么，罗默观察的木星的卫星1，在它从影子里出来的时刻，就会显出红色，而在临没入影子之前，就会显出紫色，但是没有出现这种现象。",
      result: "FAIL",
      observations: [
        "Material speed, red/violet order, equality of colors' speeds in vacuum and the complete source Romer/Jupiter-satellite1 account are retained as printed claims, not endorsed.",
        "The satellite's printed1 is retained as $1$; no new footnote or unit is invented.",
        "The comma before 但是 is not retained.",
      ],
    },
    {
      number: 4,
      candidateBlockIndices0: [5],
      printedLines: 9,
      sourceText: "已知白光具有复杂的结构，就可以解释自然界中惊人的色彩缤纷的现象。如果物体，例如一张纸，能反射所有入射到它上面的各种颜色的光线，那么它就呈白色。用一层红色把纸蒙上时，这时虽然我们不能创造新的颜色的光，但是我们挡住了纸上原有的某些部分的光；现在反射的仅仅是红光，其余的光则被红色层吸收了。草和树叶在我们看来之所以是绿的，是因为入射到它那里的太阳光线中被反射的仅仅是绿色，而其余的都被吸收了。如果通过只有红色光线才能透过去的红玻璃来观察草，那么草就几乎呈黑色。",
      result: "FAIL",
      observations: [
        "All examples are present: white paper reflecting incoming colors, a red covering absorbing other components, green grass/leaves and grass almost black through red glass.",
        "呈 is changed to 是 and 去 is inserted into 到它那里的; source meaning proximity does not excuse non-literal transcription.",
      ],
    },
  ],
  caption: {
    text: "图 197",
    candidateBlockIndex0: 3,
    samerow: true,
    sourceSharedRowText: "的像就展开为光谱.",
    captionEmbeddedInRaw: false,
  },
  footer: { text: "214", retainedAsFoot: true },
  rowCount: { prose: 25, foot: 1, sharedCaptionAdditionalRows: 0, total: 26 },
};

const figure196 = {
  RAW: {
    status: "PASS",
    evidence: [files["0223_source"], files["0223_raw"]],
    dimensions: { width: 618, height: 640 },
    independentlyObservedSourceInventory: [
      "One perspective room scene with left aperture/window, a single incident beam running toward a central prism/apparatus on the round table.",
      "Divergent outgoing beam/ray fan reaching an elongated stacked spectrum image on the right wall/screen.",
      "Upper horizontal fixture/lighting-like bar above the rear doorway, ceiling lines, rear door, chairs, floor and foreground right furniture remain present.",
      "No printed internal color names or other figure labels; the figure196 caption is outside the illustration.",
    ],
    cropAssessment: "Complete source room/prism/spectrum composition, including upper fixture and ray fan. No adjacent running prose, caption196 or footer213 is baked into the crop. Minor scan specks remain source pixels, not added content.",
    findings: [],
  },
  SVG: {
    status: "PASS",
    evidence: [files["0223_raw"], files["0223_svg"], files["0223_svg_preview"]],
    display: { width: 618, height: 640, background: "white", scope: "Natural-size source SVG preview, not product/mobile or modern-figure acceptance" },
    assessment: "Same room geometry and furniture, incident beam, central apparatus, outgoing ray fan, stacked wall image and upper fixture. Dark/white details remain readable; no missing or shifted instructional element, clipping, accidental prose or caption appeared in the SVG preview.",
    findings: [],
  },
};
const figure197 = {
  RAW: {
    status: "PASS",
    evidence: [files["0224_source"], files["0224_raw"]],
    dimensions: { width: 506, height: 267 },
    independentlyObservedSourceInventory: [
      "Left vertical slit/aperture bar with rays originating at its opening, a vertical convex-lens outline to its right, and an upright triangular hatched prism farther right.",
      "Horizontal central/axis line and upper/lower input rays, arrowed refracted paths and dashed comparison/converging paths to the right screen.",
      "Right vertical screen with an upper red ray endpoint labeled 红 and a lower violet endpoint labeled 紫, in the printed source order and positions.",
      "Figure197 caption is outside the optical diagram; no adjacent prose belongs to the figure crop.",
    ],
    cropAssessment: "All optical apparatus, solid/dashed rays, arrowheads and source 红/紫 labels retained. No adjacent running prose, caption197 or footer214 is baked into the crop.",
    findings: [],
  },
  SVG: {
    status: "PASS",
    evidence: [files["0224_raw"], files["0224_svg"], files["0224_svg_preview"]],
    display: { width: 506, height: 267, background: "white", scope: "Natural-size source SVG preview, not product/mobile or modern-figure acceptance" },
    assessment: "Lens/prism/screen positions, hatched surfaces, ray directions, solid/dashed distinctions and red-above-violet endpoint labels match the source crop. Both Chinese source labels remain readable without collision or clipping; retaining them is required in this faithful source layer, not modern-edition approval.",
    findings: [],
  },
};

const report = {
  schema: "STEMROBIN-181/source-raw-svg-first-review@1",
  ticket: "STEMROBIN-181",
  continuation: "181-3",
  createdAt: new Date().toISOString(),
  cwd: repo,
  ownedDirectory: own,
  status: "FAIL_SOURCE_LITERALITY",
  reviewType: "First independent literal SOURCE / RAW / source-SVG review",
  summary: {
    pages: [
      { page: 223, printedPage: 213, SOURCE: "FAIL", RAW: "PASS", SVG: "PASS", findingCount: 1 },
      { page: 224, printedPage: 214, SOURCE: "FAIL", RAW: "PASS", SVG: "PASS", findingCount: 3 },
    ],
    sourceFindingCount: 4,
    nativeResult: "Both saved finalizers are26/26 and both saved vectorizers pass; reused, not rerun. Page22427/27 is not supported by its actual receipt or audit.",
    nextRequiredAction: "Only a separately authorized targeted literal-text correction and affected review; no changes made by this reviewer.",
  },
  imageBudget: {
    batches: 1,
    sourceImagesOpened: 2,
    rawImagesOpened: 2,
    svgPreviewImagesOpened: 2,
    totalImagesOpenedInThisContext: 6,
    cropsOpened: 0,
    reopens: 0,
    gridsOpened: 0,
    maximumBatch: 8,
    maximumContext: 24,
    sourceReadSequentially: true,
    sourcePixelsReadBeforeCandidateText: true,
    actualOpenOrder: ["0223_source", "0224_source", "0223_raw", "0224_raw", "0223_svg_preview", "0224_svg_preview"].map((id, index) => ({
      order: index + 1,
      role: id,
      detail: "original",
      ...files[id],
    })),
  },
  pathResolution: {
    note: "The compressed request's0223fig196/0224fig197 notation resolves to actual0223/figures/fig-196 and0224/figures/fig-197 files; literal sibling directories0223fig196 and0224fig197 do not exist. Only the actual files listed here were reviewed.",
    candidateSourceMatchesPreparationSourceHashes: true,
    candidateSummaryFileHashesMatchActualFiles: true,
  },
  priorFailure: {
    status: "FAIL_RETAINED",
    receipt: files.first_failure_receipt,
    authorReport: files.first_author_report,
    exitCode: firstFailure.exitCode,
    stdout: firstFailure.stdout,
    cause: "Only two dedicated Roman-numeral whitelist violations: U+2160 and U+2161. This failure is technical notation validation, not a scientific verdict.",
    correction: "Page223 body differs from the first failed candidate only by printed plate references 彩图Ⅰ/彩图Ⅱ becoming supported 彩图 I/彩图 II, including spacing. Same reference meanings; no source-science correction.",
    bodyComparisonVerified: true,
    page224HistoricalPageMd: "Absent because first native page223 failure stopped d716; d717 drew page224 from the existing d716 author script.",
    historicalPage224Template: files.first_author_code,
    continuationCode: files.continuation_code,
    originalFilesModifiedByReviewer: false,
  },
  native,
  pages: [
    { page: 223, printedPage: 213, source: source223, figureId: "fig-196", ...figure196 },
    { page: 224, printedPage: 214, source: source224, figureId: "fig-197", ...figure197 },
  ],
  findings,
  sourceBoundary: {
    page223FinalParagraphOpen: true,
    page224FirstParagraphCont: true,
    join: "紫色光的折射率最大，其他颜色的光中折射率最小的是红光.",
    followingDefinition: "光的折射率与它们的颜色的关系称为色散.",
    anyUnitHeadingOnThesePages: false,
    n83Complete: false,
    fullCardClosureReviewed: false,
    note: "The first223 paragraph also has an intra-page open/cont around figure196. Captions/figures/footers remain transparent. These two source pages do not establish a complete n83 card or next-heading boundary.",
  },
  externalColorPlates: {
    printedReferences: ["彩图Ⅰ", "彩图Ⅱ"],
    candidateReferences: ["彩图 I", "彩图 II"],
    referencesVerifiedOnPage: 223,
    referencesInvented: false,
    artworkAcquired: false,
    artworkReviewed: false,
    approved: false,
  },
  approvalBoundaries: {
    modernScience: "NOT_REVIEWED_NOT_APPROVED",
    modernFigures: "NOT_REVIEWED_NOT_APPROVED",
    fullCard: "NOT_REVIEWED_NOT_APPROVED",
    sourceTextPromotion: "NOT_APPROVED_SOURCE_FAILED",
    RAWAndSourceSVG: "PASS_LIMITED_TO_LISTED_HASH_BOUND_SOURCE_FIGURES",
    historicalClaims: "Seven-color classification, rotated-prism recombination, Newton quotation, dispersion, material/vacuum speed account and object-color claims were compared only for source retention. No modernization, science correction or science approval.",
  },
  actions: {
    allExecWorkdirs: repo,
    writesOnlyOwnedDirectory: true,
    canonicalFilesWritten: false,
    canonicalToolsRun: false,
    productionMeterTouched: false,
    gitCommandsRun: false,
    backendCalls: 0,
    databaseCalls: 0,
    paidCalls: 0,
    newAgents: 0,
    newWorktrees: 0,
    newBranches: 0,
    fullTestsRun: false,
    freshnessUpdatesRun: false,
    nativeCommandsRerun: 0,
    otherChatsMessaged: false,
    candidateTextEdited: false,
  },
  files,
};
const reportPath = path.join(own, "report.json");
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({
  path: reportPath,
  sha256: hash(fs.readFileSync(reportPath)),
  status: report.status,
  pages: report.summary.pages,
  findingIds: findings.map(finding => finding.id),
  imagesOpened: report.imageBudget.totalImagesOpenedInThisContext,
  nativeCommandsRerun: 0,
}, null, 2));
