FROM node:18-alpine

WORKDIR /app

EXPOSE 3000

COPY package.json ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY vite.config.ts ./
COPY . ./

RUN npm install

