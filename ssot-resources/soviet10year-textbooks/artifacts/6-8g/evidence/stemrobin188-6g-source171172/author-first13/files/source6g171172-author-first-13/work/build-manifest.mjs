import { createHash } from "node:crypto";
import { chmodSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const own = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cwd = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
if (process.cwd() !== cwd) throw new Error("Wrong checkout cwd.");
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const bind = path => {
  const bytes = readFileSync(path);
  const stat = statSync(path);
  const result = { path, sha256: hash(bytes), bytes: bytes.length, mode: (stat.mode & 0o777).toString(8).padStart(4, "0") };
  if (path.endsWith(".png")) {
    if (!bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) throw new Error(`Invalid PNG: ${path}`);
    result.png = { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }
  return result;
};
const observations = JSON.parse(readFileSync(resolve(own, "work", "author-observations.json"), "utf8"));
const executionDir = resolve(own, "work", "receipts");
const receipts = readdirSync(executionDir).filter(name => name.endsWith(".execution.json"));
const executions = receipts.map(name => {
  const path = resolve(executionDir, name);
  const receipt = JSON.parse(readFileSync(path, "utf8"));
  if (receipt.cwd !== cwd || receipt.signal || receipt.error || receipt.exitCode !== 0) throw new Error(`Unexpected execution fact: ${name}`);
  for (const stream of Object.values(receipt.streams)) {
    const bound = bind(stream.path);
    if (stream.sha256 !== bound.sha256 || stream.bytes !== bound.bytes) throw new Error(`Stream drift: ${stream.path}`);
  }
  return { name: name.replace(".execution.json", ""), ...receipt, receipt: bind(path) };
});
const prepareRange = JSON.parse(readFileSync(resolve(executionDir, "01-prepare-range.stdout"), "utf8"));
if (!prepareRange.ok || prepareRange.book !== "6-8g" || prepareRange.pages.length !== 2) throw new Error("Unexpected prepare-range result.");
const prepared = prepareRange.pages.map(entry => {
  if (entry.returncode !== 0 || entry.status !== "prepared") throw new Error("Native prepare did not succeed.");
  const path = resolve(entry.work, "prepare.0001.execution.json");
  const receipt = {
    schema: "source-author/derived-native-prepare-receipt@1",
    cwd,
    argv: entry.command,
    exitCode: entry.returncode,
    status: entry.status,
    derivedFrom: bind(resolve(executionDir, "01-prepare-range.stdout")),
    timestamps: null,
    timestampPolicy: "not supplied by native child result; not invented",
    streams: { stdout: bind(entry.stdout), stderr: bind(entry.stderr) },
  };
  writeFileSync(path, JSON.stringify(receipt, null, 2) + "\n", { flag: "wx", mode: 0o444 });
  chmodSync(path, 0o444);
  return { ...receipt, receipt: bind(path) };
});
const pages = observations.pages.map(page => {
  const id = String(page.page).padStart(4, "0");
  const work = resolve(own, "work", "6-8g", "pages", id);
  const artifacts = resolve(own, "artifacts", "6-8g", "pages", id);
  const first = bind(resolve(work, "page.FIRST.md"));
  const inventory = bind(resolve(work, "inventory.FIRST.json"));
  if (first.mode !== "0444" || first.sha256 !== page.firstSha256 || inventory.mode !== "0444" || inventory.sha256 !== page.firstInventorySha256) throw new Error("FIRST drift.");
  const revision0 = bind(resolve(work, "page.candidate.revision0.md"));
  if (revision0.sha256 !== first.sha256 || revision0.mode !== "0444") throw new Error("Revision0 not preserved.");
  let previous = null;
  const ordering = page.freezeOrder.map(name => {
    const execution = executions.find(item => item.name === name);
    if (!execution || previous && execution.startedAt < previous.finishedAt) throw new Error("Missing or nonsequential freeze ordering.");
    previous = execution;
    return { name, startedAt: execution.startedAt, finishedAt: execution.finishedAt, receipt: execution.receipt };
  });
  const finalizers = executions.filter(item => item.argv.includes("finalize") && item.argv.includes(String(page.page)));
  if (finalizers.length !== 1) throw new Error("Expected exactly one native finalizer.");
  const auditPath = resolve(artifacts, "audit.json");
  const audit = JSON.parse(readFileSync(auditPath, "utf8"));
  if (audit.lines_printed !== page.nativePrintRows || audit.lines_md !== page.nativeMdRows || audit.errors.length || audit.normalizations.length || audit.unknown_chars.length || audit.count_exclusions.length) throw new Error("Observation does not match native audit.");
  return {
    ...page,
    first,
    firstInventory: inventory,
    revision0,
    ordering,
    nativeAudit: { ...audit, file: bind(auditPath) },
    nativeCandidate: bind(resolve(artifacts, "page.md")),
    nativeStructuredPage: bind(resolve(artifacts, "page.json")),
    sourceRender: bind(resolve(work, "page.png")),
    crops: audit.figures.map(figure => ({ ...figure, file: bind(resolve(work, "figures", `${figure.id}.png`)) })),
    pixelAccounting: "Native snapped box and component count plus actual PNG dimensions; native audit supplies no ink-pixel count for these crops, so none is invented.",
  };
});
const walk = directory => readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const path = resolve(directory, entry.name);
  if (entry.isDirectory()) return walk(path);
  if (!entry.isFile() || relative(own, path) === "work/manifest.json" || entry.name.startsWith("17-build-manifest.")) return [];
  return [bind(path)];
});
const files = walk(own).sort((a, b) => a.path.localeCompare(b.path));
const manifest = {
  schema: "source-author/manifest@1",
  createdAt: new Date().toISOString(),
  cwd,
  own,
  report: bind(resolve(own, "work", "author-report.md")),
  observations: bind(resolve(own, "work", "author-observations.json")),
  status: "SOURCE_AUTHOR_NATIVE_PAGE_PASS_WITH_HOLDS",
  activeExecSessions: [],
  role: observations.role,
  scope: observations.scope,
  authorization: observations.authorization,
  imageBudget: observations.imageBudget,
  chargedImageLedger: observations.chargedImageLedger.map(item => ({ ...item, file: bind(resolve(own, item.path)) })),
  pages,
  executions,
  nativePreparedExecutions: prepared,
  nativeTools: [
    bind(resolve(cwd, ".claude/skills/ld-s10y-lesson/tools/production.py")),
    bind(resolve(cwd, ".claude/skills/ld-s10y-lesson/tools/p2c.py")),
  ],
  holds: observations.holds,
  files,
  selfReferencePolicy: "This manifest and its enclosing17-build-manifest execution receipt/streams are excluded to avoid recursive hashes. The enclosing execution receipt records generated stdout and its printed manifest SHA.",
};
const path = resolve(own, "work", "manifest.json");
writeFileSync(path, JSON.stringify(manifest, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({ report: manifest.report, manifest: bind(path), pages: pages.map(page => ({ page: page.page, firstSha256: page.first.sha256, firstMode: page.first.mode, nativeExitCode: page.nativeExitCode, nativePrintRows: page.nativePrintRows, nativeMdRows: page.nativeMdRows, crop: page.crops[0].file })), chargedImages: observations.imageBudget.charged, activeExecSessions: [], holds: observations.holds }, null, 2));
