import * as http from 'http';
import * as https from 'https';
import * as http2 from 'http2';
import url from 'url';
import fs from 'fs';
import path from 'path';
import mime from './optional-mime.js';
import getSecureOptions from './certify-https.js';
import { checkPort, checkRoot, defaultConfig } from './configuration.js';
import { isDirectory, isExistent, isFile, logError, logNote, throwError } from './helpers.js';
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
    Look for index file, returns path to index or undefined
*/
const tryRedirect = (absPath) => {
    // check for index.html etc.
    const extentions = ['html', 'htm', 'gif', 'jpg', 'jpeg', 'png', 'svg', 'xml'];
    const filePaths = extentions.map(ext => {
        const indexFile = path.resolve(absPath + '/index.' + ext);
        if (isExistent(indexFile) && isFile(indexFile)) {
            return indexFile;
        }
    }).filter(x => x);
    if (filePaths[0]) {
        return filePaths[0];
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
    let absolutePath = '';
    try {
        const locator = new url.URL(request.url, `http://localhost:${this.port}`);
        absolutePath = path.resolve(this.root + locator.pathname);
        if (isExistent(absolutePath) && isDirectory(absolutePath)) {
            const indexPath = tryRedirect(absolutePath);
            absolutePath = indexPath ? indexPath : absolutePath;
        }
        contentType = mime.contentType(path.basename(absolutePath));
        if (contentType) {
            response.setHeader('Content-Type', contentType);
        }
        else {
            logNote(`No Content-Type found for ${request.url}`);
        }
        const fileStream = fs.createReadStream(absolutePath);
        response.writeHead(200);
        await outputStream(fileStream, response);
    }
    catch (err) {
        // implicit 404
        logError(err);
        response.write(`<h1>Page not found</h1>`);
        response.write('<p>' + absolutePath + '</p>');
    }
    finally {
        response.end();
    }
};
/*
    Start the serve
*/
export const startServer = async function (inputConfig) {
    const config = Object.assign(defaultConfig, inputConfig);
    if (!checkRoot(config.root)) {
        throwError(`Path "${path.resolve(config.root)}" can not be found`);
    }
    if (!await checkPort(config.port)) {
        throwError(`Port "${config.port}" is already in use`);
    }
    const server = createServer(config);
    try {
        server.listen(config.port);
        logNote(`looking at '${config.root}'
            \nlistening to ${config.protocol === 'http2' ? 'https' : 'http'}://localhost:${config.port}`);
    }
    catch (err) {
        logError(err);
    }
    return server;
};
