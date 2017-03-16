#!/bin/bash

export id=$1

echo "https://140.86.10.95/api/v2/containers/$id/kill"

curl -sk -X "POST" -H "Authorization: Bearer $1" "https://140.86.10.95/api/v2/containers/$id/kill"
