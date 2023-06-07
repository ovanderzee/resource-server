import * as http from 'http';
import * as http2 from 'http2';
export declare const startServer: (inputConfig: {
    root?: string;
    protocol?: 'http' | 'https' | 'http2';
    port?: number;
}) => http.Server | http2.Http2Server;
