import { join, printf, substring, interpolate, toText, replace } from "../.fable/fable-library.3.2.9/String.js";
import { cons, append as append_1, sort, map } from "../.fable/fable-library.3.2.9/List.js";
import { getEnumerator, stringHash, compareArrays } from "../.fable/fable-library.3.2.9/Util.js";
import { map as map_1, mapIndexed } from "../.fable/fable-library.3.2.9/Seq.js";
import { distinct } from "../.fable/fable-library.3.2.9/Seq2.js";
import { nodes as nodes_1, edges as edges_1 } from "./Graph.fs.js";
import { getItemFromDict } from "../.fable/fable-library.3.2.9/MapUtil.js";
import { StringBuilder__AppendLine_Z721C83C5, StringBuilder_$ctor } from "../.fable/fable-library.3.2.9/System.Text.js";
import { toString } from "../.fable/fable-library.3.2.9/Types.js";

export function fromGraph(graph) {
    const nodeToDot = (node) => {
        let matchValue, label;
        const escape = (fieldValue) => {
            let quote;
            let copyOfStruct = "\"";
            quote = copyOfStruct;
            return replace(replace(replace(replace(replace(replace(replace(fieldValue, "{", "\\{"), "}", "\\}"), "|", "\\|"), quote, toText(interpolate("\\%P()", [quote]))), " ", "\\ "), "\u003e", "\\\u003e"), "\u003c", "\\\u003c");
        };
        const formatFieldValue = (x) => escape((x.length > 50) ? toText(interpolate("...%P()", [substring(x, x.length - 47)])) : x);
        const attributes = map((tupledArg) => {
            const name = tupledArg[0];
            const value = tupledArg[1];
            return toText(printf("%s %s"))(name)(value);
        }, sort(node.Attributes, {
            Compare: (x_1, y) => compareArrays(x_1, y),
        }));
        const fields = append_1(node.Types, attributes);
        const label_1 = join("|", map(formatFieldValue, (matchValue = node.Label, (matchValue == null) ? fields : ((label = matchValue, cons(label, fields))))));
        const n = node.Id.fields[0];
        return toText(printf(" \"%s\" [shape=Mrecord label=\"{%s}\"] "))(n)(label_1);
    };
    const predicateColor = new Map(mapIndexed((i, x_4) => [x_4, i + 1], distinct(map_1((x_2) => x_2.Label, edges_1(graph)), {
        Equals: (x_3, y_1) => (x_3 === y_1),
        GetHashCode: (x_3) => stringHash(x_3),
    })));
    const edgeToDot = (edge) => {
        const color = getItemFromDict(predicateColor, edge.Label) | 0;
        const matchValue_2 = [edge.From, edge.To];
        const y_2 = matchValue_2[1].fields[0];
        const x_5 = matchValue_2[0].fields[0];
        return toText(printf("  \"%s\" -\u003e \"%s\" [color=\"%i\", label=\"%s\"]"))(x_5)(y_2)(color)(edge.Label);
    };
    const nodes = map_1(nodeToDot, nodes_1(graph));
    const edges = map_1(edgeToDot, edges_1(graph));
    const sb = StringBuilder_$ctor();
    const append = (arg) => {
        void StringBuilder__AppendLine_Z721C83C5(sb, arg);
    };
    append("digraph {");
    append("  edge [colorscheme=\"paired12\"]");
    append("");
    const enumerator = getEnumerator(nodes);
    try {
        while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
            const n_1 = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]();
            append(n_1);
        }
    }
    finally {
        enumerator.Dispose();
    }
    append("");
    const enumerator_1 = getEnumerator(edges);
    try {
        while (enumerator_1["System.Collections.IEnumerator.MoveNext"]()) {
            const e = enumerator_1["System.Collections.Generic.IEnumerator`1.get_Current"]();
            append(e);
        }
    }
    finally {
        enumerator_1.Dispose();
    }
    append("}");
    return toString(sb);
}

