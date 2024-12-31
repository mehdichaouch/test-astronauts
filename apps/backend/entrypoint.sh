#!/bin/sh
set -e

until psql "$DATABASE_URL" -c '\q'; do
  >&2 echo "PostgreSQL is unavailable - sleeping"
  sleep 3
done

exec "$@"