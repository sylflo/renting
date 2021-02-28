# Backend

## Technologies used

The backend is a GraphQL api built with NodeJs and the main following tools:

  - Apollo server (https://github.com/apollographql/apollo-server)
  - Prisma (https://github.com/prisma/prisma)
  - Graphql Nexus (https://github.com/graphql-nexus/nexus)
  - Graphql Shield (https://github.com/maticzav/graphql-shield)
  - Bull (https://github.com/OptimalBits/bull)
  - Stripe (https://github.com/stripe/stripe-node)

## Architecture

The project is organized like this:

    .
    ├── dist                    # Compiled files
    ├── docker                  # Files use to build the Docker image
    ├── emails                  # The emails templates send to the customers
    ├── files                   # The emails templates send to the customers
    ├── locales                 # i18n translations in French and English
    ├── prisma                  # Migrations and database schemas
    ├── src                     # The source files
    ├── LICENSE
    └── README.md


## Migrations

If the file `./prisma/schema.prisma` is modified, you will need to work with migrations.

In development, use this command, `prisma migrate dev --preview-feature`. This will generate the migrations file
and apply them.

In production, you will need to have the migrations already created and use `prisma migrate deploy --preview-feature`

For more informations see Prisma documentation https://www.prisma.io/docs/concepts/components/prisma-migrate


## Launch the project

Before launching the project you will need to have

- a redis
- a PostgreSQL

you can use this docker-compose

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
```

You also need env variable or an env file, here is an example

```
cat .env.development                                                                                         01:27:06
BASE_DIR=/yourPath/renting/backend
BRAND_NAME="YourBrandName"
RENTING_ADDRESS="yourRentingAddress"
LANDLORD_NAME="yourFirstAndLastName"
STRIPE_SK=YourStripeSK 
DATABASE_DATA="postgresql://renting:renting@0.0.0.0/renting
CAUTION=yourCautionPrice
CLEANING=yourCleaningPrice
SMTP_USER=yourEmail
SMTP_PASSWORD=YourEmailPassword
MAX_PERSONS=4
APP_SECRET="my-secret" # use for jwt access token
```

To run the backend, launch those commands:

```
npm run generate # Generate Prisma database and Nexus
npm run migrate # Apply the migrations
npm run seed # it will seed the database
npm run dev # Launch the server
```

**Remark** If you want to clean and reset the database, you can do `npx prisma migrate reset --force --preview-feature`

Once the sever is available you should see something like this

```
🚀 Server ready at: http://localhost:4000
⭐️ See sample queries: http://pris.ly/e/ts/graphql-apollo-server#using-the-graphql-api
```

## Run the unit tests

To launch all the unit test, simply use this command `npm run test`

You can launch a test for a single folder like so `npm run test customers`

If you want to target a specific file use `npm run test bookings/test_yup_schemas`

## Build the project

Simply run `npm run build`

## Build the Docker image

The docker image is build and push on the ci.

To build the docker image, you need to be at the top folder of the project, and then do
```
docker build -f backend/Dockerfile -t renting-backend . 
```

## CLI

There is a few commands you can use:

  - creates an admin: `node ./dist/commands/admin.js "test@test.fr" "test" "test"`
  - creates cleaning and security product: `node ./dist/commands/products.js`
  - creates seasons and rates `node ./dist/commands/2021_rate.js`
  - creates bookings `node ./dist/commands/booking.js jsonFile`
