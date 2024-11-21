#!/bin/sh

# Trap SIGTERM and SIGINT signals and forward them to end the application
trap 'kill -TERM $PID' TERM INT

# Start the application
npm start &
PID=$!
wait $PID