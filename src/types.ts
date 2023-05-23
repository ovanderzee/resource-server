export class StstConfig {
    port: number
    root: string
    constructor (port: number, root: string) {
        this.port = port
        this.root = root
    }
}

export type StringOrFalse = string | false;
