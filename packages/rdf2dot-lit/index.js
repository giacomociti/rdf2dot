import { html, LitElement } from 'lit';
import {instance} from '@viz-js/viz';
// import visualizationRules from '../../examples/visualization.n3?raw'

export class Rdf2DotLit extends LitElement {
  constructor() {
    super()
  }

  static properties = {
    rules: {type: String},
    data: {type: String},
    result: {type: String},
  }

  render() {
    return this.result
  }

  updated(_changedProperties) {
    if(_changedProperties.has('data') || _changedProperties.has('rules')) {
      if(this.data && this.rules) {
        this.draw()
      }
    }
  }

  async draw() {
    this.result = 'drawing diagram...'

    const {n3reasoner} = await import('eyereasoner')
    const {default: rdf2dot} = await import('rdf2dot')

    try {
      const diagram = await n3reasoner([this.data, this.rules])
      const dot = rdf2dot(diagram)
      const viz = await instance()
      this.svg = viz.renderSVGElement(dot)
      this.result = html`${this.svg}`
    }
    catch (e) {
      this.result = e.message
    }
  }
}

customElements.define('rdf2dot-lit', Rdf2DotLit);
