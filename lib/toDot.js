import { DataFactory, Parser, Store } from "n3"

const prefix = 'http://view/' // temporary namespace, may change in the future
const attributePrefix = `${prefix}dot/attribute/`

const escape = text => text.replaceAll('"','\\"')
const quoteEscaped = x => `"${escape(x)}"`
const isHTML = x => x.startsWith('<') && x.endsWith('>')
const formatLabel = x => isHTML(x)? x : quoteEscaped(x)

const { namedNode } = DataFactory
const rdfType = namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')
const node = namedNode(`${prefix}Node`)
const edge = namedNode(`${prefix}Edge`)
const source = namedNode(`${prefix}source`)
const target = namedNode(`${prefix}target`)

// may add more from https://graphviz.org/doc/info/attrs.html
const formatFunctions = new Map([
    ['label', formatLabel]
])

const toDot = diagramText => {
  const dataset = new Store(new Parser().parse(diagramText))

  const getAttributes = subject => {
    const result = []
    for (const quad of dataset.match(subject)) {
      if (quad.predicate.value.startsWith(attributePrefix)) {
        const attributeName = quad.predicate.value.slice(attributePrefix.length)
        const format = formatFunctions.get(attributeName) ?? quoteEscaped
        result.push(`${attributeName}=${format(quad.object.value)}`)
      }
     
    }
    return result
  }

  const nodes = Array.from(dataset.match(null, rdfType, node)).map(x => {
      const attrs = getAttributes(x.subject)
      return `${quoteEscaped(x.subject.value)} [${attrs.join(',')}]`
  })

  const edges = Array.from(dataset.match(null, rdfType, edge)).map(x => {
      const [src] = dataset.match(x.subject, source)
      const [tgt] = dataset.match(x.subject, target)
      const attrs = getAttributes(x.subject)
      return `${quoteEscaped(src.object.value)} -> ${quoteEscaped(tgt.object.value)} [${attrs.join(',')}]`
  })

  return `digraph {
  ${nodes.join('\n\t')}
  ${edges.join('\n\t')}
}`
}

export default toDot