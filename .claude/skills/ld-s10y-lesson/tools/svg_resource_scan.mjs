export function svgResourceScan(svg, fontBytes) {
  const expectedStyle = fontBytes
    ? `<style>@font-face{font-family:LDVectorAccents;src:url(data:font/woff2;base64,${fontBytes.toString('base64')}) format("woff2");}</style>`
    : null
  // Match the same byte-identical renderer font allowed by edition.validate_svg.
  return (expectedStyle ? svg.replaceAll(expectedStyle, '') : svg)
    .replace(/\sxmlns(?::\w+)?="[^"]+"/g, '')
}
