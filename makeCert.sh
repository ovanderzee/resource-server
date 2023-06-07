#!/bin/bash

echo ""
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -days 3650 -subj '/CN=localhost' -keyout .stst-key.pem -out .stst-crt.pem

# Read ignore and add *.pem when not foundPem

IGNORE=./.gitignore
foundPem=0
pemGlob="*.pem"

while read line
do
    if [ "$line" == "$pemGlob" ]
    then
        foundPem=1
    fi
done < $IGNORE

if [ "$foundPem" == "0" ]
then
    echo $pemGlob >> $IGNORE
    echo "Added $pemGlob to .gitignore"
fi

echo ""
