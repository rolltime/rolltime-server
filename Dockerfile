############################################################
# Dockerfile to build the Rolltime Server application
# Based on Node and MongoDB
############################################################

FROM ubuntu:trusty

MAINTAINER Luis Capelo <luiscape@gmail.com>

RUN \
  apt-get update && \
  apt-get install -y git && \
  apt-get install -y nodejs && \
  apt-get install -y npm && \
  apt-get install -y nodejs-legacy && \
  npm install -g nodemon


# Clone app and install dependencies.
RUN git clone https://github.com/rolltime/rolltime-server
RUN cd rolltime-server
RUN npm install

# Start server.
RUN nodemon server.js

EXPOSE 6000
