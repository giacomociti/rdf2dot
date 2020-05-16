open System
open System.IO
open VDS.RDF
open VDS.RDF.Parsing

let merge m1 m2 =
    Map.fold (fun s k v -> Map.add k v s) m1 m2

type Arguments(input, output) = 
    member __.Input = input |> Option.defaultValue "input.ttl"
    member this.Output = output |> Option.defaultValue (this.Input + ".dot")
    member __.Merge(inputOverride, outputOverride) =
        Arguments(inputOverride |> Option.orElse input,
                  outputOverride |> Option.orElse output)

type Settings = {
    BaseUri: Uri option
    Namespaces: Map<string, Uri> } with 
    
    member this.Merge(inputSettings) = { 
        BaseUri = inputSettings.BaseUri |> Option.orElse this.BaseUri
        Namespaces = merge this.Namespaces inputSettings.Namespaces }

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


let options name argv = 
    argv 
    |> Array.pairwise 
    |> Array.filter (fun (x, _) -> x = name) 
    |> Array.map snd

let inputArguments argv =
    let input = argv |> Array.tryItem 1
    let output = options "-o" argv |> Array.tryExactlyOne
    (input, output)

let inputSettings argv = {
    BaseUri =
        options "-base" argv
        |> Array.tryExactlyOne
        |> Option.map Uri
    Namespaces = 
        options "-ns" argv
        |> Array.filter (fun x -> x.Contains ':')
        |> Array.map (fun x -> 
            let i = x.IndexOf ':'
            let k = x.Substring(0, i)
            let v = x.Substring(i+1)
            (k, Uri v))
        |> Map.ofArray }

let configuredArguments() = Arguments(None, None) // TODO from config
let configuredSettings() = { BaseUri = None; Namespaces = Map.empty } // TODO from config

// dotnet run rdf2dot "../../test.ttl" -base http://example.org/ -ns :http://example.org/property/ -ns class:http://example.org/class/
[<EntryPoint>]
let main argv =
    let arguments = configuredArguments().Merge(inputArguments argv)
    let settings = configuredSettings().Merge(inputSettings argv)
    let turtle = File.ReadAllText(arguments.Input)    
    let dot = turtleToDot(turtle, settings)
    File.WriteAllText(path = arguments.Output, contents = dot)
    0 // return an integer exit code