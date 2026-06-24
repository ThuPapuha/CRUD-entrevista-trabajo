#!/bin/bash
set -e

if [ -z "$DB_HOST" ] && [ -z "$RDS_HOSTNAME" ]; then
  echo "Skipping database migration: no database host configured."
  exit 0
fi

npm run migrate
