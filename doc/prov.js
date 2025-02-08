import example1 from '../examples/prov/narrative-example-simple-1.ttl?raw'
import '../packages/rdf2dot-wc/index.js'

document.addEventListener('DOMContentLoaded', () => {

    const rulesEntity = document.getElementById('rules-entity').innerText
    const rulesActivity = document.getElementById('rules-activity').innerText
    const rulesAgent = document.getElementById('rules-agent').innerText

    const rulesCore = rulesEntity + rulesActivity + rulesAgent


    const rulesLabel = document.getElementById('rules-label').innerText
    const rulesEdges = document.getElementById('rules-edges').innerText
    const rulesLayout = document.getElementById('rules-layout').innerText
    const rulesQualifiedUsage = document.getElementById('rules-qualifiedUsage').innerText

    const dataExampleCore = document.getElementById('data-example-core').innerText
    const dataQualifiedUsage = document.getElementById('data-qualifiedUsage').innerText

    const prefixes = `
      @prefix math: <http://www.w3.org/2000/10/swap/math#> .
      @prefix list: <http://www.w3.org/2000/10/swap/list#> .
      @prefix string: <http://www.w3.org/2000/10/swap/string#> .
      @prefix log: <http://www.w3.org/2000/10/swap/log#> .
      @prefix v: <http://view/> .
      @prefix attr: <http://view/dot/attribute/> .
      @prefix prov: <http://www.w3.org/ns/prov#> .

      `
      
    const dataPrefixes = `
      @prefix prov: <http://www.w3.org/ns/prov#> .
      @prefix ex: <http://example.org/> .
    
      `

    const showGraph = async (data, rules, graph) => {
        const element = document.getElementById(graph)
        element.rules = rules
        element.data = data
    }

    showGraph(
        [dataPrefixes, dataExampleCore].join('\n'), 
        [prefixes, rulesCore, rulesLabel].join('\n'), 
        'example-core')

    showGraph(example1, 
        [prefixes, rulesCore, rulesLabel, rulesEdges, rulesLayout].join('\n'), 
        'example1')

    showGraph(
        [ dataPrefixes, dataQualifiedUsage].join('\n'),
        [prefixes, rulesCore, rulesLabel, rulesEdges, rulesLayout, rulesQualifiedUsage].join('\n'), 
        'diagram-qualifiedUsage')
})