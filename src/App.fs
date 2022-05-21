module App

open Browser.Dom
open Fable.Core
open Fable.Core.JsInterop
open Graph

[<ImportAll("./Renderer.js")>]
let renderer: obj = jsNative    

let render(rdf, selection) =
    renderer?render(rdf, selection)

let shrinkWith (prefixMap: obj) (x: obj) =
    let result = prefixMap?shrink(x)
    if isNull result
    then x?value
    else result?value

let getSubject shrink (x: obj) =
    match x?termType with
    | "NamedNode" -> Subject.Uri (shrink x)
    | "BlankNode" -> Subject.Blank x?value
    | _ -> failwith $"unknown subject {x}"

let getPredicate shrink (x: obj) =
    match x?termType with
    | "NamedNode" -> 
        if x?value = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        then Predicate.RdfType
        else Predicate.Uri (shrink x)
    | _ -> failwith $"unknown predicate {x}"    

let getObject shrink (x: obj) =
    match x?termType with
    | "NamedNode" -> Object.Uri (shrink x)
    | "BlankNode" -> Object.Blank x?value
    | "Literal" -> Object.Literal x?value
    | _ -> failwith $"unknown object {x}"    

let triple shrink (quad: obj) =
    getSubject shrink quad?subject, 
    getPredicate shrink quad?predicate, 
    getObject shrink quad?object

let getDot (quads, prefixMap: obj) =
    quads
    |> Array.map (triple (shrinkWith prefixMap))
    |> Array.toList
    |> Graph.fromTriples
    |> Dot.fromGraph