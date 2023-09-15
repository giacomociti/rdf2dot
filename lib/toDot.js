import { DataFactory, Parser, Store } from "n3"

const prefix = 'http://view/' // temporary namespace, may change in the future
const attributePrefix = `${prefix}dot/attribute/`

const escape = text => text.replaceAll('"','\\"')
const quoteEscaped = x => `"${escape(x)}"`
const isHTML = x => x.startsWith('<') && x.endsWith('>')
const formatLabel = x => isHTML(x)? x : quoteEscaped(x)

const { namedNode } = DataFactory
const rdfType = namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')
const nodeClass = namedNode(`${prefix}Node`)
const edgeClass = namedNode(`${prefix}Edge`)
const source = namedNode(`${prefix}source`)
const target = namedNode(`${prefix}target`)
const graph = namedNode(`${prefix}graph`)
const node = namedNode(`${prefix}node`)
const edge = namedNode(`${prefix}edge`)

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

  const nodes = Array.from(dataset.match(null, rdfType, nodeClass)).map(x => {
      const attrs = getAttributes(x.subject)
      return `${quoteEscaped(x.subject.value)} [${attrs.join(',')}]`
  })

  const edges = Array.from(dataset.match(null, rdfType, edgeClass)).map(x => {
      const [src] = dataset.match(x.subject, source)
      const [tgt] = dataset.match(x.subject, target)
      const attrs = getAttributes(x.subject)
      return `${quoteEscaped(src.object.value)} -> ${quoteEscaped(tgt.object.value)} [${attrs.join(',')}]`
  })

  const graphStatements = getAttributes(graph).join(',')
  const nodeStatements = getAttributes(node).join(',')
  const edgeStatements = getAttributes(edge).join(',')

  

  return `digraph {
  ${graphStatements? `graph [${graphStatements}]` : ''}
  ${nodeStatements? `node [${nodeStatements}]` : ''}
  ${edgeStatements? `edge [${edgeStatements}]` : ''}
  ${nodes.join('\n\t')}
  ${edges.join('\n\t')}
}`
}

export default toDot