FROM node:15.3.0-alpine3.10 as build-stage

WORKDIR /app

ENV NODE_ENV production
# ENV REACT_APP_SENTRY_DSN "https://41f168372f7e4b35a6498503e8777389@o259953.ingest.sentry.io/5610755"

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
