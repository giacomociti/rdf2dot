import data1 from './data1.ttl?raw'
import rules1 from './rules1.n3?raw'
import rules2 from './rules2.n3?raw'
import diagram2 from './diagram2.ttl?raw'
import '../packages/rdf2dot-lit/custom.js'

document.getElementById('data1').textContent = data1
document.getElementById('rules1').textContent = rules1
document.getElementById('rules2').textContent = rules2
document.getElementById('diagram2').textContent = diagram2
graph1 = document.getElementById('graph1')
graph1.rules = rules1
graph1.data = data1
graph2 = document.getElementById('graph2')
graph2.rules = rules2
graph2.data = data1
