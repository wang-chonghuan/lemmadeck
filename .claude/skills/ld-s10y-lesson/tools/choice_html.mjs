import { createRequire } from 'node:module'
import { marked } from '../../../../.agents/skills/node_modules/marked/lib/marked.esm.js'

const { inline } = createRequire(import.meta.url)('./htmlfrag.js')

export function choiceHtml(text) {
  // GFM splits table cells before inline math can protect its vertical bars.
  let marker = 'S10YMATH'
  while (text.includes(marker)) marker += 'X'
  const math = []
  const protectedText = text.replace(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs, (match) => {
    math.push(match)
    return `${marker}${math.length - 1}END`
  })
  const restore = (value) => value.replace(
    new RegExp(`${marker}(\\d+)END`, 'g'), (_, index) => math[Number(index)],
  )
  const tokens = marked.lexer(protectedText)
  if (!tokens.some((token) => token.type === 'table')) return inline(text)
  return tokens.map((token) => {
    if (token.type !== 'table') return inline(restore(token.raw))
    const row = (cells, tag) => `<tr>${cells.map((cell) => `<${tag}>${inline(restore(cell.text))}</${tag}>`).join('')}</tr>`
    return `<table><thead>${row(token.header, 'th')}</thead><tbody>${token.rows.map((cells) => row(cells, 'td')).join('')}</tbody></table>`
  }).join('')
}
