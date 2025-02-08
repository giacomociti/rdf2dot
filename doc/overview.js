import data1 from './data1.ttl?raw'
import rules1 from './rules1.n3?raw'
import rules2_1 from './rules2_1.n3?raw'
import rules2_2 from './rules2_2.n3?raw'
import rules2_3 from './rules2_3.n3?raw'
import diagram2 from './diagram2.ttl?raw'
import '../packages/rdf2dot-wc/index.js'

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('data1').textContent = data1
    document.getElementById('rules1').textContent = rules1
    document.getElementById('rules2_1').textContent = rules2_1
    document.getElementById('rules2_2').textContent = rules2_2
    document.getElementById('rules2_3').textContent = rules2_3
    document.getElementById('diagram2').textContent = diagram2

    const graph1 = document.getElementById('graph1')
    graph1.rules = rules1
    graph1.data = data1

    const graph2 = document.getElementById('graph2')
    graph2.rules = rules2_1 + rules2_2 + rules2_3
    graph2.data = data1
})