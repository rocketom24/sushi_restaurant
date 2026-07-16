/*
  Warnings:

  - Added the required column `userId` to the `reservations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reservations" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "reservations_userId_idx" ON "reservations"("userId");

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
