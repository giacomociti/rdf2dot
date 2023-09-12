import { DataFactory } from "n3"

const toDot = dataset => {
  const { namedNode } = DataFactory
  const rdfType = namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')
  const node = namedNode('http://view/Node')
  const link = namedNode('http://view/Link')
  const source = namedNode('http://view/source')
  const target = namedNode('http://view/target')
  const label = namedNode('http://view/label')
  const color = namedNode('http://view/color')
  const shape = namedNode('http://view/shape')
  const style = namedNode('http://view/style')
  const arrowhead = namedNode('http://view/arrowhead')
  const tooltip = namedNode('http://view/tooltip')


  const escape = text => text.replaceAll('"','\\"')
  const isHTML = x => x.startsWith('<') && x.endsWith('>')
  const formatLabel = x => isHTML(x)? x : `"${escape(x)}"`

  const attributes = new Map([
      [label.value, x => `label=${formatLabel(x)}`],
      [color.value, x => `color=${x}`],
      [shape.value, x => `shape=${x}`],
      [style.value, x => `style=${x}`],
      [arrowhead.value, x => `arrowhead=${x}`],
      [tooltip.value, x => `tooltip="${escape(x)}"`]
  ])

  const getAttributes = subject => {
    const result = []
    for (const quad of dataset.match(subject)) {
      const attr = attributes.get(quad.predicate.value)
      if (attr) {
          result.push(attr(quad.object.value))
      }
    }
    return result
  }
  
  const nodes = Array.from(dataset.match(null, rdfType, node)).map(x => {
      const attrs = getAttributes(x.subject)
      return `"${escape(x.subject.value)}" [${attrs.join(',')}]`
  })
  
  const links = Array.from(dataset.match(null, rdfType, link)).map(x => {
      const [src] = dataset.match(x.subject, source)
      const [tgt] = dataset.match(x.subject, target)
      const attrs = getAttributes(x.subject)
      return `"${escape(src.object.value)}" -> "${escape(tgt.object.value)}" [${attrs.join(',')}]`
  })
      
  return `digraph {
      ${nodes.join('\n')}
      ${links.join('\n')}
  }`
}

export default toDot