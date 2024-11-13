import {instance} from '@viz-js/viz';
// import visualizationRules from '../../examples/visualization.n3?raw'

export class Rdf2DotCustom extends HTMLElement {

  static observedAttributes = ["rules", "data"]

  constructor() {
    super()
  }

  // getter and setter for rules attribute
  get rules() {
    return this.getAttribute("rules")
  }
  set rules(value) {
    this.setAttribute("rules", value)
  }

  // getter and setter for data attribute
  get data() {
    return this.getAttribute("data")
  }
  set data(value) {
    this.setAttribute("data", value)
  }

  async draw() {
    this.childNodes.forEach(child => child.remove())
    this.appendChild(document.createTextNode('drawing diagram...'))
    const {n3reasoner} = await import('eyereasoner')
    const {default: rdf2dot} = await import('rdf2dot')

    try {
      const diagram = await n3reasoner([this.data, this.rules])
      const dot = rdf2dot(diagram)
      const viz = await instance()
      this.svg = viz.renderSVGElement(dot)
      this.childNodes.forEach(child => child.remove())
      this.appendChild(this.svg)
    }
    catch (e) {
      this.childNodes.forEach(child => child.remove())
      this.appendChild(document.createTextNode(e.message))
    }
  }

  attributeChangedCallback(name) {
    if (name === "rules" || name === "data") {
      if (this.rules && this.data) {
        this.draw()
      }
    }
  }
}

customElements.define("rdf2dot-custom", Rdf2DotCustom);
