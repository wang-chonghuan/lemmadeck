#!/usr/bin/env node
/**
 * cap5：每个小节出两张自包含 HTML —— 课文页 + 习题页，白底。
 *
 * 自包含 = 不依赖网络也不依赖同级文件：KaTeX 服务端渲染成静态 HTML（页面不需要
 * JS），KaTeX 的 CSS 与 woff2 字体以 data URI 内联，插图 SVG 或 PNG 直接内联。
 *
 * 坑：katex.min.css 里 src 是 @font-face 的最后一条声明，以 } 结尾而非 ;。
 * 按 ; 匹配会一个字体都替换不到，页面看着能用（系统字体兜底）但并不自包含。
 * 所以内联数为 0 直接抛错，不允许静默降级。
 *
 * 用法: render_lesson.js <bookDir> --out <dir> [--edition <name>] [--lesson <lessonId>]... [--text-only | --titles-only | --groups-only]
 */
const fs = require("fs");
const path = require("path");
const katex = require("katex");
const { spawnSync } = require("node:child_process");
const { proseFlow, proseInline: sharedProseInline } = require("./htmlfrag.js");
const { sourceNumberForArtifact } = require("./publish_merge.js");
const { choiceHtml } = require("./choice_html.mjs");

const SKILL = path.resolve(__dirname, "..");
const KATEX_DIST = path.join(SKILL, "node_modules", "katex", "dist");
const args = process.argv.slice(2);
const bookDir = args.find((arg) => !arg.startsWith("--"));
const editionName = args.includes("--edition") ? args[args.indexOf("--edition") + 1] : null;
const outRoot = args.includes("--out") ? args[args.indexOf("--out") + 1] : null;
const textOnly = args.includes("--text-only");
const titlesOnly = args.includes("--titles-only");
const groupsOnly = args.includes("--groups-only");
if ([textOnly, titlesOnly, groupsOnly].filter(Boolean).length > 1) {
  throw new Error("Select only one partial render surface");
}
const onlyLessons = new Set(args.flatMap((arg, index) =>
  arg === "--lesson" && args[index + 1] ? [args[index + 1]] : []));
if (!bookDir || !outRoot) {
  console.error("用法: render_lesson.js <bookDir> --out <dir> [--edition <name>] [--lesson <lessonId>]...");
  process.exit(2);
}

function katexCss() {
  let css = fs.readFileSync(path.join(KATEX_DIST, "katex.min.css"), "utf8");
  let n = 0;
  css = css.replace(/src:[^;}]*(?=[;}])/g, (src) => {
    const m = src.match(/url\(fonts\/(KaTeX_[\w-]+)\.woff2\)/);
    if (!m) return src;
    const f = path.join(KATEX_DIST, "fonts", `${m[1]}.woff2`);
    if (!fs.existsSync(f)) return src;
    n += 1;
    return `src:url(data:font/woff2;base64,${fs.readFileSync(f).toString("base64")}) format('woff2')`;
  });
  if (n === 0) throw new Error("KaTeX 字体一个都没内联成功——HTML 不会是自包含的");
  return css;
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escText = (s) => esc(s).replace(/\r?\n/g, "<br>");
// 还原转写中的黑体和强调标记，不改变正文。
const strong = (h) => h.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
  .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, "<em>$1</em>");
const MATH = /\$\$(.+?)\$\$|\$([^$]+?)\$/gs;
// 公式后面紧跟的标点必须与公式绑在一起，否则 `$…$;` 的分号会被甩到下一行
const TRAIL = /^[;,.、，。：:！!？?)）\]]+/;

function renderInline(text, renderText) {
  let out = "", last = 0;
  for (const m of text.matchAll(MATH)) {
    out += renderText(text.slice(last, m.index));
    const tex = m[1] ?? m[2];
    let html;
    try {
      html = katex.renderToString(tex, { displayMode: !!m[1], throwOnError: false });
    } catch (e) { html = `<span class="err">${esc(tex)}</span>`; }
    last = m.index + m[0].length;
    const t = (text.slice(last).match(TRAIL) || [""])[0];
    last += t.length;
    out += `<span class="nb">${html}${esc(t)}</span>`;
  }
  return strong(out + renderText(text.slice(last)));
}

