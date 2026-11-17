import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { root, workspace, recordCommand } from "./command-evidence.mjs";

const expected = [
  ["0168", "4ad9cef52d6ce9bc90eb60349b15fd2af9a76c97ed966d1795274216a23d7e36"],
  ["0169", "ca67e8335de4eed69cd1c35ca5cbeaf37fc0eeab1b88e3ef3969e28042d1f1c7"],
  ["0170", "d7b658ff0c222adcfe4f1853baac4dabde36a6d136dc455e36b60becf640e19c"],
  ["0171", "cc5c595c812f745511f9c239fa22155bf5957a6a7a4cdd190e3600e13d178686"],
];

recordCommand("CB02-author-read", (emit) => {
  const verified = expected.map(([page, expectedSha256]) => {
    const authorPath = path.join(workspace, `ssot-resources/soviet10year-textbooks/artifacts/10c/pages/${page}/page.md`);
    const bytes = fs.readFileSync(authorPath);
    const sha256 = crypto.createHash("sha256").update(bytes).digest("hex");
    if (sha256 !== expectedSha256) throw new Error(`Author hash mismatch: ${page}`);
    return { page, authorPath, bytes, sha256 };
  });
  fs.mkdirSync(path.join(root, "comparison-inputs"));
  for (const author of verified) {
    const snapshotPath = path.join(root, `comparison-inputs/${author.page}.author.verified.md`);
    fs.writeFileSync(snapshotPath, author.bytes, { flag: "wx" });
    emit(`${JSON.stringify({
      page: author.page,
      authorPath: author.authorPath,
      sha256: author.sha256,
      snapshotPath,
      role: "HASH-VERIFIED AUTHOR COMPARISON MATERIAL; NOT INDEPENDENT PIXELS",
      numberedPhysicalFileLines: author.bytes.toString("utf8").split("\n").map((text, i) => ({ line: i + 1, text })),
    }, null, 2)}\n`);
  }
});
