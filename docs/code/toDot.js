const toDot = DataFactory => dataset => {
  const { namedNode, literal, defaultGraph, quad } = DataFactory
  const rdfType = namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')
  const label = namedNode('http://view/label')
  const color = namedNode('http://view/color')
  const shape = namedNode('http://view/shape')
  const tooltip = namedNode('http://view/tooltip')
  const source = namedNode('http://view/source')
  const target = namedNode('http://view/target')
  const node = namedNode('http://view/Node')
  const link = namedNode('http://view/Link')
  
  const attributes = new Map([
      [label.value, "label"],
      [color.value, "color"],
      [shape.value, "shape"],
      [tooltip.value, "tooltip"]
  ])

  const escape = text => text.replaceAll('"','\\"')
  
  const nodes = Array.from(dataset.match(null, rdfType, node)).map(x => {
      const attrs = []
      for (const quad of dataset.match(x.subject)) {
          if (attributes.has(quad.predicate.value)) {
              attrs.push(`${attributes.get(quad.predicate.value)}="${escape(quad.object.value)}"`)
          }
      }
      return `"${escape(x.subject.value)}" [${attrs.join(',')}]`
  })
  
  const links = Array.from(dataset.match(null, rdfType, link)).map(x => {
      const [src] = dataset.match(x.subject, source)
      const [tgt] = dataset.match(x.subject, target)
      const attrs = []
      for (const quad of dataset.match(x.subject)) {
          if (attributes.has(quad.predicate.value)) {
              attrs.push(`${attributes.get(quad.predicate.value)}="${escape(quad.object.value)}"`)
          }
      }
      return `"${escape(src.object.value)}" -> "${escape(tgt.object.value)}" [${attrs.join(',')}]`
  })
      
  return `digraph {
      ${nodes.join('\n')}
      ${links.join('\n')}
  }`
}
