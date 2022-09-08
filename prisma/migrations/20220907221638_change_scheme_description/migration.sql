/*
  Warnings:

  - You are about to drop the `City` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Promotion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PromotionOnCities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Theme` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Promotion" DROP CONSTRAINT "Promotion_themeId_fkey";

-- DropForeignKey
ALTER TABLE "PromotionOnCities" DROP CONSTRAINT "PromotionOnCities_cityId_fkey";

-- DropForeignKey
ALTER TABLE "PromotionOnCities" DROP CONSTRAINT "PromotionOnCities_promotionId_fkey";

-- DropForeignKey
ALTER TABLE "PromotionOnTag" DROP CONSTRAINT "PromotionOnTag_promotionId_fkey";

-- AlterTable
ALTER TABLE "PromotionOnTag" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- DropTable
DROP TABLE "City";

-- DropTable
DROP TABLE "Promotion";

-- DropTable
DROP TABLE "PromotionOnCities";

-- DropTable
DROP TABLE "Theme";

-- CreateTable
CREATE TABLE "UserModel" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cityId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromotionModel" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "cityId" INTEGER NOT NULL,
    "themeId" INTEGER NOT NULL,
    "beginDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromotionModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CityModel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CityModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThemeModel" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ThemeModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserModel_email_key" ON "UserModel"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PromotionModel_title_key" ON "PromotionModel"("title");

-- CreateIndex
CREATE UNIQUE INDEX "CityModel_name_key" ON "CityModel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ThemeModel_title_key" ON "ThemeModel"("title");

-- AddForeignKey
ALTER TABLE "UserModel" ADD CONSTRAINT "UserModel_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "CityModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionModel" ADD CONSTRAINT "PromotionModel_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "CityModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionModel" ADD CONSTRAINT "PromotionModel_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "ThemeModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionOnTag" ADD CONSTRAINT "PromotionOnTag_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "PromotionModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
