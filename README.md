
# stream-statics
Lightweight webserver for testing and demonstrating front-end projects.

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
```

In a script:

```js
import { startServer } from 'stream-statics'
...
const config = {
    root: '.', // default folderName
    port: 9630, // default portNumber
}
const server = startServer(config)

const callback = () => console.log(`Connection to localhost:${config.port} was closed`)
server.close(callback)
```
