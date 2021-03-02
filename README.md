# Renting

This project lets you manage a seasonal renting for a property.

## Demo

You can access a demo here https://house-renting.io

The credentials are:
  - email: test@test.com
  - password: test

**Remarks**:

- emails are not sent
- data are clear reguraly 

## How to use

There are two docker images:

 - backend (coded with Nodejs/GraphQL more informations here ./backend/README.md)
 - admin (coded with ReactJS more informations here ./frontend/README.md)

Here is a docker-compose.yml, modify it to your needs

```
version: "3.7"
services:
  redis:
    image: redis
    restart: always
    volumes:
      - redis-data:/data
    ports:
      - "6379:6379"

  database:
    image: postgres
    restart: always
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: rentingtest
      POSTGRES_USER: rentingtest
      POSTGRES_DB: rentingtest

  backend:
    image: renting-backend
    ports:
      - 4000:4000
    environment:
      - REDIS_URL=redis://127.0.0.1:6379
      - DATABASE_DATA=postgresql://rentingtest:rentingtest@database/rentingtest
      - BASE_DIR=/app
      - STRIPE_SK=yourStripeSK
      - SMTP_USER=yourEmailAddress
      - SMTP_PASSWORD=yourEmailPassword
      - EMAIL=yourAdminEmail
      - PASSWORD=yourAdminPassword
      - MAX_PERSONS=4
      - BRAND_NAME=yourPassword
      - RENTING_ADDRESS=yourAddress
      - LANDLORD_NAME=yourFirstAndLastName

  admin:
    image: "admin"
    ports:
      - 80:80
    volumes:
      - ./volumes/admin/default.conf:/etc/nginx/conf.d/default.conf


volumes:
  postgres-data:
  redis-data:
```

To launch the docker containers

`docker-compose up -d`

## Roadmap

This is it actually more of a work in progress, so the only roadmap are the issues for now.
If you have any idea or bugs, feel free to open an issue.

## Contributing

If you want to contribute, you can assign yourself to an issue.
