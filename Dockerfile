FROM node:13

WORKDIR /tohr
RUN mkdir ./dist-back
RUN mkdir ./dist-front
COPY ./dist-back ./dist-back
COPY ./dist-front ./dist-front

CMD [ "node", "./dist-back/server.js" ]


