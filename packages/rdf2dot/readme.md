## Graphviz diagrams from RDF.
The `rdf2dot` package includes an RDF vocabulary to describe diagrams and a function to convert such descriptions into the Graphviz dot notation.

The package also provides N3 rules to convert any RDF data to a diagram description using the eye reasoner.

```js

import rdf2dot from 'rdf2dot'
import { n3reasoner } from 'eyereasoner'
import fs from 'fs'
import { createRequire } from 'module'
 
const require = createRequire(import.meta.url)
const rules = fs.readFileSync(require.resolve('rdf2dot/rules/default.n3'))
const data = '<ann> <knows> <bob> .'
const diagram = await n3reasoner([data, rules])

const dot = rdf2dot(diagram)
console.log(dot)

```


