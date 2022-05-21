import * as Renderer from "./Renderer.js";
import { fromTriples, Object$, Predicate, Subject } from "./rdf2dot.core/Graph.fs.js";
import { interpolate, toText } from "./.fable/fable-library.3.2.9/String.js";
import { fromGraph } from "./rdf2dot.core/Dot.fs.js";
import { ofArray } from "./.fable/fable-library.3.2.9/List.js";
import { map } from "./.fable/fable-library.3.2.9/Array.js";

export function render(rdf, selection) {
    return Renderer.render(rdf, selection);
}

export function shrinkWith(prefixMap, x) {
    const result = prefixMap.shrink(x);
    if (result == null) {
        return x.value;
    }
    else {
        return result.value;
    }
}

export function getSubject(shrink, x) {
    const matchValue = x.termType;
    switch (matchValue) {
        case "NamedNode": {
            return new Subject(0, shrink(x));
        }
        case "BlankNode": {
            return new Subject(1, x.value);
        }
        default: {
            throw (new Error(toText(interpolate("unknown subject %P()", [x]))));
        }
    }
}

export function getPredicate(shrink, x) {
    if (x.termType === "NamedNode") {
        if (x.value === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") {
            return new Predicate(0);
        }
        else {
            return new Predicate(1, shrink(x));
        }
    }
    else {
        throw (new Error(toText(interpolate("unknown predicate %P()", [x]))));
    }
}

export function getObject(shrink, x) {
    const matchValue = x.termType;
    switch (matchValue) {
        case "NamedNode": {
            return new Object$(0, shrink(x));
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

export function triple(shrink, quad) {
    return [getSubject(shrink, quad.subject), getPredicate(shrink, quad.predicate), getObject(shrink, quad.object)];
}

export function getDot(quads, prefixMap) {
    return fromGraph(fromTriples(ofArray(map((quad) => triple((x) => shrinkWith(prefixMap, x), quad), quads))));
}

