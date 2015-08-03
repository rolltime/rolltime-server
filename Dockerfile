############################################################
# Dockerfile to build the Rolltime Server application
# Based on Node and MongoDB
############################################################

FROM node:latest
FROM mongo:latest

MAINTAINER Luis Capelo <luiscape@gmail.com>

# Update all repositories + install Git.
RUN apt-get update
RUN apt-get install git

# Clone app
RUN git clone https://github.com/rolltime/rolltime-server

# Install Nodemon.
RUN npm install -g nodemon

# Install app dependencies.
RUN cd rolltime-server
RUN npm install

# Start server.
RUN nodemon server.js

EXPOSE 6000
