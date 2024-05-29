FROM node
WORKDIR /usr/src/app
COPY ./RestAPI .
RUN npm i
EXPOSE 1502
CMD [ "npm", "start" ]