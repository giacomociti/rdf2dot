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
    

[<ImportAll("d3-graphviz")>]
let d3: obj = jsNative

[<Import("Parser", from="n3")>]
type Parser() =
    member __.parse: string -> obj array = jsNative

    
let log x = 
    console.log x    
    x

let getDot rdf =
    Parser().parse(rdf)
    |> log
    |> Array.map triple 
    |> Array.toList
    |> log
    |> Graph.fromTriples
    |> Dot.fromGraph


let render(rdf, selection) =
    d3?graphviz(selection)?renderDot(getDot rdf)
   
    
