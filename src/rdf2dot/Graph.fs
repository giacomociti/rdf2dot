module Graph 

    type Subject = Uri of string | Blank of string
    type Predicate = RdfType | Uri of string
    type Object = Uri of string | Blank of string | Literal of string
    type Triple = Subject * Predicate * Object

    type NodeId = NodeId of string
    type Node = { Id: NodeId; Label: string option; Types: string list; Attributes: (string * string) list }
    type Edge = { From: NodeId; To: NodeId; Label: string }

    type Graph = private { Nodes: Node list; Edges: Edge list }

    let nodes = function { Nodes = x; Edges = _ } -> x

    let edges = function { Nodes = _; Edges = x } -> x

    let fromTriples (triples: Triple list): Graph =

        let subject (s, _, _) = s
        let object (_, _, o) = o

        let nodeId = (function Subject.Uri x -> x | Subject.Blank x -> x) >> NodeId
        let nodeLabel = function Subject.Uri x -> Some x | Subject.Blank _ -> None

        let tryAsSubject = function
            | Uri x -> Some (Subject.Uri x)
            | Blank x -> Some (Subject.Blank x)
            | Literal _ -> None

        let tryAttribute = function
            | _, Predicate.Uri name, Literal value -> Some (name, value) 
            | _ -> None

        let tryType = function
            | _ , RdfType, Uri o -> Some o 
            | _ -> None

        let tryEdge (s, p, o) = 
            match tryAsSubject o, p with
            | Some x, Predicate.Uri y -> Some { From = nodeId s; To = nodeId x; Label = y }
            | _ -> None

        let tryObject (s, p, o) = 
            match (s, p, o)  with
            | _, Predicate.Uri _, Object.Uri _
            | _, Predicate.Uri _, Object.Blank _ -> Some o
            | _ -> None

        let subjects = triples |> List.groupBy subject |> dict

        let node subject subjectTriples = {
            Id = nodeId subject
            Label = nodeLabel subject
            Types = List.choose tryType subjectTriples
            Attributes = List.choose tryAttribute subjectTriples }

        let subjectNodes = 
            subjects
            |> Seq.map (function KeyValue (s, ts) -> node s ts)
            |> List.ofSeq

        let objectNodes = // non-literal objects that are not also subjects
            triples
            |> List.choose tryObject
            |> List.distinct
            |> List.choose (fun o ->
                match tryAsSubject o with
                | Some s when not (subjects.ContainsKey s) -> Some (node s [])
                | _ -> None)
        // let objectNodes = // non-literal objects that are not also subjects
        //     triples
        //     |> List.filter (function (_, Predicate.Uri _, _) -> true | _ -> false)
        //     |> List.map object
        //     |> List.distinct
        //     |> List.choose (fun o ->
        //         match tryAsSubject o with
        //         | Some s when not (subjects.ContainsKey s) -> Some (node s [])
        //         | _ -> None)

        { Nodes = subjectNodes @ objectNodes; Edges = List.choose tryEdge triples }