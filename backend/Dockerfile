FROM node:15.3.0-alpine3.10

WORKDIR /app

ENV NODE_ENV production

# hadolint ignore=DL3018
RUN apk --no-cache --upgrade add \
    gcc \
    musl-dev \
    jpeg-dev \
    zlib-dev \
    libffi-dev \
    cairo-dev \
    pango-dev \
    gdk-pixbuf \
    python3-dev \
    py3-pip \
    fontconfig \
    ttf-dejavu \
    postgresql-client \
    nano

# hadolint ignore=DL3013
RUN pip3 --no-cache-dir install wheel
# hadolint ignore=DL3013
RUN pip3 --no-cache-dir install WeasyPrint

COPY ./backend/package*.json ./
RUN npm i

COPY ./backend/docker/entrypoint.sh ./
COPY ./backend/src ./src
COPY common ./src/common
COPY ./backend/emails ./emails
COPY ./backend/files ./files
COPY ./backend/prisma ./prisma
COPY ./backend/tsconfig.json ./
RUN npm run build


EXPOSE 4000
ENTRYPOINT ["./entrypoint.sh"]
CMD ["start"]
