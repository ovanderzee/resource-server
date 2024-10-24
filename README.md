
# stream-statics
Lightweight webserver for testing and demonstrating front-end projects,
running HTTP, HTTPS or HTTP/2.
A command to terminate the server is included.

## Mime types
A limited set of common mime-types is used.
When you install the mime-types package next to stream-statics all known mime-types can be used.
This way the number of dependencies is limited.

## Configuration
Before setting up a new server, a few checks are made.
When the port number is in use or when the root folder can't be found, the startServer function will error.

## Secure serving
On first secure run, or when the certificate has expired,
a private key and a certificate are generated inside the module folder

## Usage

Default configuration:

```
root: './',
protocol: 'http2', // 'http' | 'https' | 'http2'
port: 9630,
```

Start a server for instance before starting a e2e test

```json
"scripts": {
    "...": "...",
    "pretest": "stst --port 3001 --protocol http",
    "...": "..."
    "posttest": "ststop --port 3001",
    "...": "..."
}
```

On the command line, with short argument syntax:

```sh
npx stst --https --4210 --../../yourProject
...
npx ststop --4210
```

In a script:

```js
import { startServer } from 'stream-statics'

const config = {
    root: './', // default folderName
    protocol: 'http2', // default protocol
    port: 9630, // default portNumber
}
const server = await startServer(config) // argument is required for now.
...
const callback = () => console.log(`Connection to localhost:${config.port} was closed`)
server.close(callback)
```

## Browsers and Protocols

The browser can display various intermediate notification pages.
Protocol problems can display the following message, or similar:

### The connection was reset
You are browsing a https served page with a http url.

### Secure Connection Failed
You are browsing a http served page with a https url.

### Warning: Potential Security Risk Ahead
You are serving https or http2 which is using the internal self-signed certificate.
On the internet that poses a security threat.
To test your secure serving needs, click the appropriate buttons to continue for advanced users.


## Demo
Happy flow:
```sh
./demo.sh
```
Support for serving non-html index files,
Circumventing errors for missing favicon.ico,
Serving with a secure protocol using a self-signed certificate:
```sh
./demo-alt.sh
```
