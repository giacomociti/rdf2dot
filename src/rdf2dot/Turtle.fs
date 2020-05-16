module Turtle

open Graph
open VDS.RDF

let triple shortUri (triple: Triple) =
    let subject =
        match triple.Subject with
        | :? IUriNode as n -> Subject.Uri (shortUri n.Uri.AbsoluteUri)
        | :? IBlankNode as b -> Subject.Blank (b.ToString())
        | _ -> failwithf "Unexpected subject %A" triple.Subject
    let predicate =
        match triple.Predicate with
        | :? IUriNode as n -> 
            if n.Uri.AbsoluteUri = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
            then Predicate.RdfType
            else Predicate.Uri (shortUri n.Uri.AbsoluteUri)
        | _ -> failwithf "Unexpected predicate %A" triple.Predicate
    let object =
        match triple.Object with
        | :? IUriNode as n -> Uri (shortUri n.Uri.AbsoluteUri)
        | :? IBlankNode as b -> Blank (b.ToString())
        | :? ILiteralNode as l -> Literal l.Value
        | _ -> failwithf "Unexpected object %A" triple.Object
    (subject, predicate, object)

let triples (graph: IGraph) =
    let shortUri absoluteUri =
        let baseUri = 
            if isNull graph.BaseUri then ""
            else graph.BaseUri.AbsoluteUri

        let reduceToBase (uri: string) =
            if uri.StartsWith baseUri
            then uri.Substring baseUri.Length
            else uri

        let ok, result = graph.NamespaceMap.ReduceToQName absoluteUri
        if ok then result
        else reduceToBase absoluteUri

    graph.Triples |> Seq.map (triple shortUri) |> Seq.toList