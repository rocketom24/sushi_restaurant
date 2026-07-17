-- CreateEnum
CREATE TYPE "HeroSlideKind" AS ENUM ('OFFER', 'FEATURED');

-- CreateEnum
CREATE TYPE "HeroSlideLayout" AS ENUM ('IMAGE_RIGHT', 'IMAGE_LEFT', 'FULL_BLEED', 'MULTI_IMAGE');

-- CreateTable
CREATE TABLE "hero_slides" (
    "id" TEXT NOT NULL,
    "kind" "HeroSlideKind" NOT NULL,
    "layout" "HeroSlideLayout" NOT NULL DEFAULT 'IMAGE_RIGHT',
    "badgeText" TEXT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "imageUrl" TEXT,
    "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "price" DECIMAL(10,2),
    "discountLabel" TEXT,
    "couponCode" TEXT,
    "ctaLabel" TEXT,
    "ctaHref" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_slides_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "hero_slides_isActive_sortOrder_idx" ON "hero_slides"("isActive", "sortOrder");
