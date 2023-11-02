import { n3reasoner } from 'eyereasoner'

const applyRules = (...rules) => n3reasoner(rules)

export default applyRules