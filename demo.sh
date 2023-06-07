#!/bin/bash

npm install &&
npm run build &&
./makeCert.sh &&
node cli.js &&
open http://localhost:9630/demo/stream-statics.html
