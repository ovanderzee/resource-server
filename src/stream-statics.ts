import * as http from 'http'
import * as https from 'https'
import * as http2 from 'http2'
import url from 'url'
import fs from 'fs'
import path from 'path'
import mime from './optional-mime.js'
import getSecureOptions from './certify-https.js'
import * as types from './types'
import { checkPort, checkRoot, defaultConfig } from './configuration.js'
import {logError, logNote, throwError} from './helpers.js'

/*
    Create the server
*/
const createServer = function (config: types.ServerConfig): types.WebServer {
    const srvrsrc = serveResources.bind(config)
    let server

    if (config.protocol === 'http') {
        server = http.createServer(srvrsrc)
    } else if (config.protocol === 'https') {
        server = https.createServer(getSecureOptions(), srvrsrc)
    } else { // if (config.protocol === 'http2') {
        server = http2.createSecureServer(getSecureOptions(), srvrsrc)
    }

    return server
}

/*
    Stream the file
*/
const outputStream = async (
    stream: fs.ReadStream,
    // solve error TS2349: This expression is not callable.
    // Each member of the union type '[ ]' has signatures,
    // but none of those signatures are compatible with each other.
    response: any // http.ServerResponse | http2.Http2ServerResponse,
): Promise<void> => {
    for await (const chunk of stream) {
        if (chunk instanceof Buffer) {
            response.write(chunk)
        } else {
            // do we get here?
            const buffered = Buffer.from(chunk);
            response.write(buffered)
        }
    }
}

/*
    Serve the stream
*/
const serveResources = async function (
    this: types.ServerConfig,
    request: http.IncomingMessage | http2.Http2ServerRequest,
    // solve error TS2349: This expression is not callable.
    // Each member of the union type '[ ]' has signatures,
    // but none of those signatures are compatible with each other.
    response: any // http.ServerResponse | http2.Http2ServerResponse,
): Promise<void> {
    if (!request.url) {
        return
    }

    let contentType: string | false = false;

    try {
        const locator: url.URL = new url.URL(request.url, `http://localhost:${this.port}`)
        const fileName: string = path.basename(locator.pathname)
        contentType = mime.contentType(fileName)
        const fileStream: fs.ReadStream = fs.createReadStream(this.root + locator.pathname)

        if (contentType) {
            response.setHeader('Content-Type', contentType)
        } else {
            logNote(`No Content-Type found for ${request.url}`)
        }

        response.writeHead(200)

        await outputStream(fileStream, response)
    }
    catch (err) {
        // implicit 404
        logError(err)
        response.write(`<h1>Nothing to serve</h1>`)
        response.write(`<h2>Handling ${request.url}${contentType ? ', content-type: ' + contentType : ''}</h2>`)
        response.write('<p>' + JSON.stringify(err, null, 2) + '</p>')
    }
    finally {
        response.end()
    }
}

/*
    Start the serve
*/
export const startServer = async function (inputConfig: types.InputConfig): Promise<types.WebServer> {
    const config: types.ServerConfig = Object.assign(defaultConfig, inputConfig)

    if (!checkRoot(config.root)) {
        throwError(`Path "${path.resolve(config.root)}" can not be found`)
    }

    if (!await checkPort(config.port)) {
        throwError(`Port "${config.port}" is already in use`)
    }

    const server: types.WebServer = createServer(config)

    try {
        server.listen(config.port)

        logNote(
            `looking at '${config.root}'
            \nlistening to ${config.protocol === 'http2' ? 'https' : 'http'}://localhost:${config.port}`
        )
    }
    catch (err) {
        logError(err)
    }

    return server
}
