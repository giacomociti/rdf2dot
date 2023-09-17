import fs from 'fs'
import applyRules from '../lib/applyRules.js'
import toDot from '../lib/toDot.js'

const files = process.argv.slice(2)
const rules = files.map(x => fs.readFileSync(x).toString())
const diagram = await applyRules(...rules)
const dot = toDot(diagram)
console.log(dot)