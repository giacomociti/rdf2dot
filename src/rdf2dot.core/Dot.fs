module Dot

open Graph
    
let fromGraph graph =
    let nodeToDot node =
        let attributes = 
            node.Attributes 
            |> List.sort
            |> List.map (fun (name, value) -> sprintf "%s %s" name value)
        let fields = node.Types @ attributes
        let label =
            match node.Label with
            | Some label -> label :: fields
            | None -> fields
            |> String.concat "|"
        match node.Id with NodeId n -> sprintf """ "%s" [shape=Mrecord label="{%s}"] """ n label

    let predicateColor = 
        edges graph
        |> Seq.map (fun x -> x.Label)
        |> Seq.distinct
        |> Seq.mapi (fun i x -> x, i+1)
        |> dict

    let edgeToDot edge =
        let color = predicateColor.[edge.Label]
        match edge.From, edge.To with
        NodeId x, NodeId y -> 
            sprintf """  "%s" -> "%s" [color="%i", label="%s"]"""  x y color edge.Label

    let nodes = nodes graph |> Seq.map nodeToDot
    let edges = edges graph |> Seq.map edgeToDot

    let sb = System.Text.StringBuilder()
    let append: string -> unit = sb.AppendLine >> ignore
    append "digraph {"
    append """  edge [colorscheme="paired12"]"""
    append ""
    for n in nodes do append n
    append ""
    for e in edges do append e
    append "}"
    sb.ToString()