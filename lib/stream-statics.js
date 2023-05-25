var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import * as http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
export const defaultConfig = {
    root: '.',
    port: 9630
};
/*
    Stream the file
*/
const outputStream = (stream, response) => { var _a, stream_1, stream_1_1; return __awaiter(void 0, void 0, void 0, function* () {
    var _b, e_1, _c, _d;
    try {
        for (_a = true, stream_1 = __asyncValues(stream); stream_1_1 = yield stream_1.next(), _b = stream_1_1.done, !_b;) {
            _d = stream_1_1.value;
            _a = false;
            try {
                const chunk = _d;
                if (chunk instanceof Buffer) {
                    response.write(chunk);
                }
                else {
                    // do we get here?
                    const buffered = Buffer.from(chunk);
                    response.write(buffered);
                }
            }
            finally {
                _a = true;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_a && !_b && (_c = stream_1.return)) yield _c.call(stream_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}); };
/*
    Serve the stream
*/
const serveResources = function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
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
            yield outputStream(fileStream, response);
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
    });
};
export const startServer = function (inputConfig) {
    const config = Object.assign(defaultConfig, inputConfig);
    const srvr = serveResources.bind(config);
    const server = http.createServer(srvr);
    server.listen(config.port);
    console.log('\n------------------\n', 'stream statics', server, 'listening to localhost:' + config.port, 'looking at', config.root, '\n==================\n\n');
    return server;
};
