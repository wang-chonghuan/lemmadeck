import { describe, expect, it } from 'vitest'

import {
  allCardIds,
  findCard,
  findTextbookBook,
  getTextbookOutline,
} from './textbooks'

describe('findTextbookBook', () => {
  it('resolves a card through the textbook shelf authority', () => {
    expect(findTextbookBook('math5-c1-s1-n1')).toBe('5m')
  })

  it('does not infer a book from an unknown card id', () => {
    expect(findTextbookBook('math5-unknown')).toBeNull()
  })

  it('keeps a physics main lesson before its unnumbered supplemental card', () => {
    const ids = allCardIds()
    expect(ids.indexOf('phy6-c2-s4')).toBeGreaterThanOrEqual(0)
    expect(ids.indexOf('phy6-c2-s4-t1')).toBe(ids.indexOf('phy6-c2-s4') + 1)
    expect(findCard('phy6-c2-s4', 'zh')?.next?.id).toBe('phy6-c2-s4-t1')
    expect(findCard('phy6-c2-s4-t1', 'zh')?.prev?.id).toBe('phy6-c2-s4')
  })

  it('keeps numbered-topic sections structural', () => {
    const outline = getTextbookOutline([], 'zh')
    const algebra = outline
      .flatMap((discipline) => discipline.books)
      .find((book) => book.book === '6a')
    const section = algebra?.contents
      .flatMap((node) => node.kind === 'chapter' ? node.lessons : [node.lesson])
      .find((lesson) => lesson.id === 'alg6-c1-s1')

    expect(section?.hasOwnCard).toBe(false)
    expect(section?.cardId).toBe('alg6-c1-s1-n1')
  })

  it('treats only the parent as ready when its supplemental card is unpublished', () => {
    const outline = getTextbookOutline(['phy6-c2-s4'], 'zh')
    const physics = outline
      .flatMap((discipline) => discipline.books)
      .find((book) => book.book === '6p')
    const section = physics?.contents
      .flatMap((node) => node.kind === 'chapter' ? node.lessons : [node.lesson])
      .find((lesson) => lesson.id === 'phy6-c2-s4')

    expect(section?.hasOwnCard).toBe(true)
    expect(section?.ready).toBe(true)
    expect(section?.topics).toEqual([
      expect.objectContaining({ id: 'phy6-c2-s4-t1', number: null, ready: false }),
    ])
  })
})
