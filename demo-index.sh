#!/bin/bash

npm install &&
npm run build &&

echo "---------------------------"
echo "Proofs:"
echo "- Open a non-html index file"
#echo "- No error on missing favicon"
echo "---------------------------"
echo "To terminate:"
echo "node stop.js --9900"
echo "---------------------------"

node cli.js --http --./demo-index --9900 &
sleep 3 &&
open http://localhost:9900
