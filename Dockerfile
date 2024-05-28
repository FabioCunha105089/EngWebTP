FROM node
WORKDIR /usr/src/app
COPY package.json ./
RUN npm i
COPY . .
EXPOSE 1502
CMD [ "npm", "start" ]