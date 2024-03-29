import { instance } from "@viz-js/viz"
import toDot from "rdf2dot"

const createSVG = async diagramText => {
    console.log(diagramText)
    const dot = toDot(diagramText)
    console.log(dot)
    const viz = await instance()
    return viz.renderSVGElement(dot)
}

export default createSVG