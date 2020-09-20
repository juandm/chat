FROM node:12-slim

EXPOSE 8000

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

USER node

CMD ["node", "src/server.js"]

