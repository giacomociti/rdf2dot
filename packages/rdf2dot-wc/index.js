import basicVisualizationRules from '../../packages/rdf2dot/rules/basic.n3?raw'
import defaultVisualizationRules from '../../packages/rdf2dot/rules/default.n3?raw'
import rdf2dot from 'rdf2dot'

let eyereasoner, Viz;

async function load() { 
  if (window.eyereasoner) {
    eyereasoner = window.eyereasoner;
    console.log('eyereasoner already loaded')
  } else {
    console.log('loading eyereasoner')
    eyereasoner = await import('eyereasoner');
  }
  if (window.Viz) {
    Viz = window.Viz;
    console.log('Viz already loaded')
  } else {
    console.log('loading Viz')
    Viz = await import('@viz-js/viz');
  }
}
const loaded = load()

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
    await loaded
    
    this.childNodes.forEach(child => child.remove())
    this.appendChild(document.createTextNode('drawing diagram...'))

    try {
      const diagram = await eyereasoner.n3reasoner([this.data, this.rules])
      console.log(diagram)
      const dot = rdf2dot(diagram)
      console.log(dot)
      const viz = await Viz.instance()
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

export class Rdf2DotBasic extends Rdf2DotCustom {

  static observedAttributes = ["data"]

  constructor() {
    super()
    this.rules = basicVisualizationRules
  }
}

export class Rdf2DotDefault extends Rdf2DotCustom {

  static observedAttributes = ["data"]

  constructor() {
    super()
    this.rules = defaultVisualizationRules
  }
}

customElements.define("rdf2dot-custom", Rdf2DotCustom)
customElements.define("rdf2dot-basic", Rdf2DotBasic)
customElements.define("rdf2dot-default", Rdf2DotDefault)