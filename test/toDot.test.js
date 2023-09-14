import { test } from 'vitest'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import approvals from 'approvals'
import toDot from '../lib/toDot'
import { Parser, Store } from 'n3'

const dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), 'support')
const support = name => fs.readFileSync(path.join(dirname, name)).toString()

test('to dot', () => {
    const testName = 'test01'
    const diagramText = support(`${testName}.ttl`)
    const quads = new Parser().parse(diagramText)
    const dot = toDot(new Store(quads))
    approvals.verify(dirname, testName, dot)
})
