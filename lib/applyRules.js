import { SwiplEye, queryOnce } from 'eyereasoner'

const applyRules = async (...rules) => {
    const chunks = []
    const Module = await SwiplEye({ print: x => { chunks.push(x) }, arguments: ['-q'] })
    rules.forEach((rule, i) => Module.FS.writeFile(`rule${i}.n3`, rule))
    const names = rules.map((_, i) => `rule${i}.n3`)
    queryOnce(Module, 'main', ['--nope', '--quiet', '--pass-only-new', ...names])
    return chunks.join('\n')
}

export default applyRules