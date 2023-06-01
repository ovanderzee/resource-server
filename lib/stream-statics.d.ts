import * as http from 'http';
export declare const startServer: (inputConfig: {
    root?: string;
    port?: number;
}) => http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
