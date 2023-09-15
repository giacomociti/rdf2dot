import { test, expect } from 'vitest'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { SwiplEye, queryOnce } from 'eyereasoner'
import { Parser, Store, DataFactory } from 'n3'

const { namedNode } = DataFactory

const applyRules = async (test, rules) => {
    const chunks = []
    const Module = await SwiplEye({ print: x => { chunks.push(x) }, arguments: ['-q'] })
    Module.FS.writeFile('test.n3', test)
    Module.FS.writeFile('rules.n3', rules)
    queryOnce(Module, 'main', ['--nope', '--quiet', './rules.n3', './test.n3', '--pass-only-new'])
    const result = chunks.join('\n')
    return new Store(new Parser().parse(result))
}

const dirname = path.dirname(fileURLToPath(import.meta.url))
const support = name => fs.readFileSync(path.join(dirname, 'support', name)).toString()

const basicRules = fs.readFileSync(path.resolve(dirname, '..', 'rules', 'basic.n3'))

const isSuccess = dataset => {
    const rdfType = namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')
    const earlPass = namedNode('http://www.w3.org/ns/earl#Pass')
    return dataset.match(null, rdfType, earlPass).size === 1
}

test('basic rules', async () => {
    const testName = 'basic01'
    const test = support(`${testName}.n3`)

    const result = await applyRules(test, basicRules)
   
    expect(isSuccess(result)).toEqual(true)
})
