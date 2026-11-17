import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const root = "/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d172-t16-text-only-choice-author";
const sources = [
  {
    id: "feynman-fields",
    url: "https://www.feynmanlectures.caltech.edu/II_26.html",
    terms: ["Relativistic transformation of the fields", "pure static magnetic", "fixed charges"],
  },
  {
    id: "feynman-dipole",
    url: "https://www.feynmanlectures.caltech.edu/I_28.html",
    terms: ["projection", "electric dipole oscillator", "intermediate angle"],
  },
  {
    id: "noaa-hf",
    url: "https://www.swpc.noaa.gov/impacts/hf-radio-communications",
    terms: ["ionosphere", "frequency", "reflect"],
  },
  {
    id: "nasa-moon",
    url: "https://science.nasa.gov/moon/facts/",
    terms: ["exosphere", "atmosphere"],
  },
];
const digest = (value) => crypto.createHash("sha256").update(value).digest("hex");
const records = [];

for (const source of sources) {
  const args = [source.url];
  const result = spawnSync("cloak-fetch", args, {
    encoding: "utf8",
    maxBuffer: 8_000_000,
    timeout: 180_000,
  });
  const stdout = result.stdout ?? "";
  const stderr = result.stderr ?? "";
  const stdoutPath = path.join(root, `${source.id}.stdout.txt`);
  const stderrPath = path.join(root, `${source.id}.stderr.txt`);
  fs.writeFileSync(stdoutPath, stdout, { flag: "wx" });
  fs.writeFileSync(stderrPath, stderr, { flag: "wx" });
  const text = stdout.replace(/\s+/g, " ");
  const excerpts = source.terms.flatMap((term) => {
    const at = text.toLowerCase().indexOf(term.toLowerCase());
    return at < 0 ? [] : [{ term, text: text.slice(Math.max(0, at - 250), at + 1100) }];
  });
  const record = {
    id: source.id,
    url: source.url,
    command: ["cloak-fetch", ...args],
    exitCode: result.status,
    signal: result.signal,
    error: result.error?.message ?? null,
    stdout: { path: stdoutPath, sha256: digest(stdout) },
    stderr: { path: stderrPath, sha256: digest(stderr) },
    HTTP200Observed: /Status:\s*200\b/.test(stdout),
    zeroImageTextRead: true,
    oneShotBrowserLifecycle: "cloak-fetch owns and closes its browser",
    excerpts,
  };
  records.push(record);
  console.log(JSON.stringify(record, null, 2));
}

fs.writeFileSync(
  path.join(root, "primary-text-receipt.json"),
  JSON.stringify({ sources: records, imagesOpened: 0 }, null, 2) + "\n",
  { flag: "wx" },
);
if (records.some((record) => record.exitCode !== 0 || !record.HTTP200Observed)) {
  process.exitCode = 1;
}
