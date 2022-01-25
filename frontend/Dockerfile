FROM node:14 AS build
WORKDIR /frontend
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build


CMD ["npm", "run", "serve"]
