FROM node:16-alpine AS build

WORKDIR /frontend

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

#RUN apk add --update openssl
#RUN mkdir -p "/etc/ssl/private/openssl" && \
#  openssl req -x509 -nodes -days 365 -subj "/CN=localhost" -newkey rsa:2048 -keyout /etc/ssl/private/ligfinder-nginx-selfsigned.key -out /etc/ssl/certs/ligfinder-nginx-selfsigned.crt

COPY nginx/ligfinder.nginx.conf /etc/nginx/conf.d/default.conf


COPY --from=build /frontend/dist /usr/share/nginx/html
EXPOSE 80 443
