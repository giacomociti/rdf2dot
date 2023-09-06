// TODO use a build system

const fetchText = async file => {
    const response = await fetch(file)
    const text = await response.text()
    return text
}

const load = async (file, element) => {
    const text = await fetchText(file)
    document.getElementById(element).innerText = text
}

// depends on d3
const show = (dot, graphId) => {
    console.log(dot)
    d3.select(graphId)
        .graphviz({useWorker: false})
        .renderDot(dot)
}

// depends on eyereasoner
const applyRules = async (data, rules) => {
    const { SwiplEye, queryOnce } = eyereasoner
    const chunks = []
    const Module = await SwiplEye({ print: x => { chunks.push(x) }, arguments: ['-q'] })
    Module.FS.writeFile('data.ttl', data)
    Module.FS.writeFile('rules.n3', rules)
    // queryOnce(Module, 'main', ['--nope', '--quiet', './rules.n3', '--turtle', './data.ttl', '--pass-only-new']);
    queryOnce(Module, 'main', ['--nope', '--quiet', './rules.n3', './data.ttl', '--pass-only-new'])
    const result = chunks.join('\n')
    console.log(result)
    return result
}

// depends on N3
const convertToDot = toDot(window.N3.DataFactory)

// depends on N3 and d3
const showDiagramText = async (diagramText, graphId) => {
    const quads = new N3.Parser().parse(diagramText)
    const dot = await convertToDot(new N3.Store(quads))
    show(dot, graphId)
}

// depends on N3 and d3
const showDiagramFile = async (diagramFile, graphId) => {
    const diagramText = await fetchText(diagramFile)
    await showDiagramText(diagramText, graphId)
}

// depends on eyereasoner, N3 and d3
const showFromFiles = async (dataFile, ruleFile, graphId) => {
    const [data, rules] = await Promise.all([dataFile, ruleFile].map(fetchText))
    const diagramText = await applyRules(data, rules)
    await showDiagramText(diagramText, graphId)
}
