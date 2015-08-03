############################################################
# Dockerfile to build the Rolltime Server application
# Based on Node
############################################################

FROM node:latest

MAINTAINER Luis Capelo <luiscape@gmail.com>

RUN apt-get update
RUN apt-get install git
RUN git clone https://github.com/rolltime/rolltime-server

EXPOSE 6000
