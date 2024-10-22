#!/bin/bash

npm install &&
npm run build &&

echo "---------------------------"
echo "Proofs:"
echo "- Open a non-html index file"
echo "- No error on missing favicon"
echo "- Use https protocol"
echo "---------------------------"
echo "To terminate:"
echo "node stop.js --9900"
echo "---------------------------"

node cli.js --https --./demo-alt --9900 &
sleep 3 &&
open https://localhost:9900
