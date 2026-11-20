import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const tmp = path.join(process.cwd(), ".intentfold/tickets/STEMROBIN-188/tmp");
const read = (p) => fs.readFileSync(p);
const json = (p) => JSON.parse(read(p));
const hash = (b) => crypto.createHash("sha256").update(b).digest("hex");
const result = json(path.join(tmp, "source215216-metadata-repair-01/result.json"));
const scope = json(result.scope.path);
const oldReportPath = path.join(tmp, "source215216-FIRST-review-01/report.json");
const oldReport = json(oldReportPath);
const splitMD = (buffer) => {
  const prefix = Buffer.from("---\n");
  const delimiter = Buffer.from("\n---\n");
  if (!buffer.subarray(0, prefix.length).equals(prefix)) throw new Error("Unexpected MD frontmatter");
  const end = buffer.indexOf(delimiter, prefix.length);
  if (end < 0) throw new Error("No closing frontmatter");
  return {
    meta: JSON.parse(buffer.subarray(prefix.length, end).toString("utf8")),
    body: buffer.subarray(end + delimiter.length)
  };
};
const diff = (a, b, pointer = "") => {
  if (isDeepStrictEqual(a, b)) return [];
  if (a && b && typeof a === "object" && typeof b === "object" && Array.isArray(a) === Array.isArray(b)) {
    return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap((key) =>
      diff(a[key], b[key], `${pointer}/${key}`));
  }
  return [{ pointer, before: a ?? null, after: b ?? null }];
};
const pages = result.pages.map((page) => {
  const byFile = (side, name) => page[side].find((p) => path.basename(p.path) === name).path;
  const beforeMD = splitMD(read(byFile("before", "page.md")));
  const afterMD = splitMD(read(byFile("after", "page.md")));
  const beforeJSON = json(byFile("before", "page.json"));
  const afterJSON = json(byFile("after", "page.json"));
  const beforeAuditBytes = read(byFile("before", "audit.json"));
  const afterAuditBytes = read(byFile("after", "audit.json"));
  const auditDiffs = diff(JSON.parse(beforeAuditBytes), JSON.parse(afterAuditBytes));
  const pageDiffs = diff(beforeJSON, afterJSON);
  const frontmatterDiffs = diff(beforeMD.meta, afterMD.meta);
  const prescribedNote = scope.pages.find((p) => p.page === page.page).note;
  const beforeNotes = beforeJSON.meta.notes;
  const afterNotes = afterJSON.meta.notes;
  const expectedJSON = structuredClone(beforeJSON);
  expectedJSON.meta.notes.push(prescribedNote);
  const expectedAudit = JSON.parse(beforeAuditBytes);
  let expectedBody = beforeMD.body;
  if (page.page === 216) {
    expectedJSON.meta.numbering_scope = "g10";
    expectedAudit.numbering_scope = "g10";
    for (const crop of page.crops) {
      for (const figure of expectedJSON.meta.figures) {
        if (figure.id === crop.oldID) figure.id = crop.newID;
      }
      for (const block of expectedJSON.blocks) {
        if (block.kind === "fig" && block.id === crop.oldID) block.id = crop.newID;
      }
      for (const figure of expectedAudit.figures) {
        if (figure.id === crop.oldID) figure.id = crop.newID;
      }
      const oldToken = Buffer.from(`figures/${crop.oldID}.png`);
      const newToken = Buffer.from(`figures/${crop.newID}.png`);
      const index = expectedBody.indexOf(oldToken);
      if (index < 0 || expectedBody.indexOf(oldToken, index + oldToken.length) >= 0) {
        throw new Error("Expected exactly one crop-path alias token");
      }
      expectedBody = Buffer.concat([
        expectedBody.subarray(0, index),
        newToken,
        expectedBody.subarray(index + oldToken.length)
      ]);
    }
  }
  const expectedMDMeta = structuredClone(expectedJSON.meta);
  const checks = {
    exactlyOnePrescribedNoteAppended: afterNotes.length === beforeNotes.length + 1 &&
      isDeepStrictEqual(beforeNotes, afterNotes.slice(0, -1)) && afterNotes.at(-1) === prescribedNote,
    pageJSONExactAllowedDiffOnly: isDeepStrictEqual(expectedJSON, afterJSON),
    frontmatterMatchesPageJSONBefore: isDeepStrictEqual(beforeMD.meta, beforeJSON.meta),
    frontmatterMatchesPageJSONAfter: isDeepStrictEqual(afterMD.meta, afterJSON.meta),
    frontmatterExactAllowedDiffOnly: isDeepStrictEqual(expectedMDMeta, afterMD.meta),
    mdBodyByteEqualAfterOnlyExplicitPathAliases: expectedBody.equals(afterMD.body),
    auditExactIdentifierDerivativeOnly: isDeepStrictEqual(expectedAudit, JSON.parse(afterAuditBytes)),
    unchangedAuditBytes215: page.page !== 215 || beforeAuditBytes.equals(afterAuditBytes)
  };
  const allowedDiff = (d) => /\/notes\/\d+$/.test(d.pointer) ||
    /\/numbering_scope$/.test(d.pointer) ||
    /\/(?:figures|blocks)\/\d+\/id$/.test(d.pointer);
  const safeDiffs = (ds) => ds.map((d) => allowedDiff(d) ? d : {
    pointer: d.pointer,
    unexpected: true,
    beforeValueSha256: hash(Buffer.from(JSON.stringify(d.before))),
    afterValueSha256: hash(Buffer.from(JSON.stringify(d.after)))
  });
  const crops = page.crops.map((crop) => {
    const before = read(crop.before.path);
    const after = read(crop.after.path);
    return {
      oldID: crop.oldID, newID: crop.newID,
      before: { path: crop.before.path, sha256: hash(before), bytes: before.length },
      after: { path: crop.after.path, sha256: hash(after), bytes: after.length },
      byteExact: before.equals(after),
      decodedOrViewed: false
    };
  });
  const parserBytes = read(page.parser.path);
  return {
    page: page.page,
    sourceTextMathReReview: false,
    imageLoads: 0,
    note: prescribedNote,
    notesBefore: beforeNotes.length,
    notesAfter: afterNotes.length,
    pageJSONDiffs: safeDiffs(pageDiffs),
    mdFrontmatterDiffs: safeDiffs(frontmatterDiffs),
    mdBody: {
      beforeSha256: hash(beforeMD.body), afterSha256: hash(afterMD.body),
      opaqueEqualityOnly: true,
      allowedAliases: page.page === 216 ? page.crops.map((c) => ({ before: `figures/${c.oldID}.png`, after: `figures/${c.newID}.png` })) : []
    },
    auditDiffs: safeDiffs(auditDiffs),
    crops,
    checks,
    savedParser: { path: page.parser.path, sha256: hash(parserBytes), bytes: parserBytes.length, executedByReviewer: false },
    repairsUsed: page.repairsUsed,
    repairLimit: page.repairLimit,
    pass: Object.values(checks).every(Boolean) && crops.every((crop) => crop.byteExact)
  };
});
const evidence = {
  schema: "stemrobin188-independent-three-metadata-diffs@1",
  scope: ["F215-EMPHASIS", "F216-EMPHASIS", "F216-NAMESPACE"],
  oldReport: { path: oldReportPath, sha256: hash(read(oldReportPath)) },
  oldFindings: oldReport.FAIL.filter((f) => ["F215-EMPHASIS", "F216-EMPHASIS", "F216-NAMESPACE"].includes(f.id)),
  historicalStatusPreservedWithoutAdjudication: {
    FAIL: oldReport.FAIL,
    HOLD: oldReport.HOLD,
    counts: oldReport.counts,
    source212AffectedVerdict: oldReport.source212AffectedVerdict,
    noHistoricalOutputRewritten: true,
    headingFindingUncleared: "F215-HEADINGTYPE-CONTRACT",
    figure80UnreadableLabelHOLD: "216-figure80-right-label"
  },
  pages,
  nativeCounterRenderPrepareAssemblyRuns: 0,
  imageLoads: 0,
  pass: pages.every((page) => page.pass),
  wholePageApproved: false,
  wholeLessonApproved: false
};
fs.writeFileSync(path.join(root, "metadata-affected-diffs.json"), JSON.stringify(evidence, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({ pass: evidence.pass, pages: pages.map((p) => ({ page: p.page, checks: p.checks, diffs: p.pageJSONDiffs, auditDiffs: p.auditDiffs, cropByteExact: p.crops.every((c) => c.byteExact) })) }, null, 2));
if (!evidence.pass) process.exitCode = 1;
