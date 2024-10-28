import assert from 'node:assert'
import esmock from 'esmock'
import { describe, it, mock } from 'node:test'

const getCreatedServer = (protocol: string): any => {
    return {
        name: `mocked ${protocol} server`,
        listen: () => {}
    }
}

describe('Serving http', async () => {

    const ststMocks = await esmock('../stream-statics.js', {
        http: {
            createServer: () => getCreatedServer('http')
        }
    })

    it('should create an http server', async (t) => {
        const server = await ststMocks.startServer({protocol: 'http'})

        assert(
            server.name === 'mocked http server',
            `Expected http.createServer to have been called`
        )
    })

})

describe('Serving https', async () => {

    const ststMocks = await esmock('../stream-statics.js', {
        https: {
            createServer: () => getCreatedServer('https')
        }
    })

    it('should create an https server', async (t) => {
        const server = await ststMocks.startServer({protocol: 'https'})

        assert(
            server.name === 'mocked https server',
            `Expected https.createServer to have been called`
        )
    })

})
