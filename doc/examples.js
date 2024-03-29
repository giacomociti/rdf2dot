import applyRules from '../lib/applyRules'
import createSVG from "../lib/createSVG"
import rulesBasic from '../packages/rdf2dot/rules/basic.n3?raw'
import rulesDefault from '../packages/rdf2dot/rules/default.n3?raw'
import data1 from './data2.ttl?raw'
import schema from '../examples/schema.n3?raw'
import vocabulary1 from '../packages/rdf2dot/vocabulary.ttl?raw'
import barnard59 from '../examples/barnard59/barnard59.n3?raw'
import pipeline1 from '../examples/barnard59/pipeline1.ttl?raw'

const showGraph = async (data, rules, graph) => {
    const diagramText = await applyRules(data, rules)
    const svg = await createSVG(diagramText)
    document.getElementById(graph).appendChild(svg)
}

document.getElementById('data1').textContent = data1
showGraph(data1, rulesBasic, 'basic1')
showGraph(data1, rulesDefault, 'default1')
showGraph(vocabulary1, schema, 'vocabulary1')
showGraph(pipeline1, barnard59, 'pipeline1')