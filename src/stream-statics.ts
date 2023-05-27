import * as http from 'http'
import url from 'url'
import fs from 'fs'
import path from 'path'
import { StstConfig, StringOrFalse } from './types'
import mime from './optional-mime.js'

export const defaultConfig: StstConfig = {
    root: '.',
    port: 9630
}

/*
    Stream the file
*/
const outputStream = async (stream: fs.ReadStream, response: http.ServerResponse): Promise<void> => {
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
const serveResources = async function (this: StstConfig, request: http.IncomingMessage, response: http.ServerResponse): Promise<void> {
    if (!request.url) {
        return
    }

    let contentType: StringOrFalse = false;

    try {
        const locator: url.URL = new url.URL(request.url, `http://localhost:${this.port}`)
        const fileName: string = path.basename(locator.pathname)
        contentType = mime.contentType(fileName)
        const fileStream: fs.ReadStream = fs.createReadStream(this.root + locator.pathname)

        if (contentType) {
            response.setHeader('Content-Type', contentType)
        } else {
            console.log('No Content-Type found for', request.url)
        }

        response.writeHead(200)

        await outputStream(fileStream, response)
    }
    catch (err) {
        // implicit 404
        console.log('err', JSON.stringify(err, null, 2))
        response.write(`<h1>Nothing to serve</h1>`)
        response.write(`<h2>Handling ${request.url}${contentType ? ', content-type: ' + contentType : ''}</h2>`)
        response.write('<p>' + JSON.stringify(err, null, 2) + '</p>')
    }
    finally {
        response.end()
    }
}

export const startServer = function (inputConfig: StstConfig) {
    const config: StstConfig = Object.assign(defaultConfig, inputConfig)
    const srvr = serveResources.bind(config)
    const server = http.createServer(srvr)

    try {
        server.listen(config.port)

        console.log(
            `\n------------------------------------------------------------------------\n`,
            `stream statics:`,
            `listening to localhost:${config.port},`,
            `looking at '${config.root}'`,
            `\n========================================================================\n\n`,
        )
    }
    catch (err) {
        console.log(
            '\n------------------------------------\n',
            `stream statics:`,
            `error ${JSON.stringify(err, null, 2)}`,
            '\n====================================\n\n',
        )
    }

    return server
}
