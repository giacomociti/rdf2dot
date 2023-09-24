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

  const nodes = g => Array.from(dataset.match(g, hasNode)).map(x => {
      const attrs = getAttributes(x.object)
      return `${quoteEscaped(x.object.value)} [${attrs.join(',')}]`
  })

  const edges = g => Array.from(dataset.match(g, hasEdge)).map(x => {
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
      return `${srcText} -> ${tgtText} [${attrs.join(',')}]`
  })

  const getStatements = (g, p) => {
    const [ quad ] = dataset.match(g, p)
    if (quad)
      return getAttributes(quad.object).join(',')

    return ''
  }

  const gStm = getStatements(digraph, graphAttributes)
  const nStm = getStatements(digraph, nodeAttributes)
  const eStm = getStatements(digraph, edgeAttributes)
  
   
// todo subgraphs

  return `digraph {
    ${gStm? `graph [${gStm}]` : ''}
    ${nStm? `node [${nStm}]` : ''}
    ${eStm? `edge [${eStm}]` : ''}
    ${nodes(digraph).join('\n\t')}
    ${edges(digraph).join('\n\t')}
}`
}

export default toDot