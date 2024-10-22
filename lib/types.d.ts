import http from 'http';
import https from 'https';
import http2 from 'http2';
export type Protocol = 'http' | 'https' | 'http2';
export type WebServer = http.Server | https.Server | http2.Http2SecureServer;
export interface InputConfig {
    root?: string;
    protocol?: Protocol;
    port?: number;
}
export interface ServerConfig {
    root: string;
    protocol: Protocol;
    port: number;
}
