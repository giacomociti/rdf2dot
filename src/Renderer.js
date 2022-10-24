import { Parser } from "n3"
import * as d3 from "d3-graphviz"
import { getDot } from "./App.fs.js"
import rdf from '@rdfjs/data-model'
import PrefixMap from '@rdfjs/prefix-map'

export function render(rdfInput, selection) {
    const quads = new Array();
    new Parser().parse(rdfInput, (error, quad, prefixes) => {
        if (error) {
            console.log(error)
        }
        else if (quad) {
            quads.push(quad)
        }
        else if (prefixes) {
            const entries = Object.entries(prefixes).map((x) => [x[0], rdf.namedNode(x[1])])
            const prefixMap = new PrefixMap(entries, { factory: rdf })
            var dot = getDot(quads, prefixMap)
            console.log(dot)
            d3.graphviz(selection).renderDot(dot)
        }
    })
}