FROM node:15.3.0-alpine3.10 as build-stage

WORKDIR /app

ENV NODE_ENV production

COPY admin/package*.json ./
RUN npm i

COPY admin/src ./src/
COPY common ./src/common
COPY admin/public ./public/
COPY admin/tsconfig.json ./
RUN npm run build


FROM nginx:1.19.5-alpine

EXPOSE 80
COPY admin/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/build/ /usr/share/nginx/html
