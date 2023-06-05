
# stream-statics
Lightweight webserver for testing and demonstrating front-end projects.

A limited set of common mime-types is used.
When you install the mime-types package next to stream-statics all known mime-types can be used.
This way the number of dependencies is limited.

## Preparation
For secure serving you need a private key and a certificate.
The following shellscript will generate these:
```sh
./makeCert.sh
```

## Usage
Start a server for instance before starting a e2e test

```json
"scripts": {
    "...": "...",
    "pretest": "stst --port 3001",
    "...": "..."
}
```

On the command line:

```sh
npx stst --root folderName --port portNumber
...
kill $(lsof -t -i:<portNumber>)
```

In a script:

```js
import { startServer } from 'stream-statics'

const config = {
    root: '.', // default folderName
    port: 9630, // default portNumber
}
const server = startServer(config)
...
const callback = () => console.log(`Connection to localhost:${config.port} was closed`)
server.close(callback)
```

## Demo
Run:
```sh
npm run demo
...
ctr+c
```