const inline = (text) => renderInline(text, escText);
const proseInline = (text) => sharedProseInline(text)
  .replace(/class="sr-prose-math"/g, 'class="prose-math"')
  .replace(/class="sr-nb"/g, 'class="nb"')
  .replace(/class="sr-tex-err"/g, 'class="err"');

function figureContract(contentRoot, id, strictEdition, manifest) {
  const fallback = {
    mode: strictEdition ? "deterministic" : "source",
    layout: "inline",
    purpose: "instructional",
    maxWidthPx: null,
  };
  if (!strictEdition) return fallback;
  const entry = manifest.find((item) => item.id === id);
  if (!entry?.spec) throw new Error(`${id}: missing edition figure contract`);
  const specPath = path.join(contentRoot, entry.spec);
  const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
  const outputs = spec.mode === "generated" ? ["png"]
    : spec.mode === "hybrid" ? ["svg", "artwork"]
    : spec.mode === "deterministic" ? ["svg"] : [];
  if (!outputs.length) throw new Error(`${id}: unsupported figure mode ${spec.mode}`);
  for (const output of outputs) {
    if (!entry[output] || !fs.existsSync(path.join(contentRoot, entry[output]))) {
      throw new Error(`${id}: missing declared ${output}`);
    }
  }
  const display = spec.display || {};
  return {
    mode: spec.mode || fallback.mode,
    assets: Object.fromEntries(outputs.map((output) =>
      [output, path.join(contentRoot, entry[output])])),
    layout: display.layout === "scroll" ? "scroll" : "inline",
    purpose: display.purpose === "decorative" ? "decorative" : "instructional",
    maxWidthPx: Number.isInteger(display.maxWidthPx)
      && display.maxWidthPx >= 128
      && display.maxWidthPx <= 960
      ? display.maxWidthPx
      : null,
  };
}

function figure(contentRoot, id, label, strictEdition, manifest = []) {
  const contract = figureContract(contentRoot, id, strictEdition, manifest);
  const svg = strictEdition ? contract.assets.svg : path.join(contentRoot, "figures", `${id}.svg`);
  const png = strictEdition ? contract.assets.png : path.join(contentRoot, "figures", `${id}.png`);
  const mediaStyle = contract.maxWidthPx
    ? ` style="width:${contract.maxWidthPx}px;max-width:100%"`
    : "";
  const open = `<figure class="fig" id="${id}" aria-label="${esc(label || id)}"`
    + ` data-figure-layout="${contract.layout}"`
    + ` data-figure-purpose="${contract.purpose}"><div class="figure-media"`
    + ` data-figure-mode="${contract.mode}" data-figure-theme="neutral"${mediaStyle}>`;
  const close = "</div></figure>";
  if (strictEdition && contract.mode === "hybrid") {
    const artwork = contract.assets.artwork;
    const b64 = fs.readFileSync(artwork).toString("base64");
    const vector = fs.readFileSync(svg, "utf8").replace(/<\?xml[^>]*\?>/, "");
    return open + `<div class="figure-layered"><img class="figure-artwork" `
      + `alt="${esc(label || id)}" src="data:image/png;base64,${b64}">`
      + `<div class="figure-vector">${vector}</div></div>` + close;
  }
  if (strictEdition && contract.mode === "generated") {
    const b64 = fs.readFileSync(png).toString("base64");
    return open + `<img alt="${esc(label || id)}" `
      + `src="data:image/png;base64,${b64}">` + close;
  }
  if (svg && fs.existsSync(svg)) {
    return open + fs.readFileSync(svg, "utf8").replace(/<\?xml[^>]*\?>/, "") + close;
  }
  if (png && fs.existsSync(png)) {
    const b64 = fs.readFileSync(png).toString("base64");
    return open + `<img alt="${esc(label || id)}" `
      + `src="data:image/png;base64,${b64}">` + close;
  }
  if (strictEdition) return `<p class="err">缺少现代图片 ${esc(id)}</p>`;
  return `<p class="err">缺图 ${esc(id)}</p>`;
}

