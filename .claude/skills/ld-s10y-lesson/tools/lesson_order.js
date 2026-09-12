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

module.exports = { lessonOrderMap }
