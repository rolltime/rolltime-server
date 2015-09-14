#!/bin/bash

#
# Configuring the MongoDB
# database.
#
make configure

#
# Running application.
#
pm2 start server.js --no-daemon
