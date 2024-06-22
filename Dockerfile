
FROM node:18-alpine

WORKDIR /bot-service

COPY package*.json .

RUN npm install

COPY  . .

CMD ["npm", "start"]