FROM node:18

WORKDIR /user/src/app

COPY ./package.json ./

RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["nmp", "run", "start:prod"]