import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const own = path.dirname(fileURLToPath(import.meta.url));
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const load = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const bind = (file) => ({ path: file, sha256: hash(file) });
const pages = [108, 109, 110, 111];
const outputs = pages.map((page) => {
  const key = String(page).padStart(4, "0");
  const root = path.join(own, "root/10p/pages", key);
  const auditFile = path.join(root, "audit.json");
  const pageFile = path.join(root, "page.json");
  const audit = load(auditFile);
  const native = load(pageFile);
  const receiptFile = path.join(own, "receipts", `${key}.initial-finalize.json`);
  const receipt = load(receiptFile);
  if (receipt.candidate.sha256 !== hash(receipt.candidate.path)) throw new Error("Candidate drift");
  if (native.meta.counting || native.meta.figure_crops) throw new Error("Unexpected override");
  return {
    page, printed_page: native.meta.printed_page,
    candidate: receipt.candidate,
    native_page_md: bind(path.join(root, "page.md")),
    native_page_json: bind(pageFile),
    native_audit: bind(auditFile),
    native_receipt: bind(receiptFile),
    exit: receipt.status, lines_printed: audit.lines_printed, lines_md: audit.lines_md,
    errors: audit.errors,
    figures: audit.figures.map((figure) => ({
      ...figure,
      crop: bind(path.join(own, "work/10p/pages", key, "figures", `${figure.id}.png`)),
      crop_visually_opened_once: true,
    })),
    paragraph_boundaries: native.blocks.flatMap((block, index) =>
      block.kind === "p" && (block.open || block.cont)
        ? [{ ref: `p${key}#${index + 1}`, cont: block.cont, open: block.open, lines: block.lines }]
        : []),
    headings: native.blocks.flatMap((block, index) =>
      ["h1", "h2", "h3", "exhead"].includes(block.kind)
        ? [{ ref: `p${key}#${index + 1}`, kind: block.kind, lines: block.lines }]
        : []),
    exercises: native.blocks.filter((block) => block.kind === "ex").length,
    explanatory_footnotes: native.blocks.filter((block) => block.footnote).length,
  };
});
const copied = load(path.join(own, "receipts/prepared-copy.json"));
for (const file of copied.files) {
  if (hash(file.prepared) !== file.sha256 || hash(file.work) !== file.sha256) {
    throw new Error("Prepared-source drift");
  }
}
const predecessor = load(copied.predecessor.copy);
const lastParagraph = predecessor.blocks.filter((block) => block.kind === "p").at(-1);
if (lastParagraph.open || !lastParagraph.lines.at(-1).endsWith("为止。")) {
  throw new Error("Predecessor boundary mismatch");
}
const viewed = [
  ...pages.map((page) => path.join(own, "prepared/10p/pages", String(page).padStart(4, "0"), "page.grid.png")),
  ...outputs.flatMap((output) => output.figures.map((figure) => figure.crop.path)),
];
if (viewed.length !== 8) throw new Error("Image budget mismatch");
const report = {
  schema: "source-author/initial-observations@1",
  owner: own,
  state: "NATIVE_PASS_PENDING_INDEPENDENT_SOURCE_REVIEW",
  prepared_copy_receipt: bind(path.join(own, "receipts/prepared-copy.json")),
  predecessor: { ...copied.predecessor, final_paragraph: lastParagraph },
  pages: outputs,
  summary_and_chapter_card_boundaries: bind(path.join(own, "summary.md")),
  image_count: viewed.length,
  images_in_order: viewed.map((file, index) => ({ load: index + 1, ...bind(file), single_load: true })),
  prepare_replays: 0,
  initial_finalize_invocations: 4,
  count_failures: [],
  holds: [],
  counting_overrides: [],
  figure_crop_overrides: [],
  author_corrections_used: 0,
  independent_review: "PENDING",
  post_review_correction_limit: 1,
  exclusive_figure_ownership: "NOT_ESTABLISHED: fig-70 and fig-71 have references in both sections 38 and 39",
};
const destination = path.join(own, "author-observations.json");
fs.writeFileSync(destination, JSON.stringify(report, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({
  report: destination, sha256: hash(destination), images: viewed.length,
  pages: outputs.map((output) => ({ page: output.page, exit: output.exit, printed: output.lines_printed, authored: output.lines_md })),
}));
