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
