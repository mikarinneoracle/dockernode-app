#!/bin/sh
export PORT=3000
#export USE_SESSIONS=false
export BACKEND_MONGODB_HOST=127.0.0.1:27017
nodemon server.js
