import { instance } from "@viz-js/viz"
import { Parser, Store } from 'n3'
import toDot from "./toDot"

const createSVG = async diagramText => {
    console.log(diagramText)
    const quads = new Parser().parse(diagramText)
    const dot = toDot(new Store(quads))
    console.log(dot)
    const viz = await instance()
    return viz.renderSVGElement(dot)
}

export default createSVG