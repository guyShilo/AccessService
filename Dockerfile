FROM node:14.8.0-alpine
RUN npm install -g npm@latest
RUN mkdir -p /var/www/access-service
WORKDIR /var/www/access-service
ADD . /var/www/access-service
RUN npm install
CMD npm run build && npm run start:prod