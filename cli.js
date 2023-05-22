#!/usr/bin/env node

import { startServer } from './lib/stream-statics.js'

if (process.argv && process.argv.length > 2) {
    // [2, 4, 6] = --port --root etc...
    const cliArgs = process.argv.splice(2)
    const config = {}

    for (let i = 0; i < cliArgs.length; i = i + 2) {
        if (cliArgs[i + 1]) {
            const arg = cliArgs[i].replace(/^--/, '')
            if (arg === 'port') {
                config[arg] = Number(cliArgs[i + 1])
            } else {
                config[arg] = cliArgs[i + 1]
            }
        }
    }

    startServer(config)
}
