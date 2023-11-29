FROM node:18

WORKDIR /usr/src/index

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]