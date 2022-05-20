import { fromTriples, Object$, Predicate, Subject } from "./rdf2dot.core/Graph.fs.js";
import { interpolate, toText } from "./.fable/fable-library.3.2.9/String.js";
import { some } from "./.fable/fable-library.3.2.9/Option.js";
import { fromGraph } from "./rdf2dot.core/Dot.fs.js";
import { ofArray } from "./.fable/fable-library.3.2.9/List.js";
import { map } from "./.fable/fable-library.3.2.9/Array.js";
import { Parser } from "n3";
import * as d3_graphviz from "d3-graphviz";

export function getSubject(x) {
    const matchValue = x.termType;
    switch (matchValue) {
        case "NamedNode": {
            return new Subject(0, x.value);
        }
        case "BlankNode": {
            return new Subject(1, x.value);
        }
        default: {
            throw (new Error(toText(interpolate("unknown subject %P()", [x]))));
        }
    }
}

export function getPredicate(x) {
    if (x.termType === "NamedNode") {
        if (x.value === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") {
            return new Predicate(0);
        }
        else {
            return new Predicate(1, x.value);
        }
    }
    else {
        throw (new Error(toText(interpolate("unknown predicate %P()", [x]))));
    }
}

export function getObject(x) {
    const matchValue = x.termType;
    switch (matchValue) {
        case "NamedNode": {
            return new Object$(0, x.value);
        }
        case "BlankNode": {
            return new Object$(1, x.value);
        }
        case "Literal": {
            return new Object$(2, x.value);
        }
        default: {
            throw (new Error(toText(interpolate("unknown object %P()", [x]))));
        }
    }
}

export function triple(quad) {
    return [getSubject(quad.subject), getPredicate(quad.predicate), getObject(quad.object)];
}

export function log(x) {
    console.log(some(x));
    return x;
}

export function getDot(rdf) {
    return fromGraph(fromTriples(log(ofArray(map((quad) => triple(quad), log((new Parser()).parse(rdf)))))));
}

export function render(rdf, selection) {
    return (d3_graphviz.graphviz(selection)).renderDot(getDot(rdf));
}

