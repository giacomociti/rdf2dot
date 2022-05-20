import { Parser } from "n3";
import * as d3 from "d3-graphviz";
import { getDot } from "./App.fs.js";

export function render(rdf, selection) {
    var quads = new Array();
    new Parser().parse(rdf, (error, quad, prefixes) => {
        if (error){
            console.log(error);
        }
        else if (quad){
            console.log(quad);
            quads.push(quad);
        }
        else if (prefixes){
            console.log(prefixes);
            var dot = getDot(quads);
            d3.graphviz(selection).renderDot(dot)
        }
    })
}