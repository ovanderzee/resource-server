#!/usr/bin/env node

import cliGate from './lib/stream-statics.js'

if (process.argv && process.argv.length > 2) {
    // [2, 4, 6] = --port --root etc...
    cliGate(
        process.argv.splice(2)
    )
}
