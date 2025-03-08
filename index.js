import rulesBasic from './packages/rdf2dot/rules/basic.n3?raw'
import rulesDefault from './packages/rdf2dot/rules/default.n3?raw'
import { saveAs } from 'file-saver'
import { shorten } from '@zazuko/s'
import '@rdfjs-elements/rdf-editor'
import './packages/rdf2dot-wc/index.js'

const fileInput = document.getElementById("fileInput")
const rulesInput = document.getElementById("rulesInput")
const showButton = document.getElementById("show")
const saveButton = document.getElementById("save")
const shareButton = document.getElementById("share")
const shareDialog = document.getElementById("shareDialog")
const shortenButton = document.getElementById("shorten")
const shareLink = document.getElementById("shareLink")
const graph = document.getElementById("graph")
const data = document.getElementById("data")
const rules = document.getElementById("rules")
const toggleRulesButton = document.getElementById("toggleRules")
const defaultRulesButton = document.getElementById("loadDefaultRules")
const basicRulesButton = document.getElementById("loadBasicRules")
const rulesLabel = document.getElementById("rulesLabel")

document.addEventListener('DOMContentLoaded', () => {
    const searchParams = new URL(window.location.href).searchParams
    if(searchParams.has("data") && searchParams.has("rules")) {
        data.value = searchParams.get("data")
        rules.value = searchParams.get("rules")
        showButton.click()
    } else {
        rules.value = rulesDefault
        rulesLabel.textContent = "Using Default Rules"
    }
})

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

shareButton.addEventListener("click", () => {
    const url = new URL(window.location.href).origin 
        + window.location.pathname 
        + "?data=" + encodeURIComponent(data.value) 
        + "&rules=" + encodeURIComponent(rules.value)
    shareLink.value = url
    shareLink.select()
    shortenButton.removeAttribute("disabled")
    shareDialog.showModal()
 })

shortenButton.addEventListener("click", async () => {
    shareLink.value = await shorten(shareLink.value)
    shareLink.select()
    shortenButton.setAttribute("disabled", true)
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