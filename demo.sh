#!/bin/bash

npm install &&
npm run build &&
node cli.js --protocol http &
open http://localhost:9630/demo/stream-statics.html
