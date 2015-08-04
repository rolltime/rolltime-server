############################################################
# Dockerfile to build the Rolltime Server application
# Based on Node. Links to a MongoDB container.
############################################################

FROM node:0.12.7

MAINTAINER Luis Capelo <luiscape@gmail.com>

# Clone app and install dependencies.
RUN \
  npm install -g nodemon && \
  git clone https://github.com/rolltime/rolltime-server && \
  cd rolltime-server && \
  npm install

EXPOSE 6000
# CMD ["nodemon", "/rolltime-server/server.js"]
