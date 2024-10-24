import assert from 'node:assert';
import { describe, it } from 'node:test';
import { startServer } from '../stream-statics.js';
import * as http from 'http';
describe('Serving http', async () => {
    it('should bring up an http server', async (t) => {
        t.mock.method(http, 'createServer');
        await startServer({ protocol: 'http' });
        assert.strictEqual(http.createServer.mock.callCount(), 1);
    });
});
