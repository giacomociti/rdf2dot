import { map, mapIndexed } from "../.fable/fable-library.3.2.9/Seq.js";
import { distinct } from "../.fable/fable-library.3.2.9/Seq2.js";
import { nodes as nodes_1, edges as edges_1 } from "./Graph.fs.js";
import { getEnumerator, compareArrays, stringHash } from "../.fable/fable-library.3.2.9/Util.js";
import { cons, sort, map as map_1, append as append_1 } from "../.fable/fable-library.3.2.9/List.js";
import { join, printf, toText } from "../.fable/fable-library.3.2.9/String.js";
import { getItemFromDict } from "../.fable/fable-library.3.2.9/MapUtil.js";
import { StringBuilder__AppendLine_Z721C83C5, StringBuilder_$ctor } from "../.fable/fable-library.3.2.9/System.Text.js";
import { toString } from "../.fable/fable-library.3.2.9/Types.js";

export function fromGraph(graph) {
    const predicateColor = new Map(mapIndexed((i, x_3) => [x_3, i + 1], distinct(map((x_1) => x_1.Label, edges_1(graph)), {
        Equals: (x_2, y_1) => (x_2 === y_1),
        GetHashCode: (x_2) => stringHash(x_2),
    })));
    const nodes = map((node) => {
        let matchValue;
        const fields = append_1(node.Types, map_1((tupledArg) => toText(printf("%s %s"))(tupledArg[0])(tupledArg[1]), sort(node.Attributes, {
            Compare: (x, y) => compareArrays(x, y),
        })));
        const label_1 = join("|", (matchValue = node.Label, (matchValue == null) ? fields : cons(matchValue, fields)));
        return toText(printf(" \"%s\" [shape=Mrecord label=\"{%s}\"] "))(node.Id.fields[0])(label_1);
    }, nodes_1(graph));
    const edges = map((edge) => {
        const color = getItemFromDict(predicateColor, edge.Label) | 0;
        const matchValue_2 = [edge.From, edge.To];
        return toText(printf("  \"%s\" -\u003e \"%s\" [color=\"%i\", label=\"%s\"]"))(matchValue_2[0].fields[0])(matchValue_2[1].fields[0])(color)(edge.Label);
    }, edges_1(graph));
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
            append(enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]());
        }
    }
    finally {
        enumerator.Dispose();
    }
    append("");
    const enumerator_1 = getEnumerator(edges);
    try {
        while (enumerator_1["System.Collections.IEnumerator.MoveNext"]()) {
            append(enumerator_1["System.Collections.Generic.IEnumerator`1.get_Current"]());
        }
    }
    finally {
        enumerator_1.Dispose();
    }
    append("}");
    return toString(sb);
}

