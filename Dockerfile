############################################################
# Dockerfile to build the Rolltime Server application
# Based on Node. Receives links from a MongoDB container.
############################################################

FROM node:0.12.7

MAINTAINER Luis Capelo <luiscape@gmail.com>

# Clone app and install dependencies.
RUN \
  npm install -g pm2 && \
  git clone https://github.com/rolltime/rolltime-server && \
  cd rolltime-server && \
  npm install

EXPOSE 6000
CMD ["pm2", "start", "'/rolltime-server/server.js"]
