#!/bin/sh

set -e

if [ $1 = "start" ]; then
  until pg_isready -h database -p 5432 -U postgres
  do
    echo "Waiting for database to be up, retrying in 5 seconds"
    sleep 5
  done
  node_modules/prisma/build/index.js migrate deploy --preview-feature
  npm run start
else
  exec npm run
fi
