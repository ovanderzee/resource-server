#!/bin/bash

npm install &&
npm run build &&

echo "---------------------------"
echo "Proofs happy flow"
echo "---------------------------"
echo "To terminate:"
echo "node stop.js --8800"
echo "---------------------------"

node cli.js --http --./demo --8800 &
sleep 3 &&
open http://localhost:8800/stream-statics.html
