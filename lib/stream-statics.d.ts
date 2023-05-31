import * as http from 'http';
import { StstConfig } from './types';
export declare const defaultConfig: StstConfig;
export declare const startServer: (inputConfig: StstConfig) => http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
