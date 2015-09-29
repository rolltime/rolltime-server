#!/bin/sh

#
# Creates an user in the
# MongoDB instance.
#
mongo $MONGODB_LOCATION_URL/$MONGODB_DATABASE \
  --eval "db.createUser({user: '$MONGODB_USER_NAME', pwd: '$MONGODB_USER_PASSWORD', roles: [{ role: 'readWrite', db: '$MONGODB_DATABASE' },]})"
