import applyRules from '../lib/applyRules'
import createSVG from "../lib/createSVG"
import data1 from './data1.ttl?raw'
import rules1 from './rules1.n3?raw'
import rules2 from './rules2.n3?raw'
import diagram2 from './diagram2.ttl?raw'

const show = async (diagramText, graph) => {
    const svg = await createSVG(diagramText)
    graph.appendChild(svg)
}

const deriveAndShow = async (data, rules, graph) => {
    const diagramText = await applyRules(data, rules)
    await show(diagramText, graph)
}

document.getElementById('data1').textContent = data1
document.getElementById('rules1').textContent = rules1
document.getElementById('rules2').textContent = rules2
document.getElementById('diagram2').textContent = diagram2
deriveAndShow(data1, rules1, document.getElementById('graph1'))
show(diagram2, document.getElementById('graph2'))