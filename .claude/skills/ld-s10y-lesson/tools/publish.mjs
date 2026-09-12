#!/usr/bin/env node
/**
 * cap6：把装订好的卡片写进内容库，让它在产品里变成可点的一课。
 *
 * app 的设计已经替我们决定了落点（见 app/src/lib/deck-stats.ts）：
 * **一张卡片的内容写入时，它在 sr_lessons 的行就用卡片自己的 id**，所以这里不建新表。
 * 编号单元和无编号补充习题都是一张卡片 = 一行，id 来自 cap2 的 TOC 认领。
 *
 *   content   ← 课文块，每块一段**可直接嵌入的 HTML 片段**（KaTeX 已渲染，插图内联）
 *   exercises ← 每道题一条：题号、所属栏目、题干片段、自己的图
 *   html      ← 留空。整份自包含文档只适合单独打开；塞进产品会变成"文档中的文档"，
 *               字体版式与宿主两套，高度还得靠 JS 猜。产品侧用上面两列原生渲染。
 *
 * 连接串只取仓库根 .env 的 `LEMMADECK_DATABASE_URL`。内容库在 Supabase，
 * schema 是 lemmadeck-schema；旧 Azure 连接串不得作为写入回退。
 *
 * 生产只接受通过 cap4 审计的 edition，不允许回退到原书 JSON。
 *
 * 用法: publish.mjs <bookDir> --edition <name> --lesson <cardId>... [--dry] [--env <path>]
 */
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const postgres = require('postgres')
const { inline, proseInline, proseFlow } = require('./htmlfrag.js')
const { lessonOrderMap } = require('./lesson_order.js')
const { preserveExerciseMetadata } = require('./publish_merge.js')

const args = process.argv.slice(2)
const bookDir = args.find((a) => !a.startsWith('--'))
const editionName = args.includes('--edition') ? args[args.indexOf('--edition') + 1] : null
const dry = args.includes('--dry')
const envPath = args.includes('--env') ? args[args.indexOf('--env') + 1] : '.env'
const requestedLessons = new Set()
for (let i = 0; i < args.length; i += 1) {
  if (args[i] === '--lesson' && args[i + 1]) requestedLessons.add(args[i + 1])
}
if (!bookDir || !editionName || !requestedLessons.size) {
  console.error('用法: publish.mjs <bookDir> --edition <name> --lesson <cardId>... [--dry] [--env <path>]')
  process.exit(2)
}

function dbUrl() {
  const env = fs.readFileSync(envPath, 'utf8')
  const key = 'LEMMADECK_DATABASE_URL'
  const match = env.match(new RegExp(`^${key}=(.*)$`, 'm'))
  if (match?.[1]?.trim()) return { key, url: match[1].trim() }
  throw new Error(`${envPath} 里没有 ${key}`)
}

const book = path.resolve(bookDir)
const edition = path.join(book, 'editions', editionName)
const lessonsDir = path.join(edition, 'lessons')
if (!fs.existsSync(lessonsDir)) {
  throw new Error(`edition 不存在或没有 lessons: ${lessonsDir}`)
}
const sourceBookIndexPath = path.join(book, 'book.json')
if (!fs.existsSync(sourceBookIndexPath)) {
  throw new Error(`缺少原始课程索引: ${sourceBookIndexPath}`)
}
const lessonOrders = lessonOrderMap(
  JSON.parse(fs.readFileSync(sourceBookIndexPath, 'utf8')),
)

function figureAssetStrict(id) {
  const pngPath = path.join(edition, 'figures', `${id}.png`)
  if (fs.existsSync(pngPath)) {
    return {
      image: `data:image/png;base64,${fs.readFileSync(pngPath).toString('base64')}`,
      svg: null,
    }
  }
  const svgPath = path.join(edition, 'figures', `${id}.svg`)
  if (!fs.existsSync(svgPath)) throw new Error(`现代版缺少图片: ${id}`)
  const svg = fs.readFileSync(svgPath, 'utf8').replace(/<\?xml[^>]*\?>/, '').trim()
  const linkScan = svg.replace(/\sxmlns(?::\w+)?="[^"]+"/g, '')
  if (/<(?:image|foreignObject|script)\b/i.test(svg) || /(?:data:|https?:\/\/)/i.test(linkScan)) {
    throw new Error(`${svgPath} 含位图、脚本、data URI 或外链`)
  }
  return { image: null, svg }
}

