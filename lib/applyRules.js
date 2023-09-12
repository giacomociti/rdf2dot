import { SwiplEye, queryOnce } from 'eyereasoner'

const applyRules = async (data, rules) => {
    const chunks = []
    const Module = await SwiplEye({ print: x => { chunks.push(x) }, arguments: ['-q'] })
    Module.FS.writeFile('data.ttl', data)
    Module.FS.writeFile('rules.n3', rules)
    // issues with blanks paresed with --turtle
    // queryOnce(Module, 'main', ['--nope', '--quiet', './rules.n3', '--turtle', './data.ttl', '--pass-only-new']);
    queryOnce(Module, 'main', ['--nope', '--quiet', './rules.n3', './data.ttl', '--pass-only-new'])
    const result = chunks.join('\n')
    return result
}

export default applyRules