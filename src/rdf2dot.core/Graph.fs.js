import { Record, Union } from "../.fable/fable-library.3.2.9/Types.js";
import { record_type, tuple_type, list_type, option_type, union_type, string_type } from "../.fable/fable-library.3.2.9/Reflection.js";
import { Dictionary } from "../.fable/fable-library.3.2.9/MutableMap.js";
import { List_distinct, List_groupBy } from "../.fable/fable-library.3.2.9/Seq2.js";
import { safeHash, equals } from "../.fable/fable-library.3.2.9/Util.js";
import { empty, ofSeq, append, choose } from "../.fable/fable-library.3.2.9/List.js";
import { map } from "../.fable/fable-library.3.2.9/Seq.js";

export class Subject extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["Uri", "Blank"];
    }
}

export function Subject$reflection() {
    return union_type("Graph.Subject", [], Subject, () => [[["Item", string_type]], [["Item", string_type]]]);
}

export class Predicate extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["RdfType", "Uri"];
    }
}

export function Predicate$reflection() {
    return union_type("Graph.Predicate", [], Predicate, () => [[], [["Item", string_type]]]);
}

export class Object$ extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["Uri", "Blank", "Literal"];
    }
}

export function Object$$reflection() {
    return union_type("Graph.Object", [], Object$, () => [[["Item", string_type]], [["Item", string_type]], [["Item", string_type]]]);
}

export class NodeId extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["NodeId"];
    }
}

export function NodeId$reflection() {
    return union_type("Graph.NodeId", [], NodeId, () => [[["Item", string_type]]]);
}

export class Node$ extends Record {
    constructor(Id, Label, Types, Attributes) {
        super();
        this.Id = Id;
        this.Label = Label;
        this.Types = Types;
        this.Attributes = Attributes;
    }
}

export function Node$$reflection() {
    return record_type("Graph.Node", [], Node$, () => [["Id", NodeId$reflection()], ["Label", option_type(string_type)], ["Types", list_type(string_type)], ["Attributes", list_type(tuple_type(string_type, string_type))]]);
}

export class Edge extends Record {
    constructor(From, To, Label) {
        super();
        this.From = From;
        this.To = To;
        this.Label = Label;
    }
}

export function Edge$reflection() {
    return record_type("Graph.Edge", [], Edge, () => [["From", NodeId$reflection()], ["To", NodeId$reflection()], ["Label", string_type]]);
}

export class Graph extends Record {
    constructor(Nodes, Edges) {
        super();
        this.Nodes = Nodes;
        this.Edges = Edges;
    }
}

export function Graph$reflection() {
    return record_type("Graph.Graph", [], Graph, () => [["Nodes", list_type(Node$$reflection())], ["Edges", list_type(Edge$reflection())]]);
}

export function nodes(_arg1) {
    return _arg1.Nodes;
}

export function edges(_arg1) {
    return _arg1.Edges;
}

export function fromTriples(triples) {
    const nodeId = (arg) => {
        let _arg3;
        return new NodeId(0, (_arg3 = arg, (_arg3.tag === 1) ? _arg3.fields[0] : _arg3.fields[0]));
    };
    const tryAsSubject = (_arg5) => {
        switch (_arg5.tag) {
            case 1: {
                return new Subject(1, _arg5.fields[0]);
            }
            case 2: {
                return void 0;
            }
            default: {
                return new Subject(0, _arg5.fields[0]);
            }
        }
    };
    const subjects = new Dictionary(List_groupBy((tupledArg) => tupledArg[0], triples, {
        Equals: (x_6, y_1) => equals(x_6, y_1),
        GetHashCode: (x_6) => safeHash(x_6),
    }), {
        Equals: (x_7, y_2) => equals(x_7, y_2),
        GetHashCode: (x_7) => safeHash(x_7),
    });
    const node = (subject_1, subjectTriples) => {
        let _arg4;
        return new Node$(nodeId(subject_1), (_arg4 = subject_1, (_arg4.tag === 1) ? (void 0) : _arg4.fields[0]), choose((_arg7) => {
            let pattern_matching_result;
            if (_arg7[1].tag === 0) {
                if (_arg7[2].tag === 0) {
                    pattern_matching_result = 0;
                }
                else {
                    pattern_matching_result = 1;
                }
            }
            else {
                pattern_matching_result = 1;
            }
            switch (pattern_matching_result) {
                case 0: {
                    return _arg7[2].fields[0];
                }
                case 1: {
                    return void 0;
                }
            }
        }, subjectTriples), choose((_arg6) => {
            let pattern_matching_result_1, name, value;
            if (_arg6[1].tag === 1) {
                if (_arg6[2].tag === 2) {
                    pattern_matching_result_1 = 0;
                    name = _arg6[1].fields[0];
                    value = _arg6[2].fields[0];
                }
                else {
                    pattern_matching_result_1 = 1;
                }
            }
            else {
                pattern_matching_result_1 = 1;
            }
            switch (pattern_matching_result_1) {
                case 0: {
                    return [name, value];
                }
                case 1: {
                    return void 0;
                }
            }
        }, subjectTriples));
    };
    return new Graph(append(ofSeq(map((_arg8) => {
        const activePatternResult193 = _arg8;
        return node(activePatternResult193[0], activePatternResult193[1]);
    }, subjects)), choose((o_3) => {
        const matchValue_2 = tryAsSubject(o_3);
        let pattern_matching_result_2, s_5;
        if (matchValue_2 != null) {
            if (!subjects.has(matchValue_2)) {
                pattern_matching_result_2 = 0;
                s_5 = matchValue_2;
            }
            else {
                pattern_matching_result_2 = 1;
            }
        }
        else {
            pattern_matching_result_2 = 1;
        }
        switch (pattern_matching_result_2) {
            case 0: {
                return node(s_5, empty());
            }
            case 1: {
                return void 0;
            }
        }
    }, List_distinct(choose((tupledArg_2) => {
        const o_2 = tupledArg_2[2];
        const matchValue_1 = [tupledArg_2[0], tupledArg_2[1], o_2];
        let pattern_matching_result_3;
        if (matchValue_1[1].tag === 1) {
            if (matchValue_1[2].tag === 0) {
                pattern_matching_result_3 = 0;
            }
            else if (matchValue_1[2].tag === 1) {
                pattern_matching_result_3 = 0;
            }
            else {
                pattern_matching_result_3 = 1;
            }
        }
        else {
            pattern_matching_result_3 = 1;
        }
        switch (pattern_matching_result_3) {
            case 0: {
                return o_2;
            }
            case 1: {
                return void 0;
            }
        }
    }, triples), {
        Equals: (x_8, y_3) => equals(x_8, y_3),
        GetHashCode: (x_8) => safeHash(x_8),
    }))), choose((tupledArg_1) => {
        const matchValue = [tryAsSubject(tupledArg_1[2]), tupledArg_1[1]];
        let pattern_matching_result_4, x_5, y;
        if (matchValue[0] != null) {
            if (matchValue[1].tag === 1) {
                pattern_matching_result_4 = 0;
                x_5 = matchValue[0];
                y = matchValue[1].fields[0];
            }
            else {
                pattern_matching_result_4 = 1;
            }
        }
        else {
            pattern_matching_result_4 = 1;
        }
        switch (pattern_matching_result_4) {
            case 0: {
                return new Edge(nodeId(tupledArg_1[0]), nodeId(x_5), y);
            }
            case 1: {
                return void 0;
            }
        }
    }, triples));
}

