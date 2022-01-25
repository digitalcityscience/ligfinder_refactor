FROM node:16-alpine AS build

WORKDIR /frontend
COPY . .
COPY package.json ./

RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=build /frontend/dist /usr/share/nginx/html
EXPOSE 8088
