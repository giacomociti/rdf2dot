import { test, expect } from 'vitest'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import applyRules from '../lib/applyRules'
import { Parser, Store, DataFactory } from 'n3'

const { namedNode } = DataFactory

const dirname = path.dirname(fileURLToPath(import.meta.url))
const support = name => fs.readFileSync(path.join(dirname, 'support', name)).toString()

const isSuccess = result => {
    const dataset = new Store(new Parser().parse(result))
    const rdfType = namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')
    const earlPass = namedNode('http://www.w3.org/ns/earl#Pass')
    return dataset.match(null, rdfType, earlPass).size === 1
}

test('custom rules', async () => {
    const testName = 'custom01'
    const test = support(`${testName}.n3`)

    const result = await applyRules(test)
   
    expect(isSuccess(result)).toEqual(true)
})

const basicRules = fs.readFileSync(path.resolve(dirname, '..', 'rules', 'basic.n3'))
test('basic rules', async () => {
    const testName = 'basic01'
    const test = support(`${testName}.n3`)

    const result = await applyRules(test, basicRules)
   
    expect(isSuccess(result)).toEqual(true)
})

const defaultRules = fs.readFileSync(path.resolve(dirname, '..', 'rules', 'default.n3'))
const testNames = ['default01', 'default02']
for (const testName of testNames) {
    test(testName, async () => {
        const test = support(`${testName}.n3`)
        const result = await applyRules(test, defaultRules)
        expect(isSuccess(result)).toEqual(true)
    })
}