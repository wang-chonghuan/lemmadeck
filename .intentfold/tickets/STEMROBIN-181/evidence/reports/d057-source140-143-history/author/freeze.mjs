import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const base = path.join(repo, "tmp/d053-10p-source140-143-author");
const output = path.join(base, "author-freeze.json");
if (fs.existsSync(output)) throw new Error("An existing author freeze must be reused, not overwritten.");
const sha256 = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const bind = (file) => ({ path: file, sha256: sha256(file), bytes: fs.statSync(file).size });
const load = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const toolsDir = path.join(repo, ".claude/skills/ld-s10y-lesson/tools");
const tools = fs.readdirSync(toolsDir, { withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => bind(path.join(toolsDir, entry.name)));
const tocPath = path.join(repo, "ssot-resources/soviet10year-textbooks/toc/10p/zh.json");
const toc = load(tocPath);
const nodes = [];
const walk = (value) => {
  if (Array.isArray(value)) value.forEach(walk);
  else if (value && typeof value === "object") {
    if (value.id) nodes.push(value);
    Object.values(value).forEach(walk);
  }
};
walk(toc);
const topic = (number) => {
  const matches = nodes.filter((node) => node.id === `phy10-c1-s6-n${number}`);
  if (matches.length !== 1) throw new Error(`TOC ID n${number} is not unique.`);
  const { id, printedNumber, title, page } = matches[0];
  return { id, printedNumber, title, printedPageStart: page, physicalPageStart: page + 10 };
};
const observations = {
  140: {
    lessonIds: ["phy10-c1-s6-n51"],
    sourceScope: "n51 tail only; no n51 completion or approval",
    paragraphPrintedRows: [2, 5, 2, 5, 3],
    captionPrintedRows: 1,
    footerPrintedRows: 1,
    emphasis: [
      { block: "p0140#8", text: "如果不指出所研究的场是相对哪个参考系而言的，只提出在空间某点上仅有电场或仅有磁场的论断是毫无意义的。" },
      { block: "p0140#9", text: "电磁场" },
    ],
    figures: [
      { id: "fig-101", description: "Observer standing on a wheeled platform; tall cylindrical apparatus with charged top sphere and radial arrows, E-like label, internal rod and shaded lower feature, platform wheels and rightward motion arrow. Crop includes the complete platform, observer, apparatus and arrows; no caption or adjacent prose." },
      { id: "fig-102", description: "Observer to the left outside the moving wheeled platform; cylinder, charged sphere, radial arrows and E-like label, two looped magnetic-field groups with B-like labels, internal rod and shading, complete platform/wheels and rightward motion arrow. Crop excludes the caption and adjacent prose." },
    ],
  },
  141: {
    lessonIds: ["phy10-c1-s6-n51", "phy10-c1-s6-n52"],
    sourceScope: "n51 four-line tail retained before n52 heading; n51 inherited HOLD untouched",
    paragraphPrintedRows: [4, 7, 3, 5, 4],
    headerPrintedRows: 1,
    footerPrintedRows: 1,
    emphasis: [
      { block: "p0141#4", text: "电磁相互作用是以有限速度传播的" },
    ],
    figures: [],
  },
  142: {
    lessonIds: ["phy10-c1-s6-n52", "phy10-c1-s6-n53"],
    sourceScope: "n52 ends before n53 heading; n53 opening paragraph continues onto physical143",
    paragraphPrintedRows: [5, 3, 4, 6, 3, 3],
    headerPrintedRows: 1,
    captionAdditionalPrintedRows: 0,
    footerPrintedRows: 1,
    emphasis: [],
    retainedSmallType: [
      { block: "p0142#4", printedRows: 3 },
      { block: "p0142#5", printedRows: 4 },
    ],
    sourceWordingNotScientificallyRewritten: ["电磁干扰", "力学原理"],
    figures: [
      { id: "fig-103", description: "Central paired upward magnetic curves labelled B-like, central horizontal elliptical electric loop labelled E-like, two flanking upright closed loops with B1-like labels and two horizontal electric loops with E1-like labels; visible arrows, loop crossings, subscript digits, full upper and lower extents retained. Caption shares the left paragraph's fifth printed row." },
    ],
  },
  143: {
    lessonIds: ["phy10-c1-s6-n53"],
    sourceScope: "n53 continuation and complete ending; no physical144 pixels were opened",
    paragraphPrintedRows: [3, 10, 5, 4, 3],
    captionAdditionalPrintedRows: 0,
    footerPrintedRows: 1,
    emphasis: [
      { block: "p0143#5", text: "电磁波" },
      { block: "p0143#6", text: "加速度存在是发射电磁波的首要条件" },
      { block: "p0143#7", text: "电磁波是横波" },
    ],
    conditionsRetained: [
      "周期等于电荷振动的周期",
      "不同距离处的振动相位各不相同",
      "加速度存在是发射电磁波的首要条件",
      "速度不管变化得多快时也辐射",
      "加速度越大，辐射的波的强度越大",
      "E、B 矢量互相垂直，并且垂直于波的传播方向",
      "具有右螺纹的钻孔器从矢量 E 转向矢量 B",
      "钻孔器的前进方向与波的速度矢量 c 方向一致",
    ],
    sourceWordingNotScientificallyRewritten: ["被赫兹用实验获得"],
    figures: [
      { id: "fig-104", description: "Two perpendicular oscillatory traces spreading along the receding direction, hatched alternating lobes on one trace, separate unhatched trace, left E-like and lower B-like labels, lower wavelength bracket with lambda-like glyph, arrows and diagonal connectors, upper-right S/s-like glyph and short dash retained. No axes, labels or extents redrawn, regularized or interpreted into exact codepoints." },
    ],
  },
};
const pages = [140, 141, 142, 143].map((page) => {
  const padded = String(page).padStart(4, "0");
  const sourceDir = path.join(base, "source/10p/pages", padded);
  const workDir = path.join(base, "work/10p/pages", padded);
  const pagePath = path.join(sourceDir, "page.json");
  const data = load(pagePath);
  const audit = load(path.join(sourceDir, "audit.json"));
  const receipts = ["prepare", "finalize", "vectorize"].map((stage) => {
    const file = path.join(base, "receipts", `${stage}-${page}-initial.json`);
    const receipt = load(file);
    if (receipt.exitCode !== 0) throw new Error(`Unresolved native failure: ${file}`);
    return { ...bind(file), stage, exitCode: receipt.exitCode,
      stdout: bind(receipt.stdout.path), stderr: bind(receipt.stderr.path),
      startedReceipt: bind(path.join(base, "receipts", `${stage}-${page}-initial.started.json`)) };
  });
  if (audit.errors.length || audit.lines_printed !== audit.lines_md) {
    throw new Error(`Unresolved native audit for physical${page}.`);
  }
  const vectorStdout = fs.readFileSync(receipts.find((r) => r.stage === "vectorize").stdout.path, "utf8");
  const vectorMetrics = [...vectorStdout.matchAll(/(fig-\d+)\s+不匹配\s+([\d.]+)%/g)]
    .map((match) => ({ id: match[1], mismatchPercentAsPrintedByNative: Number(match[2]),
      mismatchLimitPercent: 2, edgeTolerancePx: 1, turdsize: 2,
      interpretation: "Native resvg pixel metric only, not independent SOURCE/RAW approval." }));
  const figureBindings = audit.figures.map((figure) => ({
    ...figure,
    png: bind(path.join(workDir, "figures", `${figure.id}.png`)),
    svg: bind(path.join(workDir, "figures", `${figure.id}.svg`)),
    defaultPaddingPx: 12,
    nativeMetric: vectorMetrics.find((metric) => metric.id === figure.id),
  }));
  if (figureBindings.some((figure) => !figure.nativeMetric)) throw new Error("Missing vector receipt metric.");
  return {
    physicalPage: page, printedPage: data.meta.printed_page,
    SOURCE: "await-independent",
    RAW: "native-pass; independent visual review pending",
    nativeFinalization: "pass", nativeVectorization: figureBindings.length ? "pass" : "not-applicable-no-figures",
    linesPrinted: audit.lines_printed, linesTranscribed: audit.lines_md,
    blockCount: data.blocks.length,
    exerciseCount: data.blocks.filter((block) => block.kind === "ex").length,
    exerciseGroups: data.blocks.filter((block) => block.kind === "exhead"),
    headers: data.blocks.flatMap((block, index) => block.kind.startsWith("h") ?
      [{ sourceRef: `p${padded}#${index + 1}`, kind: block.kind, text: block.lines.join("") }] : []),
    blockFacts: data.blocks.map((block, index) => ({
      sourceRef: `p${padded}#${index + 1}`, kind: block.kind,
      lineCount: block.lines.length, open: block.open, cont: block.cont,
      samerow: block.samerow, label: block.label,
    })),
    notes: data.meta.notes, authorPixelObservations: observations[page],
    files: {
      pageMd: bind(path.join(sourceDir, "page.md")), pageJson: bind(pagePath),
      audit: bind(path.join(sourceDir, "audit.json")),
      sourcePagePixels: bind(path.join(workDir, "page.png")),
      sourceGridNotOpened: bind(path.join(workDir, "page.grid.png")),
      layout: bind(path.join(workDir, "layout.json")),
      preparedTemplate: bind(path.join(workDir, "page.template.md")),
      originalTranscriptionBeforeNativeFinalization: bind(path.join(base, "history", `finalize-${page}-initial/page.md`)),
    },
    figures: figureBindings, nativeReceipts: receipts,
    nativeFailures: 0, corrections: 0,
  };
});
const imagePaths = [
  ...pages.map((page) => page.files.sourcePagePixels.path),
  ...pages.flatMap((page) => page.figures.map((figure) => figure.png.path)),
];
const freeze = {
  schema: "STEMROBIN-181/source-author-freeze@1", ticket: "STEMROBIN-181",
  authoredAt: new Date().toISOString(), cwd: repo, outputRoot: base, book: "10p",
  authorRole: "source transcription author under the human's latest scope; not an independent reviewer",
  SOURCE: "await-independent",
  RAW: "native-pass; independent visual review pending",
  authorPassIsNotIndependentApproval: true,
  authorizedPhysicalPages: [140, 141, 142, 143],
  excludedPhysicalPages: "132-139 not redone or re-reviewed; 144 and later not opened",
  immutableSourceBindings: {
    pdf: bind(path.join(repo, "ssot-resources/soviet10year-textbooks/sources/soviet10years/10p 苏联中学课本 物理 十年级 .pdf")),
    profile: bind(path.join(repo, ".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json")),
    toc: bind(tocPath),
    nativeToolsAtFreeze: tools,
    note: "Read-only identity bindings; no tool, profile, PDF, TOC or canonical write was performed. These are freeze-time identities, not invented pre/post change proofs.",
  },
  imageBudget: {
    oldCumulativeAtResume: 0, batchSourceImages: 4, batchNecessaryNativeCrops: 4,
    batchTotal: 8, cumulativeTotal: 8, maxBatch: 8, maxContext: 24,
    noCompactionWasUsedToClearImages: true, noDelegation: true,
    opens: imagePaths.map((file, index) => ({ sequence: index + 1, ...bind(file), detail: "original" })),
    nativeSvgVisualNotOpened: true,
    note: "Full source pages and four native PNG crops were visually opened singly. Native SVG raster comparisons are recorded by vectorize receipts only; no separate SVG visual approval is claimed.",
  },
  boundaries: [
    { ...topic(51), sourceScopeClosed: false, sourceStatus: "inherited-HOLD-not-reopened",
      includedTail: ["p0140#1-p0140#9", "p0141#1"],
      note: "Tail-only retention cannot resolve 138/139 HOLD or establish full-card completion." },
    { ...topic(52), sourceScopeClosed: true, SOURCE: "await-independent", completeApproval: false,
      includedRange: { first: "p0141#2", last: "p0142#7" },
      rightBoundary: "p0142#8 is n53 heading; n52 source extent is bounded by actual source pixels.",
      assemblyOrCanonicalPromotionPerformed: false },
    { ...topic(53), sourceScopeClosed: true, SOURCE: "await-independent", completeApproval: false,
      includedRange: { first: "p0142#8", last: "p0143#8" },
      continuations: [
        { open: "p0142#9", cont: "p0143#1", type: "cross-page paragraph" },
        { open: "p0143#2", cont: "p0143#5", transparentBlocks: ["p0143#3", "p0143#4"], type: "paragraph split around fig104" },
      ],
      rightBoundary: { nextTopic: topic(54), evidence: "n53 final paragraph ends on physical143; read-only stable TOC starts n54 at printed134/physical144. No physical144 pixel review claimed." },
      assemblyOrCanonicalPromotionPerformed: false },
  ],
  exactEncodingHolds: [
    { figure: "fig-104", location: "upper right beside the propagation arrow",
      observedGlyph: "italic S/s-like glyph",
      status: "HOLD-exact-encoding-unresolved",
      note: "No Latin/Cyrillic or s/S/c codepoint is assigned from scientific expectation. Original crop and native SVG preserve the actual glyph contour. This does not prevent recording the known prose or the native RAW metric separately." },
  ],
  profileApplicability: {
    frenchIntervals: "not present in this four-page source",
    cyrillicExerciseMarkers: "not present; no exercise or exercise-group block in these pages",
    formulas: "E, B, B_1 and arrowed E/B/c faithfully retained; no scientific repair",
    rawFigureLabels: "contours preserved without fabricating exact Unicode encoding",
  },
  nativeFailures: 0, corrections: 0, authorConfirmedSourceDefects: 0,
  independentDefectCount: null,
  defectCountNote: "Zero author-confirmed defects is not an independent defect count or approval; independent review has not run.",
  scopeRestrictions: {
    allWritesInsideOutputRoot: true,
    noCanonicalWrites: true, noOriginalPdfOrToolsChanges: true,
    noDb: true, noGitOrCommit: true, noBackend: true, noAppOrDesktop: true,
    noDependencies: true, noChildren: true, noIndexOrMeter: true,
    noNewPaidImageOrGenerationCalls: true, paidGenerationCalls: 0,
    noModernFigureRecreation: true, noPublication: true,
    noFullCardApprovalClaim: true,
  },
  authorScripts: [bind(path.join(base, "run-native.mjs")), bind(path.join(base, "freeze.mjs"))],
  pages,
};
for (const page of pages) {
  const data = load(page.files.pageJson.path);
  if (data.meta.source.pdf_sha256 !== freeze.immutableSourceBindings.pdf.sha256 ||
      data.meta.profile.sha256 !== freeze.immutableSourceBindings.profile.sha256) {
    throw new Error("Native source/profile binding no longer matches freeze inputs.");
  }
}
fs.writeFileSync(output, `${JSON.stringify(freeze, null, 2)}\n`, { flag: "wx" });
const digest = sha256(output);
fs.writeFileSync(path.join(base, "author-freeze.sha256"), `${digest}  author-freeze.json\n`, { flag: "wx" });
fs.chmodSync(output, 0o444);
console.log(JSON.stringify({ path: output, sha256: digest, pages: pages.map((p) => ({
  physical: p.physicalPage, printed: p.printedPage, lines: p.linesTranscribed,
  SOURCE: p.SOURCE, RAW: p.RAW, nativeFailures: p.nativeFailures,
})), imageCount: freeze.imageBudget.cumulativeTotal }, null, 2));
