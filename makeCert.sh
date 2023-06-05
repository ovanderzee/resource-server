#!/bin/bash

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

echo ""
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -days 3650 -subj '/CN=localhost' -keyout $SCRIPTPATH/domain.key -out $SCRIPTPATH/domain.crt
