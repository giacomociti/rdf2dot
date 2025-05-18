import data1 from './data2.ttl?raw'
import schema from '../examples/schema/schema.n3?raw'
import vocabulary from '../examples/vocabulary.n3?raw'
import vocabulary1 from '../packages/rdf2dot/vocabulary.ttl?raw'
import barnard59 from '../examples/barnard59/barnard59.n3?raw'
import pipeline1 from '../examples/barnard59/pipeline1.ttl?raw'
import '../packages/rdf2dot-wc/index.js'

document.addEventListener('DOMContentLoaded', () => {
    const showGraph = async (data, rules, graph) => {
        const element = document.getElementById(graph)
        element.rules = rules
        element.data = data
    }

    document.getElementById('data1').textContent = data1
    document.getElementById('basic1').data = data1
    document.getElementById('default1').data = data1

    showGraph(data1, schema, 'schema1')
    showGraph(vocabulary1, vocabulary, 'vocabulary1')
    showGraph(pipeline1, barnard59, 'pipeline1')
})