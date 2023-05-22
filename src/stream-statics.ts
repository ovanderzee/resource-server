import * as http from 'http'
import url from 'url'
import fs from 'fs'
import path from 'path'
import { StstConfig } from './types'

export const defaultConfig: StstConfig = {
    root: '.',
    port: 9630
}

/*
    Read the file
*/
const streamToString = async (stream: fs.ReadStream): Promise<string> => {
    const chunks = [];

    for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
    }

    return Buffer.concat(chunks).toString("utf-8");
}

/*
    Serve the stream
*/
const serveResources = async function (this: StstConfig, request: http.IncomingMessage, response: http.ServerResponse): Promise<void> {
    if (!request.url) {
        return
    }

    const locator: url.URL = new url.URL(request.url, `http://localhost:${this.port}`)
    const fileStream: fs.ReadStream = fs.createReadStream(this.root + locator.pathname)

    try {
        const contents: string = await streamToString(fileStream)
        response.writeHead(200);
        response.write(contents)
    }
    catch (err) {
        // implicit 404
        response.write('<h2>nothing to serve</h2>')
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
    server.listen(config.port)

    console.log(
        '\n------------------\n',
        'stream statics', server,
        'listening to localhost:' + config.port,
        'looking at', config.root,
        '\n==================\n\n',
    )

    return server
}
