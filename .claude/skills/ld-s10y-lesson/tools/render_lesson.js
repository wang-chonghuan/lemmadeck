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
 * 用法: render_lesson.js <bookDir> --out <dir> [--edition <name>] [--lesson <lessonId>]...
 */
const fs = require("fs");
const path = require("path");
const katex = require("katex");
const { proseFlow } = require("./htmlfrag.js");
const { sourceNumberForArtifact } = require("./publish_merge.js");

const SKILL = path.resolve(__dirname, "..");
const KATEX_DIST = path.join(SKILL, "node_modules", "katex", "dist");
const args = process.argv.slice(2);
const bookDir = args.find((arg) => !arg.startsWith("--"));
const editionName = args.includes("--edition") ? args[args.indexOf("--edition") + 1] : null;
const outRoot = args.includes("--out") ? args[args.indexOf("--out") + 1] : null;
const choicesOnly = args.includes("--choices-only");
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
const PROSE_MATH = /[A-Za-z0-9]+(?:\.[0-9]+)*/g;
const escProseText = (text) => {
  let out = "", last = 0;
  for (const match of text.matchAll(PROSE_MATH)) {
    out += esc(text.slice(last, match.index));
    out += `<span class="prose-math">${esc(match[0])}</span>`;
    last = match.index + match[0].length;
  }
  return (out + esc(text.slice(last))).replace(/\r?\n/g, "<br>");
};
// 原书用黑体排定义句，转写时记成 **…**，这里还原成 <strong>
const strong = (h) => h.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
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
const proseInline = (text) => renderInline(text, escProseText);

function figureContract(contentRoot, id, strictEdition) {
  const fallback = {
    mode: strictEdition ? "deterministic" : "source",
    layout: "inline",
    purpose: "instructional",
    maxWidthPx: null,
  };
  if (!strictEdition) return fallback;
  const specPath = path.join(contentRoot, "figures", `${id}.spec.json`);
  if (!fs.existsSync(specPath)) return fallback;
  const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
  const display = spec.display || {};
  return {
    mode: spec.mode || fallback.mode,
    layout: display.layout === "scroll" ? "scroll" : "inline",
    purpose: display.purpose === "decorative" ? "decorative" : "instructional",
    maxWidthPx: Number.isInteger(display.maxWidthPx)
      && display.maxWidthPx >= 128
      && display.maxWidthPx <= 960
      ? display.maxWidthPx
      : null,
  };
}

function figureOpen(id, label, contract) {
  const mediaStyle = contract.maxWidthPx
    ? ` style="width:${contract.maxWidthPx}px;max-width:100%"`
    : "";
  return `<figure class="fig" id="${id}" aria-label="${esc(label || id)}"`
    + ` data-figure-layout="${contract.layout}"`
    + ` data-figure-purpose="${contract.purpose}"><div class="figure-media"`
    + ` data-figure-mode="${contract.mode}" data-figure-theme="neutral"${mediaStyle}>`;
}

