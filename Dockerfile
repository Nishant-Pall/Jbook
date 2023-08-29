FROM node:18

WORKDIR /app

COPY package.json /app
COPY tsconfig.json /app
COPY tsconfig.node.json /app

RUN npm install