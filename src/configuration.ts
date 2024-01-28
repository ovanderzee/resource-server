import detect from 'detect-port'
import * as types from './types';
import fs from 'fs';
import path from 'path';

export const defaultConfig: types.ServerConfig = {
    root: './',
    protocol: 'http2',
    port: 9630
}

// Distinct the port number from other values
export const spotPort = (port: number): boolean => !!Number(port) && port > 0 && port < Math.pow(2,16)

// Distinct the web protocol name from other values
export const spotProtocol = (protocol: string): boolean => ['http', 'http2', 'https'].includes(protocol)

// Distinct the root folder name from other values
export const spotRoot = (folder: string): boolean => ['../', './', '/'].some(start => folder.startsWith(start))

// Check availability of port
export const checkPort = async (port: number): Promise<boolean> => {
    const portOk =
        spotPort(port) &&
        await detect(port) === port
    return portOk
}

// Check existence of root
export const checkRoot = (root: string): boolean => {
    const rootOk =
        spotRoot(root) &&
        fs.existsSync(path.resolve(root))
    return rootOk
}