function figure(contentRoot, id, label, strictEdition) {
  const svg = path.join(contentRoot, "figures", `${id}.svg`);
  const png = path.join(contentRoot, "figures", `${id}.png`);
  const contract = figureContract(contentRoot, id, strictEdition);
  const open = figureOpen(id, label, contract);
  const close = "</div></figure>";
  if (strictEdition && contract.mode === "hybrid") {
    const artwork = path.join(contentRoot, "figures", `${id}.artwork.png`);
    if (!fs.existsSync(artwork) || !fs.existsSync(svg)) {
      return `<p class="err">缺少现代分层图片 ${esc(id)}</p>`;
    }
    const b64 = fs.readFileSync(artwork).toString("base64");
    const vector = fs.readFileSync(svg, "utf8").replace(/<\?xml[^>]*\?>/, "");
    return open + `<div class="figure-layered"><img class="figure-artwork" `
      + `alt="${esc(label || id)}" src="data:image/png;base64,${b64}">`
      + `<div class="figure-vector">${vector}</div></div>` + close;
  }
  if (strictEdition && fs.existsSync(png)) {
    const b64 = fs.readFileSync(png).toString("base64");
    return open + `<img alt="${esc(label || id)}" `
      + `src="data:image/png;base64,${b64}">` + close;
  }
  if (fs.existsSync(svg)) {
    return open + fs.readFileSync(svg, "utf8").replace(/<\?xml[^>]*\?>/, "") + close;
  }
  if (fs.existsSync(png)) {
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
.nb,.sr-nb{display:inline-block;max-width:100%;overflow-x:auto;overflow-y:hidden;
  scrollbar-width:none;padding-block:calc(.2em + 1px);margin-block:-.2em;
  vertical-align:middle;white-space:nowrap}
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
.choice{padding:1em 0;border-top:1px solid var(--rule);line-height:1.9}
.choice-heading{color:var(--accent);font-size:.85em;margin:0 0 .4em}
.choice-stem,.choice-option-body{min-width:0;overflow-x:auto;overflow-y:hidden;
  padding-block:.25em;margin-block:-.25em}
.choice-options{list-style:none;margin:.7em 0 0;padding:0}
.choice-options>li{display:grid;grid-template-columns:1.8em minmax(0,1fr);
  gap:.5em;padding:.4em 0}
.choice-options .option-id{font-family:ui-monospace,Menlo,monospace;color:var(--sub)}
.choice table{border-collapse:collapse;min-width:100%;white-space:nowrap}
.choice th,.choice td{border:1px solid var(--rule);padding:.35em .6em;text-align:left}
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
  const tabTitle = title.replace(/\*\*([^*]+)\*\*/g, "$1");
  return `<!DOCTYPE html><meta charset="utf-8"><title>${esc(tabTitle)}</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>${CSS}</style><div class="sheet"><h1>${inline(title)}</h1>
<div class="crumb">${inline(crumb)}</div>${bodyHtml}</div>`;
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
  const crumb = [L.chapter, L.section, `印刷页 ${L.start_printed ?? "?"}`]
    .filter(Boolean).join(" · ");

  if (choicesOnly) {
    done.push({ lesson: lid, output: outDir, sourcePagesSkipped: true });
    continue;
  }

  // ---- 课文页
  let body = "";
  const prose = proseFlow(L.prose, L.section_breaks);
  for (const b of prose) {
    if (b.kind === "fig") body += figure(contentRoot, b.id, b.label, !!editionName);
    else if (b.kind === "cap") body += `<div class="figcap">${proseInline(b.text)}</div>`;
    else {
      body += `<p class="para${b.sectionBreak ? " section" : ""}">${proseInline(b.text)}</p>`;
    }
  }
  body += `<a class="jump" href="exercises.html">去做题 · ${X.count} 道 →</a>`;
  fs.writeFileSync(path.join(outDir, "text.html"),
    page(L.printed_title || L.title, crumb, body));

  // ---- 习题页：每题独立编号，带自己的图
  let group = null, out = "";
  for (const e of X.exercises) {
    if (e.group !== group) {
      if (out) out += "</ol>";
      group = e.group;
      out += `<div class="exgroup">${inline(group || "练习")}</div><ol class="ex">`;
    }
    const figs = (e.figures || [])
      .map((f) => figure(contentRoot, f.id, f.label, !!editionName)).join("");
    const printedNumber = sourceNumberForArtifact(e);
    const sourceNumber = printedNumber == null ? "" : `${esc(String(printedNumber))}.`;
    const prefix = printedNumber == null ? "" : String(printedNumber);
    const suffix = e.text.slice(prefix.length);
    const hasPrintedPrefix = prefix && e.text.startsWith(prefix)
      && (/^\.\s/.test(suffix) || /^\uFF0E(?![0-9\uFF10-\uFF19])/.test(suffix));
    const displayText = hasPrintedPrefix
      ? e.text.slice(prefix.length + 1).trimStart()
      : e.text;
    out += `<li class="ex" id="ex-${esc(e.number)}"><div class="no">${sourceNumber}</div>`
      + `<div class="body">${inline(displayText)}${figs}</div></li>`;
  }
  if (out) out += "</ol>";
  out += `<a class="jump" href="text.html">← 回课文</a>`;
  fs.writeFileSync(path.join(outDir, "exercises.html"),
    page(`${L.printed_title || L.title} · 习题`, crumb, out));
  done.push({ lesson: lid, exercises: X.count, prose: prose.length, output: outDir });
}

async function renderChoicePages() {
  const { choiceHtml } = await import("./choice_html.mjs");
  const repo = path.resolve(SKILL, "../../..");
  for (const record of done) {
    const choiceDir = path.join(contentRoot, "lessons", record.lesson, "choice-set");
    const draftPath = path.join(choiceDir, "draft.json");
    if (!fs.existsSync(draftPath)) continue;
    const draft = JSON.parse(fs.readFileSync(draftPath, "utf8"));
    const seed = JSON.parse(fs.readFileSync(path.join(choiceDir, "seed.json"), "utf8"));
    if (draft.schema !== "s10y-choice-draft-v1"
      || seed.schema !== "s10y-choice-seed-v1"
      || seed.source.lesson !== record.lesson
      || seed.source.book !== path.basename(book)) {
      throw new Error(`${record.lesson}: 选择题快照或课程身份不匹配`);
    }
    const sourceFigures = new Set(seed.figures.map((item) => item.id));
    const assets = new Map(draft.new_figures.map((item) => [item.id, [{ path: item.path }]]));
    const renderFigures = (ids) => ids.map((id) => {
      if (sourceFigures.has(id)) return figure(contentRoot, id, null, !!editionName);
      const entries = assets.get(id);
      if (!entries?.length) throw new Error(`${record.lesson}: 缺少选择题图片 ${id}`);
      const specPath = path.join(choiceDir, "figures", `${id}.spec.json`);
      const retainedRoot = fs.realpathSync(book);
      if (!fs.existsSync(specPath)
        || !fs.realpathSync(specPath).startsWith(`${retainedRoot}${path.sep}`)) {
        throw new Error(`${record.lesson}: 缺少持久选择题图片显示规范 ${id}`);
      }
      const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
      if (spec.id !== id || !["inline", "scroll"].includes(spec.display?.layout)
        || !["instructional", "decorative"].includes(spec.display?.purpose)) {
        throw new Error(`${record.lesson}: 选择题图片显示规范无效 ${id}`);
      }
      const contract = figureContract(choiceDir, id, true);
      const media = entries.map((entry) => {
        const assetPath = path.resolve(repo, entry.path);
        if (!fs.realpathSync(assetPath).startsWith(`${retainedRoot}${path.sep}`)) {
          throw new Error(`${record.lesson}: 选择题图片不在本书持久目录内`);
        }
        const bytes = fs.readFileSync(assetPath);
        if (path.extname(assetPath) === ".svg") {
          return bytes.toString("utf8").replace(/<\?xml[^>]*\?>/, "");
        }
        const ext = path.extname(assetPath).slice(1);
        const type = ext === "jpg" ? "jpeg" : ext;
        return `<img alt="${esc(id)}" src="data:image/${type};base64,${bytes.toString("base64")}">`;
      }).join("");
      return figureOpen(id, null, contract) + media + "</div></figure>";
    }).join("");
    let body = "";
    for (const [index, question] of draft.questions.entries()) {
      const view = question.view;
      body += `<section class="choice"><p class="choice-heading">${index + 1}. `
        + `${view.mode === "multiple" ? "多选" : "单选"}</p>`
        + `<div class="choice-stem">${choiceHtml(view.stem)}${renderFigures(view.figure_ids)}</div>`
        + `<ol class="choice-options">`
        + view.options.map((option, optionIndex) => `<li><span class="option-id">${String.fromCharCode(65 + optionIndex)}</span>`
          + `<div class="choice-option-body">${choiceHtml(option.text)}`
          + `${renderFigures(option.figure_ids)}</div></li>`).join("")
        + `</ol></section>`;
    }
    const L = JSON.parse(fs.readFileSync(
      path.join(contentRoot, "lessons", record.lesson, "lesson.json"), "utf8",
    ));
    fs.writeFileSync(path.join(record.output, "choices.html"),
      page(`${L.printed_title || L.title} · 选择题`, "", body));
    record.choices = draft.questions.length;
  }
}

renderChoicePages().then(() => {
  console.log(JSON.stringify({ ok: true, lessons: done }, null, 2));
}).catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