const CSS = `
${katexCss()}
:root{--ink:#1b1b1b;--sub:#6b6b6b;--rule:#e3e3e3;--accent:#2b5f8e}
*{box-sizing:border-box}
body{margin:0;background:#fff;color:var(--ink);
  font-family:"Songti SC","Source Han Serif SC","Noto Serif CJK SC",SimSun,serif}
.sheet{max-width:46em;margin:0 auto;padding:2.4em 1.6em 5em}
h1{font-size:1.6em;margin:0 0 .2em;letter-spacing:.02em}
.crumb{color:var(--sub);font-size:.82em;margin:0 0 2em;
  font-family:ui-monospace,Menlo,monospace}
p.para{margin:0 0 1em;text-indent:0;line-height:1.95;font-size:1.06em}
p.para .katex,.prose-math{font-size:1.1em}
.prose-math{font-family:KaTeX_Main,serif}
p.para.section{border-top:1px solid var(--rule);margin-top:1.5em;padding-top:1.35em}
.figcap{text-align:center;color:var(--sub);font-size:.85em;margin:.2em 0 1.2em}
.fig{margin:1.3em 0 .2em;text-align:center;max-width:100%}
.figure-media{--ld-figure-ink:var(--ink);--ld-figure-muted:var(--sub);
  --ld-figure-accent:var(--ink);--ld-figure-accent-soft:var(--sub);
  --ld-figure-grid:var(--rule);--ld-figure-paper:#fff;display:block;
  margin:0 auto;width:fit-content;max-width:min(100%,30em);font-size:16px}
.figure-media svg,.figure-media img{display:block;width:100%;max-width:100%;height:auto}
.figure-layered{display:grid}
.figure-layered>.figure-artwork,.figure-layered>.figure-vector{grid-area:1/1}
.figure-vector{display:block;width:100%;max-width:100%;height:auto}
.nb{display:inline-block;max-width:100%;overflow-x:auto;vertical-align:middle;white-space:nowrap}
.err{color:#a3341f;background:#fdeeea;padding:1px 5px;border-radius:3px}
.exgroup{margin:2.2em 0 .8em;font-weight:700;font-size:1.05em;
  border-left:3px solid var(--accent);padding-left:.6em}
ol.ex{list-style:none;margin:0;padding:0;counter-reset:none}
li.ex{display:grid;grid-template-columns:3.2em 1fr;gap:.2em .4em;
  padding:.85em 0;border-top:1px solid var(--rule)}
li.ex .no{font-family:ui-monospace,Menlo,monospace;color:var(--accent);
  font-weight:700;padding-top:.15em}
li.ex .body{min-width:0;overflow-x:auto;line-height:1.9;font-size:1.04em}
li.ex .body .fig{margin:.7em 0 0;text-align:left}
li.ex .body .figure-media{margin:0;max-width:min(100%,22em)}
.choice{border-top:1px solid var(--rule);padding:1.2em 0;line-height:1.9}
.choice-stem{margin:0 0 .8em;font-size:1.04em}
.choice-options{list-style:none;margin:0;padding:0}
.choice-options li{display:grid;grid-template-columns:1.6em minmax(0,1fr);gap:.5em;
  padding:.45em 0}
.choice-options input{margin:.45em 0 0;width:16px;height:16px}
.choice-options table{border-collapse:collapse;max-width:100%}
.choice-options th,.choice-options td{border:1px solid var(--rule);padding:.35em .6em}
.choice-options .option-body{min-width:0;overflow-x:auto}
.fig[data-figure-layout="scroll"]{overflow-x:auto;overflow-y:hidden;scrollbar-width:thin}
.fig[data-figure-layout="scroll"] .figure-media,
li.ex .body .fig[data-figure-layout="scroll"] .figure-media{
  width:40em;max-width:none}
.jump{display:inline-block;margin:2.5em 0 0;padding:.55em 1.1em;border-radius:6px;
  background:var(--accent);color:#fff;text-decoration:none;font-size:.95em}
.src{color:var(--sub);font-size:.78em;font-family:ui-monospace,Menlo,monospace}
@media (max-width:640px){.sheet{padding:1.4em 1em 4em}li.ex{grid-template-columns:2.6em 1fr}}
`;

