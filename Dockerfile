############################################################
# Dockerfile to build the Rolltime Server application
# Based on Node and MongoDB
############################################################

FROM node:latest
FROM mongo:latest

MAINTAINER Luis Capelo <luiscape@gmail.com>

# Update all repositories
RUN apt-get update

# Clone app
RUN git clone https://github.com/rolltime/rolltime-server

# Install Nodemon and other dependencies.
RUN npm install -g nodemon
RUN npm install

# Start server.
RUN nodemon server.js

EXPOSE 6000
