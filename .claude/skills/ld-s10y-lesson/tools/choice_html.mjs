import { createRequire } from 'node:module'
import { marked } from '../../../../.agents/skills/node_modules/marked/lib/marked.esm.js'

const { inline } = createRequire(import.meta.url)('./htmlfrag.js')

export function choiceHtml(text) {
  const tokens = marked.lexer(text)
  if (!tokens.some((token) => token.type === 'table')) return inline(text)
  return tokens.map((token) => {
    if (token.type !== 'table') return inline(token.raw)
    const row = (cells, tag) => `<tr>${cells.map((cell) => `<${tag}>${inline(cell.text)}</${tag}>`).join('')}</tr>`
    return `<table><thead>${row(token.header, 'th')}</thead><tbody>${token.rows.map((cells) => row(cells, 'td')).join('')}</tbody></table>`
  }).join('')
}
