#!/bin/bash
echo "Starting the application..."
export AWS_PROFILE=claude
python ./server/service.py &
npm run --prefix client dev &
wait
