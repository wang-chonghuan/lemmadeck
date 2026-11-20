const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const root = __dirname;
const repo = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
if (process.cwd() !== repo) throw new Error("Explicit review workdir required");
const digest = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const output = (name, value) => {
  const target = path.resolve(root, name);
  if (!target.startsWith(root + "/")) throw new Error("Outside review output root");
  fs.writeFileSync(target, JSON.stringify(value, null, 2) + "\n");
};
const bindingFile = path.join(root, "input-bindings-before.json");
let bindings = fs.existsSync(bindingFile) ? JSON.parse(fs.readFileSync(bindingFile)) : [];
function read(file, print = false) {
  const target = path.resolve(repo, file);
  const bytes = fs.readFileSync(target);
  const hash = digest(bytes);
  const old = bindings.find((item) => item.path === target);
  if (old && old.sha256Before !== hash) throw new Error("Input drift: " + target);
  if (!old) {
    bindings.push({ path: target, sha256Before: hash });
    output("input-bindings-before.json", bindings);
  }
  if (print) console.log(JSON.stringify({ path: target, sha256Before: hash }) + "\n" + bytes.toString());
  return bytes;
}
function finishBindings() {
  return bindings.map((item) => ({ ...item, sha256After: digest(fs.readFileSync(item.path)) }));
}
function index() {
  const files = [];
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (file !== path.join(root, "output-index.json")) {
        const bytes = fs.readFileSync(file);
        files.push({ path: file, sha256: digest(bytes), bytes: bytes.length, mode: "0" + (fs.statSync(file).mode & 0o777).toString(8) });
      }
    }
  };
  walk(root);
  output("output-index.json", { schema: "review-output-index@1", files: files.sort((a, b) => a.path.localeCompare(b.path)) });
}
module.exports = { read, output, finishBindings, index, digest, root, repo };
if (require.main === module) {
  const [command, ...files] = process.argv.slice(2);
  if (command === "read") files.forEach((file) => read(file, true));
  else if (command === "bind") files.forEach((file) => { read(file); console.log(JSON.stringify(bindings.find((item) => item.path === path.resolve(repo, file)))); });
  else if (command === "index") index();
  else if (command === "bindings") console.log(JSON.stringify(finishBindings(), null, 2));
  else throw new Error("Unknown evidence operation");
}
