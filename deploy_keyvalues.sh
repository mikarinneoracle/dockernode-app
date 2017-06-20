#!/bin/bash

export APP_NAME=docker-hello-world
export API_TOKEN=4ae1ea475fd4cef6a0d30dd8430d5fa6720c92cd54cfefbca3c850c0f4f17b57
export SERVICE_MANAGER=$2

export PLACEHOLDER_KEY=rolling/null
export VALUE=-
curl -k -s -XPUT -H "Authorization: Bearer ${API_TOKEN}" -d "${VALUE}" ${SERVICE_MANAGER}/api/kv/${PLACEHOLDER_KEY}

export KEY=rolling/${APP_NAME}/stable/id
export VALUE=${PLACEHOLDER_KEY}
curl -k -s -XPUT -H "Authorization: Bearer ${API_TOKEN}" -d "${VALUE}" ${SERVICE_MANAGER}/api/kv/${KEY}

export KEY=rolling/${APP_NAME}/candidate/id
export VALUE=${PLACEHOLDER_KEY}
curl -k -s -XPUT -H "Authorization: Bearer ${API_TOKEN}" -d "${VALUE}" ${SERVICE_MANAGER}/api/kv/${KEY}

export KEY=rolling/${APP_NAME}/blendpercent
export VALUE=0
curl -k -s -XPUT -H "Authorization: Bearer ${API_TOKEN}" -d "${VALUE}" ${SERVICE_MANAGER}/api/kv/${KEY}

export KEY=rolling/${APP_NAME}/stickyness
export VALUE=0
curl -k -s -XPUT -H "Authorization: Bearer ${API_TOKEN}" -d "${VALUE}" ${SERVICE_MANAGER}/api/kv/${KEY}
