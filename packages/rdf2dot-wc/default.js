import {Rdf2DotCustom} from './index.js'
import visualizationRules from '../../packages/rdf2dot/rules/default.n3?raw'

export class Rdf2DotDefault extends Rdf2DotCustom {

  static observedAttributes = ["data"]

  constructor() {
    super()
    this.rules = visualizationRules
  }
}

customElements.define("rdf2dot-default", Rdf2DotDefault)
