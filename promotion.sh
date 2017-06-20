#!/bin/sh
export APP_NAME=docker-hello-world
export API_TOKEN=9c8b751dae821b0ff2f7f95ebd55dc13740dbac2936b9e4c2d8638814d51b8ff
export SERVICE_MANAGER=https://140.86.10.183
export BLEND_PCT=0

[ -z "$API_TOKEN" ] && { echo "API_TOKEN must be set"; exit 1; }
[ -z "$SERVICE_MANAGER" ] && { echo "SERVICE_MANAGER must be set"; exit 1; }
[ -z "$APP_NAME" ] && { echo "APP_NAME must be set"; exit 1; }

export KEY=rolling/${APP_NAME}/stable/id
export ID_TO_REPLACE=$(curl -k -s -XGET -H "Authorization: Bearer ${API_TOKEN}" ${SERVICE_MANAGER}/api/kv/${KEY}?raw=true)

export KEY=rolling/${APP_NAME}/candidate/id
export ID_TO_PROMOTE=$(curl -k -s -XGET -H "Authorization: Bearer ${API_TOKEN}" ${SERVICE_MANAGER}/api/kv/${KEY}?raw=true)

echo "Replacing stable: ${ID_TO_REPLACE}"
echo "Promoting candidate: ${ID_TO_PROMOTE}"

export KEY=rolling/${APP_NAME}/stable/id
export VALUE=$ID_TO_PROMOTE
curl -k -s -XPUT -o /dev/null -H "Authorization: Bearer ${API_TOKEN}" -d "${VALUE}" ${SERVICE_MANAGER}/api/kv/${KEY}

export KEY=rolling/${APP_NAME}/blendpercent
export VALUE=$BLEND_PCT
curl -k -s -XPUT -o /dev/null -H "Authorization: Bearer ${API_TOKEN}" -d "${VALUE}" ${SERVICE_MANAGER}/api/kv/${KEY}

export KEY=rolling/${APP_NAME}/candidate/id
export VALUE=rolling/null
curl -k -s -XPUT -o /dev/null -H "Authorization: Bearer ${API_TOKEN}" -d "${VALUE}" ${SERVICE_MANAGER}/api/kv/${KEY}
