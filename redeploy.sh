#!/bin/bash

if [ "$1" == "y" ]
then
	curl -X "POST" -k "https://140.86.10.95/api/v2/deployments/nodejs-sticky-20170220-143459/webhook/restart?token=$1"
else
	curl -sk -X "GET" -H "Authorization: Bearer $1" "https://140.86.10.95/api/v2/deployments/nodejs-sticky-20170220-143459/containers/"
fi
