import detect from 'detect-port';
import fs from 'fs';
import path from 'path';
export const defaultConfig = {
    root: './',
    protocol: 'http2',
    port: 9630
};
// Distinct the port number from other values
export const spotPort = (port) => !!Number(port) && port > 0 && port < Math.pow(2, 16);
// Distinct the web protocol name from other values
export const spotProtocol = (protocol) => ['http', 'http2', 'https'].includes(protocol);
// Distinct the root folder name from other values
export const spotRoot = (folder) => ['../', './', '/'].some(start => folder.startsWith(start));
// Check availability of port
export const checkPort = async (port) => {
    const portOk = spotPort(port) &&
        await detect(port) === port;
    return portOk;
};
// Check existence of root
export const checkRoot = (root) => {
    const rootOk = spotRoot(root) &&
        fs.existsSync(path.resolve(root));
    return rootOk;
};
export const getLocalUrl = (config) => {
    const connectionType = config.protocol === 'http' ? 'http' : 'https';
    return `${connectionType}://localhost:${config.port}`;
};
