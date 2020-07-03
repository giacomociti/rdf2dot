open System
open System.IO
open VDS.RDF
open VDS.RDF.Parsing
open CommandLine

type Settings = {
    BaseUri: Uri option
    Namespaces: Map<string, Uri> } 

let turtleToDot (turtle, settings) =
    use graph = new Graph()
    use stringReader = new StringReader(turtle)
    TurtleParser().Load(graph, stringReader)

    match settings.BaseUri with
    | Some uri -> graph.BaseUri <- uri
    | None -> ()
    
    for entry in settings.Namespaces do
        if not (graph.NamespaceMap.HasNamespace entry.Key)
        then graph.NamespaceMap.AddNamespace(entry.Key, entry.Value)

    graph |> Turtle.triples |> Graph.fromTriples |> Dot.fromGraph

type Options = {
  [<Option('b', "base", Required = false, HelpText = "Base Uri.")>] BaseUri : string option;
  [<Option('n', "namespace", Required = false, HelpText = "Namespaces.")>] Namespaces : seq<string>;
  [<Option('o', "output", Required = false, HelpText = "Output file path.")>] Output : string option;
  [<Value(0, MetaName="file", HelpText = "Path of turtle file.")>] Input : string option;
}

let run (options: Options) =
    let settings = {
        BaseUri = options.BaseUri |> Option.map System.Uri
        Namespaces = 
            options.Namespaces 
            |> Seq.filter (fun x -> x.Contains ':')
            |> Seq.map (fun x -> 
                let i = x.IndexOf ':'
                let k = x.Substring(0, i)
                let v = x.Substring(i+1)
                (k, Uri v))
            |> Map.ofSeq }
    let input = Option.defaultValue "input.ttl" options.Input
    let turtle = File.ReadAllText(input)    
    let dot = turtleToDot(turtle, settings)
    let output = Option.defaultValue (input + ".dot") options.Output
    File.WriteAllText(path = output, contents = dot)
    printfn "written %s" output
    0

let fail (x: seq<Error>) =
    printfn "%A" x
    1

[<EntryPoint>]
let main argv =
     let result = CommandLine.Parser.Default.ParseArguments<Options>(argv)
     match result with
     | :? Parsed<Options> as parsed -> run parsed.Value
     | :? NotParsed<Options> as notParsed -> fail notParsed.Errors
     | _ -> fail Seq.empty