const rows = []
for (const lid of fs.readdirSync(lessonsDir).sort()) {
  if (requestedLessons.size && !requestedLessons.has(lid)) continue
  const dir = path.join(lessonsDir, lid)
  const L = JSON.parse(fs.readFileSync(path.join(dir, 'lesson.json'), 'utf8'))
  const X = JSON.parse(fs.readFileSync(path.join(dir, 'exercises.json'), 'utf8'))
  const auditPath = path.join(dir, 'adaptation.audit.json')
  const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'))
  if (L.status !== 'ready' || X.status !== 'ready' || audit.status !== 'pass') {
    throw new Error(`${lid}: edition 尚未通过 adapt-finalize`)
  }
  if (L.edition !== editionName || X.edition !== editionName) {
    throw new Error(`${lid}: edition 字段与 --edition 不一致`)
  }
  if (!L.card_id) {
    console.error(`  ✗ ${lid}: 没有卡片 id（assemble 时没给 --toc，或 TOC 里对不上），跳过`)
    continue
  }
  const prose = proseFlow(L.prose, L.section_breaks).map((b) =>
    b.kind === 'fig'
      ? { kind: 'fig', id: b.id, label: b.label, ...figureAssetStrict(b.id) }
      : b.kind === 'p'
        ? {
            kind: 'p',
            html: proseInline(b.text),
            ...(b.sectionBreak ? { sectionBreak: true } : {}),
          }
        : { kind: b.kind, html: proseInline(b.text) })
  const exercises = X.exercises.map((e) => ({
    number: e.number,
    group: e.group,
    html: inline(e.text),
    figureRefs: e.figure_refs ?? [],
    figures: (e.figures ?? []).map((f) => ({
      id: f.id,
      label: f.label,
      ...figureAssetStrict(f.id),
    })),
  }))
  // lesson_order 使用原始 book.json 的卡片阅读顺序。无编号补充习题的 number 为 null，
  // 不能转成 0；否则同册第二个补充习题会撞唯一约束。
  const grade = Number(/^[a-z]*(\d+)/.exec(L.card_id.replace(/^math|^physics/, ''))?.[1] ?? 0)
  const lessonOrder = lessonOrders.get(L.card_id)
  if (!lessonOrder) {
    throw new Error(`${lid}: 原始 book.json 没有该卡片，不能确定 lesson_order`)
  }
  rows.push({
    id: L.card_id,
    subject: 'math',
    stage: grade || 0,
    lesson_order: lessonOrder,
    title: L.printed_title || L.title,
    concept: [L.chapter, L.section].filter(Boolean).join(' · '),
    content: {
      id: L.id,
      card_id: L.card_id,
      chapter: L.chapter,
      section: L.section,
      number: L.number,
      title: L.title,
      printed_title: L.printed_title,
      edition: editionName,
      source: {
        lessonSha256: L.source.sha256,
        exercisesSha256: X.source.sha256,
      },
      prose,
    },
    exercises: { count: exercises.length, edition: editionName, exercises },
  })
}

if (requestedLessons.size) {
  const found = new Set(rows.map((r) => r.id))
  const missing = [...requestedLessons].filter((id) => !found.has(id))
  if (missing.length) throw new Error(`指定的卡片没有可发布产物: ${missing.join(', ')}`)
}

console.log(`[publish] ${book} edition=${editionName} → ${rows.length} 行`)
for (const r of rows) {
  const kb = (JSON.stringify(r.content).length + JSON.stringify(r.exercises).length) / 1024
  console.log(`    ${r.id}  ${r.title}  正文 ${r.content.prose.length} 块  `
    + `题 ${r.exercises.count} 道  ${kb | 0}KB  stage=${r.stage} order=${r.lesson_order}`)
}
if (dry) {
  console.log('  (--dry：没有写库)')
  process.exit(0)
}

const { key, url } = dbUrl()
console.log(`  连接 ${key}`)
const sql = postgres(url, {
  ssl: 'require',
  connection: { search_path: '"lemmadeck-schema"' },
  connect_timeout: 15,
})
try {
  for (const r of rows) {
    const existingRows = await sql`
      select exercises from sr_lessons where id = ${r.id}
    `
    const existingDeck = existingRows[0]?.exercises
    r.exercises.exercises = preserveExerciseMetadata(
      r.exercises.exercises,
      existingDeck,
      editionName,
    )
    await sql`
      insert into sr_lessons
        (id, subject, stage, lesson_order, title, concept, content, exercises, status)
      values (${r.id}, ${r.subject}, ${r.stage}, ${r.lesson_order}, ${r.title},
              ${r.concept}, ${sql.json(r.content)}, ${sql.json(r.exercises)}, 'draft')
      on conflict (id) do update set
        subject = excluded.subject, stage = excluded.stage,
        lesson_order = excluded.lesson_order, title = excluded.title,
        concept = excluded.concept, html = null,
        content = excluded.content, exercises = excluded.exercises,
        updated_at = now()
    `
    console.log(`    ✓ ${r.id}`)
  }
  const all = await sql`
    select id, subject, jsonb_array_length(content->'prose') as prose,
           coalesce((exercises->>'count')::int, 0) as ex
    from sr_lessons order by id`
  for (const x of all) console.log(`    · ${x.id}  正文 ${x.prose ?? '-'} 块  题 ${x.ex} 道`)
} finally {
  await sql.end()
}
