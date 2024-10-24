import assert from 'node:assert'
import { describe, it, mock } from 'node:test'
import { startServer } from '../stream-statics.js'
import * as cfg from '../configuration.js'
import * as types from '../types'
import * as http from 'http'
import * as https from 'https'
import * as http2 from 'http2'

describe('Serving http', async () => {

    it('should bring up an http server', async (t) => {
        t.mock.method(http, 'createServer')

        await startServer({protocol: 'http'})

        assert.strictEqual(http.createServer.mock.callCount(), 1);
    })
})
