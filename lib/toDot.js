import { DataFactory, Parser, Store } from "n3"

 const ns = x => `http://view/${x}`
const escape = text => text.replaceAll('"','\\"')
const isHTML = x => x.startsWith('<') && x.endsWith('>')
const formatLabel = x => isHTML(x)? x : `"${escape(x)}"`
const toEntry = attr => [ ns(attr), x => `${attr}=${x}` ]

const { namedNode } = DataFactory
const rdfType = namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')
const node = namedNode(ns('Node'))
const link = namedNode(ns('Link'))
const source = namedNode(ns('source'))
const target = namedNode(ns('target'))

const attrs = ['color', 'shape', 'style', 'arrowhead'] // to be continued

const attributes = new Map([
    [ns('label'), x => `label=${formatLabel(x)}`],
    [ns('tooltip'), x => `tooltip="${escape(x)}"`],
    ...attrs.map(toEntry)
])

const toDot = diagramText => {
  const dataset = new Store(new Parser().parse(diagramText))

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