import { DataFactory, Parser, Store } from "n3"

const prefix = 'http://view/' // temporary namespace, may change in the future
const attributePrefix = `${prefix}dot/attribute/`

const escape = text => text.replaceAll('"','\\"')
const quoteEscaped = x => `"${escape(x)}"`
const isHTML = x => x.startsWith('<') && x.endsWith('>')
const formatLabel = x => isHTML(x)? x : quoteEscaped(x)

const { namedNode } = DataFactory
const digraph = namedNode(`${prefix}digraph`)
const graphAttributes = namedNode(`${prefix}graphAttributes`)
const nodeAttributes = namedNode(`${prefix}nodeAttributes`)
const edgeAttributes = namedNode(`${prefix}edgeAttributes`)
const hasNode = namedNode(`${prefix}hasNode`)
const hasEdge = namedNode(`${prefix}hasEdge`)
const source = namedNode(`${prefix}source`)
const target = namedNode(`${prefix}target`)
const sourcePort = namedNode(`${prefix}sourcePort`)
const targetPort = namedNode(`${prefix}targetPort`)
const sourceCompass = namedNode(`${prefix}sourceCompass`)
const targetCompass = namedNode(`${prefix}targetCompass`)
const subgraph = namedNode(`${prefix}subgraph`)

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

  function * nodes (g) { 
    for (const quad of dataset.match(g, hasNode)) {
      const attrs = getAttributes(quad.object)
      yield `${quoteEscaped(quad.object.value)} [${attrs.join(',')}]`
    }
  }

  function * edges (g) {
    for (const x of dataset.match(g, hasEdge)) {
      const [src] = dataset.match(x.object, source)
      const [tgt] = dataset.match(x.object, target)

      const srcPortAndCompass = [
        ...dataset.match(x.object, sourcePort),
        ...dataset.match(x.object, sourceCompass),
      ]      
      const tgtPortAndCompass = [
        ...dataset.match(x.object, targetPort),
        ...dataset.match(x.object, targetCompass),
      ]

      const srcText = [
        quoteEscaped(src.object.value),
        ...srcPortAndCompass.map(x => x.object.value),
      ].join(':')
      const tgtText = [
        quoteEscaped(tgt.object.value),
        ...tgtPortAndCompass.map(x => x.object.value),
      ].join(':')

      const attrs = getAttributes(x.object)
      yield `${srcText} -> ${tgtText} [${attrs.join(',')}]`
  }
}

  function * collectAttributes (g, p) {
    for (const quad of dataset.match(g, p)) {
      yield * getAttributes(quad.object)
    }
  }

  function * getStatements (g, p, txt) {
    const stms = Array.from(collectAttributes(g, p))
    if (stms.length > 0) {
      yield `${txt} [${stms.join(',')}]`
    }
  }

  function * getSubgraphs (g) {
    for (const quad of dataset.match(g, subgraph)) {
      yield 'subgraph {'
      yield * getGraph(quad.object)
      yield '}'
    }
  }
  
  function * getGraph (g) {
    yield * getStatements(g, graphAttributes, 'graph')
    yield * getStatements(g, nodeAttributes, 'node')
    yield * getStatements(g, edgeAttributes, 'edge')
    yield * nodes(g)
    yield * edges(g)
    yield * getSubgraphs(g)
  }   

  const lines = Array.from(getGraph(digraph))
  return `digraph { 
    ${lines.join('\n\t')} 
  }`
}

export default toDot
