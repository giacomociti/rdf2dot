import rulesBasic from './packages/rdf2dot/rules/basic.n3?raw'
import rulesDefault from './packages/rdf2dot/rules/default.n3?raw'
import { saveAs } from 'file-saver'
import '@rdfjs-elements/rdf-editor'
import './packages/rdf2dot-lit/index.js'

const fileInput = document.getElementById("file")
const rulesInput = document.getElementById("rules")
const selectRules = document.getElementById("selectRules")
const showButton = document.getElementById("show")
const saveButton = document.getElementById("save")
const graph = document.getElementById("graph")
const data = document.getElementById("data")

selectRules.add(new Option('default', rulesDefault))
selectRules.add(new Option('basic', rulesBasic))

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

fileInput.addEventListener("change", () => {
    const [file] = fileInput.files;
    if (file) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            data.value = reader.result
        })
        reader.readAsText(file);
    }
})

showButton.addEventListener("click", async () => {
    graph.rules = customRules ?? selectRules.value
    graph.data = data.value
    saveButton.removeAttribute("disabled")
})

saveButton.addEventListener("click", () => {
    saveAs(new File([graph.svg.outerHTML], "rdf.svg", {type: "image/svg+xml"}))
})