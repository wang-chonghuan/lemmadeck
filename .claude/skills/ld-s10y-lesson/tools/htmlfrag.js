/**
 * 文本 → 可直接嵌进宿主页面的 HTML 片段。
 *
 * 与 render_lesson.js 的整份自包含文档不同，这里产出的是**片段**：没有 <style>、
 * 没有内联字体、没有自己的排版。给 app 用的就是它——课文塞进 iframe 会变成"文档中的
 * 文档"，字体和版式与产品两套，高度还得靠 JS 猜（正是操作栏被压住的由来）。片段则由
 * 宿主排版，KaTeX 的 CSS 宿主装一次即可。
 */
const fs = require("fs")
const path = require("path")
const katex = require("katex")

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
const escText = (s) => esc(s).replace(/\r?\n/g, "<br>")
const PROSE_MATH = /[A-Za-z0-9]+(?:\.[0-9]+)*/g
const escProseText = (text) => {
  let out = "", last = 0
  for (const match of text.matchAll(PROSE_MATH)) {
    out += esc(text.slice(last, match.index))
    out += `<span class="sr-prose-math">${esc(match[0])}</span>`
    last = match.index + match[0].length
  }
  return (out + esc(text.slice(last))).replace(/\r?\n/g, "<br>")
}
// 还原转写中的黑体和强调标记，不改变正文。
const strong = (h) => h.replace(
  /(?<![\\*])(\*{1,3})(?!\*)([\s\S]+?)(?<![\\*])\1(?!\*)/g,
  (_, marker, body) => {
    const content = strong(body)
    if (marker === "***") return `<em><strong>${content}</strong></em>`
    return marker === "**" ? `<strong>${content}</strong>` : `<em>${content}</em>`
  },
)
const MATH = /\$\$(.+?)\$\$|\$([^$]+?)\$/gs
const SOURCE_TAG = /<\/?[A-Za-z](?:[^<>"']|"[^"]*"|'[^']*')*>/g
const SOURCE_ENTITY = /&#(?:[0-9]{1,7}|x[0-9a-fA-F]{1,6});/
const INLINE_TOKEN = new RegExp(`${MATH.source}|${SOURCE_TAG.source}|${SOURCE_ENTITY.source}`, "gs")
const SOURCE_DOTS = /^<span\s+style=(["'])\s*(text-emphasis-style\s*:\s*dot|text-emphasis\s*:\s*filled\s+dot)\s*;\s*text-emphasis-position\s*:\s*under\s*;?\s*\1\s*>$/
function sourceTagHtml(tag) {
  if (/^<\/?(?:strong|em|sup|small)>$/.test(tag) || tag === "</span>") return tag
  const dots = tag.match(SOURCE_DOTS)
  if (!dots) return null
  const style = dots[2].startsWith("text-emphasis-style")
    ? "text-emphasis-style: dot" : "text-emphasis: filled dot"
  return `<span style="${style}; text-emphasis-position: under;">`
}
// 公式后面紧跟的标点要与公式绑在一起，否则 `$…$;` 的分号会被甩到下一行
const TRAIL = /^[;,.、，。：:！!？?)）\]]+/

function renderInline(text, renderText) {
  const tokens = [...text.matchAll(INLINE_TOKEN)]
  const allowedTags = new Map(), stack = []
  for (const token of tokens) {
    if (!token[0].startsWith("<")) continue
    const name = token[0].match(/^<(\/?)(span|strong|em|sup|small)\b/i)
    if (!name) continue
    const html = sourceTagHtml(token[0])
    if (!name[1]) {
      stack.push({ name: name[2].toLowerCase(), token, html })
    } else if (stack.at(-1)?.name === name[2].toLowerCase()) {
      const opening = stack.pop()
      if (opening.html && html) {
        allowedTags.set(opening.token.index, opening.html)
        allowedTags.set(token.index, html)
      }
    }
  }
  // Keep source tags and rendered KaTeX opaque to Markdown and Latin-token processing.
  let marker = "\0"
  while (text.includes(marker)) marker += "\0"
  const fragments = []
  const protect = (html) => {
    fragments.push(html)
    return `${marker}${fragments.length - 1}${marker}`
  }
  let out = "", last = 0
  for (const m of tokens) {
    out += renderText(text.slice(last, m.index))
    if (m[0].startsWith("&#")) {
      const value = m[0].slice(2, -1)
      const code = value.startsWith("x")
        ? parseInt(value.slice(1), 16) : Number(value)
      out += renderText(code > 0 && code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff)
        ? String.fromCodePoint(code) : m[0])
      last = m.index + m[0].length
      continue
    }
    if (m[0].startsWith("<")) {
      out += protect(allowedTags.get(m.index) ?? escText(m[0]))
      last = m.index + m[0].length
      continue
    }
    const tex = m[1] ?? m[2]
    let html
    try {
      html = katex.renderToString(tex, { displayMode: !!m[1], throwOnError: false })
    } catch {
      html = `<span class="sr-tex-err">${esc(tex)}</span>`
    }
    last = m.index + m[0].length
    const t = (text.slice(last).match(TRAIL) || [""])[0]
    last += t.length
    out += protect(`<span class="sr-nb">${html}${esc(t)}</span>`)
  }
  return strong(out + renderText(text.slice(last))).replace(
    new RegExp(`${marker}(\\d+)${marker}`, "g"),
    (_, index) => fragments[Number(index)],
  )
}

const inline = (text) => renderInline(text, escText)
const proseInline = (text) => renderInline(text, escProseText)

function proseParagraphs(text) {
  // Layout normalization can separate a reference or split a whole-note wrapper.
  const normalized = String(text ?? "").trim().replace(
    /\s*<sup>\s*((?:&#(?:\d+|x[\da-f]+);|\d+)+)\s*<\/sup>/gi,
    (_, marker) => `<sup>${marker}</sup>`,
  )
  const note = normalized.match(/^<small>([\s\S]*)<\/small>$/)
  if (note && !/<\/?small>/.test(note[1])) {
    const body = note[1]
      .replace(/^(&#(?:\d+|x[\da-f]+);)\s*\n\s*/i, "$1 ")
      .replace(/\s*\n\s*([”’])/g, "$1")
    return proseParagraphs(body).map((paragraph) => `<small>${paragraph}</small>`)
  }
  return normalized
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

function proseOutline(blocks) {
  let index = 0
  return blocks.flatMap((block, blockIndex) => {
    if (block.kind !== "p") return []
    return proseParagraphs(block.text).map((text, paragraphInBlock) => ({
      index: index++,
      blockIndex,
      paragraphInBlock,
      text,
    }))
  })
}

function sectionBreakIndices(blocks, sectionBreaks = []) {
  if (!Array.isArray(sectionBreaks)) {
    throw new Error("section_breaks must be an array")
  }
  const outline = proseOutline(blocks)
  const indices = sectionBreaks.map((boundary, boundaryIndex) => {
    if (Number.isInteger(boundary)) return boundary
    if (
      !boundary
      || typeof boundary !== "object"
      || typeof boundary.before !== "string"
      || !boundary.before.trim()
      || typeof boundary.after !== "string"
      || !boundary.after.trim()
    ) {
      throw new Error(
        `section_breaks[${boundaryIndex}] must contain non-empty before/after paragraph text`,
      )
    }
    const matches = outline
      .slice(1)
      .filter((item) =>
        outline[item.index - 1].text === boundary.before.trim()
        && item.text === boundary.after.trim())
      .map((item) => item.index)
    if (matches.length !== 1) {
      throw new Error(
        `section_breaks[${boundaryIndex}] must identify exactly one adjacent paragraph pair; `
        + `matched ${matches.length}`,
      )
    }
    return matches[0]
  })
  if (indices.some((index) => index <= 0 || index >= outline.length)) {
    throw new Error("section_breaks must point between prose paragraphs")
  }
  if (indices.some((index, position) => position > 0 && index <= indices[position - 1])) {
    throw new Error("section_breaks must be strictly increasing and unique")
  }
  return indices
}

function proseFlow(blocks, sectionBreaks = []) {
  const breaks = new Set(sectionBreakIndices(blocks, sectionBreaks))
  let paragraphIndex = 0
  const flow = blocks.flatMap((block) => {
    if (block.kind !== "p") return [block]
    return proseParagraphs(block.text).map((text) => {
      const item = {
        ...block,
        text,
        ...(breaks.has(paragraphIndex) ? { sectionBreak: true } : {}),
      }
      paragraphIndex += 1
      return item
    })
  })
  const out = []
  for (let index = 0; index < flow.length;) {
    if (flow[index].label === "source-footnote-rule"
      && flow[index].text === "---"
      && flow[index + 1]?.text.startsWith("<small>")) {
      flow[index + 1] = { ...flow[index + 1], sectionBreak: true }
      index++
      continue
    }
    if (!["fig", "cap"].includes(flow[index].kind)) {
      out.push(flow[index++])
      continue
    }
    const start = index
    while (index < flow.length && ["fig", "cap"].includes(flow[index].kind)) index++
    const group = flow.slice(start, index)
    const figures = group.filter((block) => block.kind === "fig")
    const captions = group.filter((block) => block.kind === "cap")
    const labels = new Set(figures.map((block) => block.label))
    const byLabel = new Map(captions.map((block) => [block.label, block]))
    // 并排扫描图的块序可能是 fig/fig/cap/cap，只配对唯一、完整的同组图号。
    const paired = figures.length > 0
      && figures.length === captions.length
      && labels.size === figures.length
      && byLabel.size === captions.length
      && figures.every((block) => typeof block.label === "string"
        && block.label.trim() && byLabel.has(block.label))
    out.push(...(paired
      ? figures.flatMap((block) => [block, byLabel.get(block.label)])
      : group))
  }
  return out
}

/** 插图取矢量优先；SVG 直接内联，宿主可用 CSS 换色（fill 是 currentColor）。 */
function figureSvg(bookDir, id) {
  const svg = path.join(bookDir, "figures", `${id}.svg`)
  if (fs.existsSync(svg)) {
    return fs.readFileSync(svg, "utf8").replace(/<\?xml[^>]*\?>/, "").trim()
  }
  const png = path.join(bookDir, "figures", `${id}.png`)
  if (fs.existsSync(png)) {
    return `<img alt="" src="data:image/png;base64,${fs.readFileSync(png).toString("base64")}">`
  }
  return null
}

module.exports = {
  esc,
  inline,
  proseInline,
  proseParagraphs,
  proseOutline,
  sectionBreakIndices,
  proseFlow,
  figureSvg,
}
