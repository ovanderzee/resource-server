#!/usr/bin/env node

import { startServer } from './lib/stream-statics.js'

if (process.argv && process.argv.length >= 2) {
    // [2, 4, 6] = --port --root etc...
    const cliArgs = process.argv.splice(2)
    const config = {}

    for (let i = 0; i < cliArgs.length; i++) {
        if (cliArgs[i].startsWith('--')) {
            const arg = cliArgs[i].replace(/^--/, '')

            switch (cliArgs[i + 1] && arg) {
                case 'port':
                    config.port = Number(cliArgs[i + 1])
                    break
                case 'protocol':
                    config.protocol = cliArgs[i + 1]
                    break
                case 'root':
                    config.root = cliArgs[i + 1]
                    break
                default:
                    if (!!Number(arg)) {
                        config.port = arg
                    } else if (arg === 'http' || arg === 'http2' || arg === 'https') {
                        config.protocol = arg
                    } else if (arg.startsWith('.')) {
                        config.root = arg
                    }
            }
        }
    }

    startServer(config)
}
