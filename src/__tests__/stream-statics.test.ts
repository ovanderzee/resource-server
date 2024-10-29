import assert from 'node:assert'
import esmock from 'esmock'
import { afterEach, describe, it, mock } from 'node:test'
import * as types from '../types'

const getCreatedServer = (protocol: string): any => {
    return {
        name: `mocked ${protocol} server`,
        listen: () => {}
    }
}

describe('Serving happily', async () => {

    const checkMocks = await esmock('../stream-statics.js', {
        '../configuration': {
            checkPort: () => 'mocked port check',
            checkRoot: () => 'mocked filesystem check'
        }
    })

    let server: types.WebServer

    afterEach(() => {
        server.close()
    })

    it('should serve with a root path', async (t) => {
        server = await checkMocks.startServer({})

        assert(
            server,
            `Expected a server to be returned`
        )
    })

    it('should check for ports and warn for duplicate use', async (t) => {
        server = await checkMocks.startServer({})

        assert(
            server,
            `Expected http.createServer to have been called`
        )
    })

})

describe('Serving alternated', async () => {

    it('should not work without a valid root path', async (t) => {
        const checkMocks = await esmock('../stream-statics.js', {
            '../configuration': {
                checkRoot: () => false
            }
        })

        let server: any

        try {
            server = await checkMocks.startServer({})
        }
        catch(e) {}
        finally {
            assert(
                !server,
                `Expected server not to exist`
            )
        }

    })

    it('should find a used port but serve anyway', async (t) => {
        const checkMocks = await esmock('../stream-statics.js', {
            '../configuration': {
                checkPort: async () => false,
            }
        })

        const server = await checkMocks.startServer({})

        assert(
            server,
            `Expected http.createServer to have been called`
        )

        server.close()
    })

})

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
