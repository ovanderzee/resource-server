#!/bin/bash

npm install &&
npm run build &&
node cli.js --http --./demo --8800 &
sleep 3 &&
open http://localhost:8800/stream-statics.html
