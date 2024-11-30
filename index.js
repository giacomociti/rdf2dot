import rulesBasic from './packages/rdf2dot/rules/basic.n3?raw'
import rulesDefault from './packages/rdf2dot/rules/default.n3?raw'
import { saveAs } from 'file-saver'
import '@rdfjs-elements/rdf-editor'
import './packages/rdf2dot-wc/index.js'

const fileInput = document.getElementById("fileInput")
const rulesInput = document.getElementById("rulesInput")
const showButton = document.getElementById("show")
const saveButton = document.getElementById("save")
const graph = document.getElementById("graph")
const data = document.getElementById("data")
const rules = document.getElementById("rules")
const toggleRulesButton = document.getElementById("toggleRules")
const defaultRulesButton = document.getElementById("loadDefaultRules")
const basicRulesButton = document.getElementById("loadBasicRules")
const rulesLabel = document.getElementById("rulesLabel")

rules.value = rulesDefault
rulesLabel.textContent = "Using Default Rules"

rulesInput.addEventListener("change", () => {
    const [file] = rulesInput.files;
    if (file) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            rules.value = reader.result
            rulesLabel.textContent = "Using Custom Rules " + file.name
        })
        reader.readAsText(file)
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
    graph.rules = rules.value
    graph.data = data.value
    saveButton.removeAttribute("disabled")
})

saveButton.addEventListener("click", () => {
    saveAs(new File([graph.svg.outerHTML], "rdf.svg", {type: "image/svg+xml"}))
})

toggleRulesButton.addEventListener("click", () => {
    rules.classList.toggle("hidden")
    toggleRulesButton.textContent = rules.classList.contains("hidden") ? "Show Rules Editor" : "Hide Rules Editor"
})

defaultRulesButton.addEventListener("click", () => {
    rules.value = rulesDefault
    rulesLabel.textContent = "Using Default Rules"
})

basicRulesButton.addEventListener("click", () => {
    rules.value = rulesBasic
    rulesLabel.textContent = "Using Basic Rules"
})