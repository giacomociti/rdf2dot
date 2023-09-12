import applyRules from '../lib/applyRules'
import createSVG from "../lib/createSVG"
import rulesBasic from '../rules/basic.n3?raw'
import rulesDefault from '../rules/default.n3?raw'
import data1 from './data2.ttl?raw'

const showGraph = async (data, rules, graph) => {
    const diagramText = await applyRules(data, rules)
    const svg = await createSVG(diagramText)
    document.getElementById(graph).appendChild(svg)
}

document.getElementById('data1').textContent = data1
showGraph(data1, rulesBasic, 'basic1')
showGraph(data1, rulesDefault, 'default1')