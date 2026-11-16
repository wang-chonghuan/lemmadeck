export function materializeArrowheads(svg) {
  const namespace = 'http://www.w3.org/2000/svg'
  for (const line of svg.querySelectorAll('line[marker-end]')) {
    const reference = line.getAttribute('marker-end')
    const id = reference.match(/#([^)'"]+)/)?.[1]
    const marker = [...svg.querySelectorAll('marker')].find(node => node.id === id)
    if (!marker) throw new Error(`Missing arrow marker: ${reference}`)
    const viewBox = marker.viewBox.baseVal
    const width = marker.markerWidth.baseVal.value
    const height = marker.markerHeight.baseVal.value
    if (!viewBox.width || !viewBox.height || width / viewBox.width !== height / viewBox.height) {
      throw new Error(`Unsupported arrow marker aspect ratio: ${id}`)
    }
    const stroke = Number.parseFloat(line.getAttribute('stroke-width') || '1')
    const scale = width / viewBox.width * (marker.getAttribute('markerUnits') === 'userSpaceOnUse' ? 1 : stroke)
    const x1 = line.x1.baseVal.value
    const y1 = line.y1.baseVal.value
    const x2 = line.x2.baseVal.value
    const y2 = line.y2.baseVal.value
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI
    const group = document.createElementNS(namespace, 'g')
    group.setAttribute('data-arrowhead-for', line.id)
    group.setAttribute('transform',
      `translate(${x2} ${y2}) rotate(${angle}) scale(${scale}) ` +
      `translate(${-marker.refX.baseVal.value} ${-marker.refY.baseVal.value})`)
    for (const child of marker.children) group.appendChild(child.cloneNode(true))
    const color = line.getAttribute('stroke') || 'currentColor'
    group.setAttribute('fill', color)
    group.setAttribute('stroke', color)
    group.setAttribute('stroke-width', marker.getAttribute('stroke-width') || '0')
    group.setAttribute('opacity', line.getAttribute('stroke-opacity') || '1')
    for (const node of group.querySelectorAll('*')) {
      for (const attribute of ['fill', 'stroke']) {
        if (node.getAttribute(attribute) === 'context-stroke') node.setAttribute(attribute, color)
      }
    }
    line.after(group)
    line.removeAttribute('marker-end')
  }
}
