import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const sources = [
  {
    id: "openstax-intensity",
    url: "https://openstax.org/books/university-physics-volume-1/pages/17-3-sound-intensity",
    title: "OpenStax University Physics Volume 1, 17.3 Sound Intensity",
    purpose: "Check intensity as power per area, fixed-medium amplitude scaling and spherical spreading.",
  },
  {
    id: "usgs-body-waves",
    url: "https://earthquake.usgs.gov/earthquakes/events/1906calif/18april/earthwaves.php",
    title: "USGS: Body waves inside the earth",
    purpose: "Check P/S polarization, relative arrival order and the fluid shear-wave restriction.",
  },
  {
    id: "usgs-travel-times",
    url: "https://www.usgs.gov/programs/earthquake-hazards/earthquake-travel-times",
    title: "USGS: Earthquake Travel Times",
    purpose: "Check that S-P distance inference uses a source-depth and travel-path model.",
  },
];
const receipts = [];
for (const source of sources) {
  const startedAt = new Date().toISOString();
  const result = spawnSync("cloak-fetch", [source.url], {
    encoding: "utf8",
    timeout: 180000,
    maxBuffer: 8 * 1024 * 1024,
  });
  const output = path.join(root, `${source.id}.txt`);
  const errorOutput = path.join(root, `${source.id}.stderr.txt`);
  fs.writeFileSync(output, result.stdout ?? "");
  fs.writeFileSync(errorOutput, result.stderr ?? "");
  receipts.push({
    ...source,
    startedAt,
    completedAt: new Date().toISOString(),
    command: ["cloak-fetch", source.url],
    exitCode: result.status,
    signal: result.signal,
    error: result.error?.message ?? null,
    text: {
      path: output,
      sha256: crypto.createHash("sha256").update(fs.readFileSync(output)).digest("hex"),
    },
    stderr: {
      path: errorOutput,
      sha256: crypto.createHash("sha256").update(fs.readFileSync(errorOutput)).digest("hex"),
    },
    imagesOpened: 0,
    screenshotRequested: false,
  });
}
fs.writeFileSync(path.join(root, "primary-capture.json"), `${JSON.stringify(receipts, null, 2)}\n`);
console.log(JSON.stringify(receipts.map(({ id, exitCode, error, text }) => ({ id, exitCode, error, text })), null, 2));
if (receipts.some((receipt) => receipt.exitCode !== 0)) process.exitCode = 1;
