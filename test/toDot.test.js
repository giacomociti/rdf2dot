import { test } from 'vitest'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import approvals from 'approvals'
import toDot from 'rdf2dot'

const dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), 'support')
const support = name => fs.readFileSync(path.join(dirname, name)).toString()

test('to dot', () => {
    const testName = 'test01'
    const diagramText = support(`${testName}.ttl`)

    const dot = toDot(diagramText)
    
    approvals.verify(dirname, testName, dot)
})
