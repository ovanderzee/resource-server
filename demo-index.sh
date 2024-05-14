#!/bin/bash

npm install &&
npm run build &&
node cli.js --http --./demo-index --9900 &
sleep 3 &&
open http://localhost:9900
