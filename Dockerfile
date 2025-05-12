FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

ARG FILESERVER_DIR=/var/lib/upixel-fileserver

RUN mkdir -p $FILESERVER_DIR \
 && chmod 666 $FILESERVER_DIR

ENV NODE_ENV=production
ENV UPIXEL_FILESERVER_CONTENT_DIRECTORY=$FILESERVER_DIR

EXPOSE 1220

CMD ["node", "src/server.js"]