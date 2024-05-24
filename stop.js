import { spawnSync } from 'child_process'
import { spotPort } from './lib/configuration.js'

const terminateServer = (port) => {
    const lsofOut = spawnSync( 'lsof', ['-t', '-i:' + port], { encoding: 'utf-8' } );
    const pids = lsofOut.stdout.trim()
    if (pids) {
        console.log('terminating server at port' , port)
        pids.split('\n').forEach(
            pid=> spawnSync('kill', [pid])
        )
    } else {
        console.log('port', port, 'not active')
    }
    return pids.length
}

if (process.argv && process.argv.length >= 2) {
    const cliArgs = process.argv.splice(2)

    for (let i = 0; i < cliArgs.length; i++) {
        if (cliArgs[i].startsWith('--')) {
            const arg = cliArgs[i].replace(/^--/, '')

            switch (cliArgs[i + 1] && arg) {
                case 'port':
                    terminateServer(Number(cliArgs[i + 1]))
                    break
                default:
                    if (spotPort(arg)) {
                        terminateServer(Number(arg))
                    }
            }
        }
    }
}
