import {Rdf2DotCustom} from './custom.js'
import visualizationRules from '../../packages/rdf2dot/rules/basic.n3?raw'

export class Rdf2DotBasic extends Rdf2DotCustom {

  static observedAttributes = ["data"]

  constructor() {
    super()
    this.rules = visualizationRules
  }
}

customElements.define("rdf2dot-basic", Rdf2DotBasic);
