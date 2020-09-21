FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV CHOKIDAR_USEPOLLING=true

CMD ["node", "src/index.js"]