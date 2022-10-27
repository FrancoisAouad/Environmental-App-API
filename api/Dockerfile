FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 3000
ENV REDIS_HOST redis-env
CMD [ "npm","start"]