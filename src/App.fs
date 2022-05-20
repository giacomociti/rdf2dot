module App

open Browser.Dom
open Fable.Core
open Fable.Core.JsInterop
open Graph

let getSubject (x: obj) =
    match x?termType with
    | "NamedNode" -> Subject.Uri x?value
    | "BlankNode" -> Subject.Blank x?value
    | _ -> failwith $"unknown subject {x}"

let getPredicate (x: obj) =
    match x?termType with
    | "NamedNode" -> 
        if x?value = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        then Predicate.RdfType
        else Predicate.Uri x?value
    | _ -> failwith $"unknown predicate {x}"    

let getObject (x: obj) =
    match x?termType with
    | "NamedNode" -> Object.Uri x?value
    | "BlankNode" -> Object.Blank x?value
    | "Literal" -> Object.Literal x?value
    | _ -> failwith $"unknown object {x}"    

let triple (quad: obj) =
    getSubject quad?subject, getPredicate quad?predicate, getObject quad?object

let getDot quads =
    quads
    |> Array.map triple 
    |> Array.toList
    |> Graph.fromTriples
    |> Dot.fromGraph


[<ImportAll("./Renderer.js")>]
let renderer: obj = jsNative    

let render(rdf, selection) =
    renderer?render(rdf, selection)