import applyRules from './lib/applyRules'
import createSVG from "./lib/createSVG"
import rulesBasic from './rules/basic.n3?raw'
import rulesDefault from './rules/default.n3?raw'
import { saveAs } from 'file-saver'

const fileInput = document.getElementById("file")
const rulesInput = document.getElementById("rules")
const selectRules = document.getElementById("selectRules")
const showButton = document.getElementById("show")
const saveButton = document.getElementById("save")
const graph = document.getElementById("graph")

selectRules.add(new Option('default', rulesDefault))
selectRules.add(new Option('basic', rulesBasic))

let svg

const showGraph = async (data, rules) => {
    const diagramText = await applyRules(data, rules)
    svg = await createSVG(diagramText)
    graph.appendChild(svg)
}


let customRules
rulesInput.addEventListener("change", () => {
    const [file] = rulesInput.files;
    if (file) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            customRules = reader.result
        })
        reader.readAsText(file)
    }
    else {
        customRules = undefined
    }
})

let inputData
fileInput.addEventListener("change", () => {
    const [file] = fileInput.files;
    if (file) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            inputData = reader.result
            showButton.removeAttribute("disabled")
        })
        reader.readAsText(file);
    }
})

showButton.addEventListener("click", async () => {
    graph.innerHTML = ''
    await showGraph(inputData, customRules ?? selectRules.value)
    saveButton.removeAttribute("disabled")
})

saveButton.addEventListener("click", () => {
    saveAs(new File([svg.outerHTML], "rdf.svg", {type: "image/svg+xml"}))
})