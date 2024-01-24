import * as http from 'http';
import * as https from 'https';
import * as http2 from 'http2';
import url from 'url';
import fs from 'fs';
import path from 'path';
import mime from './optional-mime.js';
import getSecureOptions from './certify-https.js';
/*
    All possible variables
*/
const defaultConfig = {
    root: '.',
    protocol: 'http2',
    port: 9630
};
const logError = (err) => {
    console.log('---- stream statics ----------------\n', `error ${JSON.stringify(err, null, 2)}`);
};
/*
    Create the server
*/
const createServer = function (config) {
    const srvrsrc = serveResources.bind(config);
    let server;
    if (config.protocol === 'http') {
        server = http.createServer(srvrsrc);
    }
    else if (config.protocol === 'https') {
        server = https.createServer(getSecureOptions(), srvrsrc);
    }
    else { // if (config.protocol === 'http2') {
        server = http2.createSecureServer(getSecureOptions(), srvrsrc);
    }
    return server;
};
/*
    Stream the file
*/
const outputStream = async (stream, 
// solve error TS2349: This expression is not callable.
// Each member of the union type '[ ]' has signatures,
// but none of those signatures are compatible with each other.
response // http.ServerResponse | http2.Http2ServerResponse,
) => {
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
const serveResources = async function (request, 
// solve error TS2349: This expression is not callable.
// Each member of the union type '[ ]' has signatures,
// but none of those signatures are compatible with each other.
response // http.ServerResponse | http2.Http2ServerResponse,
) {
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
        logError(err);
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
    const server = createServer(config);
    try {
        server.listen(config.port);
        console.log(`\n---- stream statics ----------------------------------------------------\n`, `looking at '${config.root}',`, `listening to ${config.protocol === 'http2' ? 'https' : 'http'}://localhost:${config.port}`);
    }
    catch (err) {
        logError(err);
    }
    return server;
};
