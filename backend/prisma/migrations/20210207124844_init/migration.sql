-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('SECURITY_DEPOSIT', 'CLEANING');

-- CreateEnum
CREATE TYPE "TitleRate" AS ENUM ('VERY_LOW_SEASON', 'LOW_SEASON', 'MIDDLE_SEASON', 'HIGH_SEASON');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING_CONFIRMATION', 'ACCEPTED', 'DEPOSIT_SENT', 'REMAINING_BOOKING_SENT', 'IN_RENTING', 'RENTING_FINISHED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('RESTAURANT', 'ACTIVITIES');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "price" INTEGER NOT NULL,
    "status" "ProductStatus" NOT NULL,
    "stripePriceId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeasonRate" (
    "id" SERIAL NOT NULL,
    "title" "TitleRate" NOT NULL,
    "year" INTEGER NOT NULL,
    "name" TEXT,
    "week" INTEGER NOT NULL,
    "night" INTEGER NOT NULL,
    "weekend" INTEGER NOT NULL,
    "minimumDuration" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "stripePriceIdWeekDeposit" TEXT,
    "stripePriceIdWeekendDeposit" TEXT,
    "stripePriceIdNightDeposit" TEXT,
    "stripePriceIdWeekRemaining" TEXT,
    "stripePriceIdWeekendRemaining" TEXT,
    "stripePriceIdNightRemaining" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Season" (
    "id" SERIAL NOT NULL,
    "seasonRateId" INTEGER,
    "date" TIMESTAMP(3) NOT NULL,
    "start" BOOLEAN NOT NULL DEFAULT false,
    "end" BOOLEAN NOT NULL DEFAULT false,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "line1" TEXT NOT NULL,
    "line2" TEXT,
    "postalCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "customerId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "stripeCustomer" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "paymentByCard" BOOLEAN DEFAULT true,
    "status" "BookingStatus" NOT NULL DEFAULT E'PENDING_CONFIRMATION',
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "totalPrice" INTEGER,
    "cleaning" BOOLEAN NOT NULL,
    "message" TEXT NOT NULL,
    "totalAdults" INTEGER NOT NULL,
    "totalKids" INTEGER NOT NULL,
    "stripeInvoiceDeposit" TEXT,
    "stripeInvoiceRemaining" TEXT,
    "stripeInvoiceArrival" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Amenity" (
    "id" SERIAL NOT NULL,
    "titleFr" TEXT NOT NULL,
    "descriptionFr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "titleFr" TEXT NOT NULL,
    "descriptionFr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,

    PRIMARY KEY ("id")
);


-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Product.status_unique" ON "Product"("status");

-- CreateIndex
CREATE UNIQUE INDEX "SeasonRate.name_unique" ON "SeasonRate"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Season.date_unique" ON "Season"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Address_customerId_unique" ON "Address"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer.email_unique" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer.phone_unique" ON "Customer"("phone");

-- AddForeignKey
ALTER TABLE "Season" ADD FOREIGN KEY ("seasonRateId") REFERENCES "SeasonRate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
