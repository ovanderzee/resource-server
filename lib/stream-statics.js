import * as http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';
import mime from './optional-mime.js';
/*
    All possible variables
*/
const defaultConfig = {
    root: '.',
    port: 9630
};
/*
    Stream the file
*/
const outputStream = async (stream, response) => {
    for await (const chunk of stream) {
        if (chunk instanceof Buffer) {
            response.write(chunk);
        }
        else {
            // do we get here?
            const buffered = Buffer.from(chunk);
            response.write(buffered);
        }
    }
};
/*
    Serve the stream
*/
const serveResources = async function (request, response) {
    if (!request.url) {
        return;
    }
    let contentType = false;
    try {
        const locator = new url.URL(request.url, `http://localhost:${this.port}`);
        const fileName = path.basename(locator.pathname);
        contentType = mime.contentType(fileName);
        const fileStream = fs.createReadStream(this.root + locator.pathname);
        if (contentType) {
            response.setHeader('Content-Type', contentType);
        }
        else {
            console.log('No Content-Type found for', request.url);
        }
        response.writeHead(200);
        await outputStream(fileStream, response);
    }
    catch (err) {
        // implicit 404
        console.log('err', JSON.stringify(err, null, 2));
        response.write(`<h1>Nothing to serve</h1>`);
        response.write(`<h2>Handling ${request.url}${contentType ? ', content-type: ' + contentType : ''}</h2>`);
        response.write('<p>' + JSON.stringify(err, null, 2) + '</p>');
    }
    finally {
        response.end();
    }
};
/*
    Start the serve
*/
export const startServer = function (inputConfig) {
    const config = Object.assign(defaultConfig, inputConfig);
    const srvr = serveResources.bind(config);
    const server = http.createServer(srvr);
    try {
        server.listen(config.port);
        console.log(`\n------------------------------------------------------------------------\n`, `stream statics:`, `listening to localhost:${config.port},`, `looking at '${config.root}'`, `\n========================================================================\n\n`);
    }
    catch (err) {
        console.log('\n------------------------------------\n', `stream statics:`, `error ${JSON.stringify(err, null, 2)}`, '\n====================================\n\n');
    }
    return server;
};
