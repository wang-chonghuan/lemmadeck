function lessonOrderMap(bookIndex) {
  if (!Array.isArray(bookIndex?.lessons) || bookIndex.lessons.length === 0) {
    throw new Error('原始 book.json 没有课程索引')
  }

  const result = new Map()
  for (const [index, lesson] of bookIndex.lessons.entries()) {
    const id = lesson?.card_id || lesson?.id
    if (!id) throw new Error('原始 book.json 含无 id 的课程条目')
    if (result.has(id)) throw new Error(`原始 book.json 含重复课程 id: ${id}`)
    result.set(id, index + 1)
  }
  return result
}

const BRANCH = {
  early: { discipline: 'math', rank: 0 },
  algebra: { discipline: 'math', rank: 1 },
  geometry: { discipline: 'math', rank: 2 },
  analysis: { discipline: 'math', rank: 3 },
  probability: { discipline: 'math', rank: 4 },
  physics: { discipline: 'physics', rank: 0 },
}

function tocCardIds(toc) {
  if (!Array.isArray(toc?.contents) || toc.contents.length === 0) {
    throw new Error('TOC 没有课程目录')
  }

  const ids = []
  for (const entry of toc.contents) {
    const lessons = entry?.kind === 'chapter' ? entry.lessons : [entry]
    if (!Array.isArray(lessons)) throw new Error(`TOC 条目缺少 lessons: ${entry?.id ?? '?'}`)
    for (const lesson of lessons) {
      const cards = Array.isArray(lesson?.topics) && lesson.topics.length
        ? lesson.topics
        : [lesson]
      for (const card of cards) {
        if (!card?.id) throw new Error('TOC 含无 id 的卡片')
        ids.push(card.id)
      }
    }
  }
  if (new Set(ids).size !== ids.length) throw new Error('TOC 含重复课程 id')
  return ids
}

function publicationPlan(toc) {
  const branch = BRANCH[toc?.subject]
  if (!branch) throw new Error(`TOC subject 不支持发布: ${toc?.subject ?? '?'}`)
  const stage = Number(toc?.grade)
  if (!Number.isInteger(stage) || stage <= 0) throw new Error('TOC grade 必须是正整数')

  const ids = tocCardIds(toc)
  if (ids.length >= 1000) throw new Error('单册卡片数超过稳定排序编号段')
  const offset = branch.rank * 1000
  return {
    subject: branch.discipline,
    stage,
    orders: new Map(ids.map((id, index) => [id, offset + index + 1])),
  }
}

module.exports = { lessonOrderMap, publicationPlan, tocCardIds }
