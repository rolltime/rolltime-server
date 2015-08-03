############################################################
# Dockerfile to build the Rolltime Server application
# Based on Node and MongoDB
############################################################

FROM node:latest
FROM mongo:latest

MAINTAINER Luis Capelo <luiscape@gmail.com>

RUN apt-get update
RUN apt-get install git
RUN npm install -g nodemon
RUN git clone https://github.com/rolltime/rolltime-server
RUN npm install
RUN nodemon server.js

EXPOSE 6000