function page(title, crumb, bodyHtml) {
  return `<!DOCTYPE html><meta charset="utf-8"><title>${esc(title)}</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>${CSS}</style><div class="sheet"><h1>${inline(title)}</h1>
<div class="crumb">${esc(crumb)}</div>${bodyHtml}</div>`;
}

const book = path.resolve(bookDir);
const contentRoot = editionName ? path.join(book, "editions", editionName) : book;
const lessonDirs = fs.readdirSync(path.join(contentRoot, "lessons"))
  .filter((d) => onlyLessons.size === 0 || onlyLessons.has(d)).sort();
const done = [];

for (const lid of lessonDirs) {
  const dir = path.join(contentRoot, "lessons", lid);
  const outDir = path.resolve(outRoot, lid);
  fs.mkdirSync(outDir, { recursive: true });
  const L = JSON.parse(fs.readFileSync(path.join(dir, "lesson.json"), "utf8"));
  const X = JSON.parse(fs.readFileSync(path.join(dir, "exercises.json"), "utf8"));
  const manifest = editionName
    ? JSON.parse(fs.readFileSync(path.join(dir, "figures.json"), "utf8")).figures : [];
  const renderFigure = (id, label) => figure(contentRoot, id, label, !!editionName, manifest);
  const choiceDir = path.join(dir, "choice-set");
  if (groupsOnly) {
    const counts = new Map();
    let previous = null;
    for (const exercise of X.exercises) {
      if (exercise.group === previous) continue;
      previous = exercise.group;
      const label = previous || "练习";
      counts.set(label, (counts.get(label) || 0) + 1);
    }
    const file = path.join(outDir, "exercises.html");
    let html = fs.readFileSync(file, "utf8");
    let changed = 0;
    for (const [label, count] of counts) {
      const before = `<div class="exgroup">${esc(label)}</div>`;
      const after = `<div class="exgroup">${inline(label)}</div>`;
      if (before === after) continue;
      if (html.split(before).length - 1 !== count) {
        throw new Error(`${lid}: existing group heading does not match approved label`);
      }
      html = html.split(before).join(after);
      changed += count;
    }
    if (!changed) throw new Error(`${lid}: no unrendered group headings`);
    fs.writeFileSync(file, html);
    done.push({ lesson: lid, surface: "groups", headings: changed, output: outDir });
    continue;
  }
  if (titlesOnly) {
    const title = L.printed_title || L.title;
    const surfaces = [["text", title], ["exercises", `${title} · 习题`]];
    if (fs.existsSync(choiceDir)) surfaces.push(["choices", `${title} · 选择题`]);
    const replacements = surfaces.map(([surface, heading]) => {
      const file = path.join(outDir, `${surface}.html`);
      const html = fs.readFileSync(file, "utf8");
      const oldHeading = `<h1>${esc(heading)}</h1>`;
      if (html.split(oldHeading).length !== 2 || (html.match(/<h1>/g) || []).length !== 1) {
        throw new Error(`${lid}/${surface}: existing plain heading does not match approved title`);
      }
      return { file, html: html.replace(oldHeading, () => `<h1>${inline(heading)}</h1>`) };
    });
    for (const replacement of replacements) fs.writeFileSync(replacement.file, replacement.html);
    done.push({ lesson: lid, surface: "titles", pages: replacements.length, output: outDir });
    continue;
  }
  const crumb = [L.chapter, L.section, `印刷页 ${L.start_printed ?? "?"}`]
    .filter(Boolean).join(" · ");

  // ---- 课文页
  let body = "";
  const prose = proseFlow(L.prose, L.section_breaks);
  for (const b of prose) {
    if (b.kind === "fig") body += renderFigure(b.id, b.label);
    else if (b.kind === "cap") body += `<div class="figcap">${proseInline(b.text)}</div>`;
    else {
      body += `<p class="para${b.sectionBreak ? " section" : ""}">${proseInline(b.text)}</p>`;
    }
  }
  body += `<a class="jump" href="exercises.html">去做题 · ${X.count} 道 →</a>`;
  if (fs.existsSync(choiceDir)) body += `<a class="jump" href="choices.html">选择题 →</a>`;
  fs.writeFileSync(path.join(outDir, "text.html"),
    page(L.printed_title || L.title, crumb, body));
  if (textOnly) {
    done.push({ lesson: lid, surface: "text", prose: prose.length, output: outDir });
    continue;
  }

  // ---- 习题页：每题独立编号，带自己的图
  let group = null, out = "";
  for (const e of X.exercises) {
    if (e.group !== group) {
      if (out) out += "</ol>";
      group = e.group;
      out += `<div class="exgroup">${inline(group || "练习")}</div><ol class="ex">`;
    }
    const figs = (e.figures || [])
      .map((f) => renderFigure(f.id, f.label)).join("");
    const printedNumber = sourceNumberForArtifact(e);
    const sourceNumber = printedNumber == null ? "" : `${esc(String(printedNumber))}.`;
    out += `<li class="ex" id="ex-${esc(e.number)}"><div class="no">${sourceNumber}</div>`
      + `<div class="body">${inline(e.text)}${figs}</div></li>`;
  }
  if (out) out += "</ol>";
  out += `<a class="jump" href="text.html">← 回课文</a>`;
  fs.writeFileSync(path.join(outDir, "exercises.html"),
    page(`${L.printed_title || L.title} · 习题`, crumb, out));
  let choiceCount = 0;
  if (fs.existsSync(choiceDir)) {
    const repo = path.resolve(SKILL, "../../..");
    const gate = spawnSync(process.env.PYTHON || "python3", [
      path.join(repo, ".agents/skills/ld-s10y-choice/scripts/validate.py"), "--repo", repo,
      "--seed", path.join(choiceDir, "seed.json"),
      "--draft", path.join(choiceDir, "draft.json"),
      "--review", path.join(choiceDir, "review.json"),
    ], { encoding: "utf8" });
    if (gate.error || gate.status !== 0) {
      throw new Error(`${lid}: ${gate.error?.message || gate.stderr || gate.stdout}`);
    }
    const seed = JSON.parse(fs.readFileSync(path.join(choiceDir, "seed.json"), "utf8"));
    if (seed.source.book !== path.basename(book) || seed.source.lesson !== lid) {
      throw new Error(`${lid}: choice seed belongs to another lesson`);
    }
    const draft = JSON.parse(fs.readFileSync(path.join(choiceDir, "draft.json"), "utf8"));
    const choiceManifest = [...manifest, ...draft.new_figures.map((item) => ({
      id: item.id,
      spec: path.relative(contentRoot, path.resolve(repo, item.path.replace(/\.[^.]+$/, ".spec.json"))),
      [item.path.endsWith(".svg") ? "svg" : "png"]:
        path.relative(contentRoot, path.resolve(repo, item.path)),
    }))];
    const choiceFigures = (ids) => ids.map((id) =>
      figure(contentRoot, id, null, true, choiceManifest)).join("");
    const html = draft.questions.map(({ id, view }, index) =>
      `<section class="choice" id="choice-${esc(id)}" data-choice-mode="${view.mode}">`
      + `<div class="choice-stem">${index + 1}. ${choiceHtml(view.stem)}</div>`
      + choiceFigures(view.figure_ids)
      + `<ul class="choice-options">${view.options.map((option) =>
        `<li><input type="${view.mode === "single" ? "radio" : "checkbox"}" disabled`
        + ` aria-label="${esc(option.id)}"><div class="option-body">`
        + `${esc(option.id)}. ${choiceHtml(option.text)}${choiceFigures(option.figure_ids)}</div></li>`
      ).join("")}</ul></section>`
    ).join("");
    fs.writeFileSync(path.join(outDir, "choices.html"),
      page(`${L.printed_title || L.title} · 选择题`, crumb, html));
    choiceCount = draft.questions.length;
  }
  done.push({ lesson: lid, exercises: X.count, choices: choiceCount, prose: prose.length, output: outDir });
}

console.log(JSON.stringify({ ok: true, lessons: done }, null, 2));
