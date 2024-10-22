import * as types from './types';
export declare const defaultConfig: types.ServerConfig;
export declare const spotPort: (port: number) => boolean;
export declare const spotProtocol: (protocol: string) => boolean;
export declare const spotRoot: (folder: string) => boolean;
export declare const checkPort: (port: number) => Promise<boolean>;
export declare const checkRoot: (root: string) => boolean;
