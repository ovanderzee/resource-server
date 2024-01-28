import assert from 'node:assert';
import { describe, it } from 'node:test';
import { defaultConfig, spotPort, spotProtocol, spotRoot } from '../configuration.js';
describe('spotPortNumber', () => {
    it('should accept a port number greater than zero and smaller than 2^16', () => {
        const value = 8080;
        const spot = spotPort(value);
        assert(spot, `${value} should be approved`);
    });
    it('should convert a string represantation of an approved number', () => {
        const value = '8080';
        const spot = spotPort(value);
        assert(spot, `"${value}" should be approved`);
    });
    it('should reject a port number smaller than zero', () => {
        const value = 0;
        const spot = spotPort(value);
        assert(!spot, `${value} should be to disapproved`);
    });
    it('should reject a port number greater than or equal to 2^16', () => {
        const value = 65536;
        const spot = spotPort(value);
        assert(!spot, `${value} should be to disapproved`);
    });
    it('should anything except numbers', () => {
        const value = 'hundred';
        const spot = spotPort(value);
        assert(!spot, `${value} should be to disapproved`);
    });
});
describe('spotWebProtocol', () => {
    it('should accept the http protocol name', () => {
        const value = 'http';
        const spot = spotProtocol(value);
        assert(spot, `${value} should be approved`);
    });
    it('should accept the https protocol name', () => {
        const value = 'https';
        const spot = spotProtocol(value);
        assert(spot, `${value} should be approved`);
    });
    it('should accept the http2 protocol name', () => {
        const value = 'http2';
        const spot = spotProtocol(value);
        assert(spot, `${value} should be approved`);
    });
    it('should reject an unknown protocol name', () => {
        const value = 'hallo';
        const spot = spotProtocol(value);
        assert(!spot, `${value} should be to disapproved`);
    });
});
describe('spotRootFolder', () => {
    it('should accept a root folder name starting with up dots', () => {
        const value = '../../higher/level';
        const spot = spotRoot(value);
        assert(spot, `${value} should be approved`);
    });
    it('should accept a root folder name starting with a here dot', () => {
        const value = './this/level';
        const spot = spotRoot(value);
        assert(spot, `${value} should be approved`);
    });
    it('should accept a root folder name starting with a slash', () => {
        const value = '/disk/root';
        const spot = spotRoot(value);
        assert(spot, `${value} should be approved`);
    });
    it('should reject an unprefixed path', () => {
        const value = 'unprefixed/path';
        const spot = spotRoot(value);
        assert(!spot, `${value} should be to disapproved`);
    });
});
describe('defaultConfig', () => {
    it('should be valid', () => {
        const port = spotPort(defaultConfig.port);
        const protocol = spotProtocol(defaultConfig.protocol);
        const root = spotRoot(defaultConfig.root);
        assert(port && protocol && root, `${JSON.stringify(defaultConfig)} should be approved`);
    });
});
