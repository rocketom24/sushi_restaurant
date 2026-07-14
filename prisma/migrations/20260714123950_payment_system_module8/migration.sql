/*
  Warnings:

  - The values [MANUAL] on the enum `PaymentGateway` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentGateway_new" AS ENUM ('NONE', 'SATISPAY', 'STRIPE', 'EDENRED');
ALTER TABLE "payments" ALTER COLUMN "gateway" TYPE "PaymentGateway_new" USING ("gateway"::text::"PaymentGateway_new");
ALTER TYPE "PaymentGateway" RENAME TO "PaymentGateway_old";
ALTER TYPE "PaymentGateway_new" RENAME TO "PaymentGateway";
DROP TYPE "public"."PaymentGateway_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PaymentStatus" ADD VALUE 'PROCESSING';
ALTER TYPE "PaymentStatus" ADD VALUE 'CANCELLED';

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "failureReason" TEXT,
ADD COLUMN     "gatewayReference" TEXT,
ADD COLUMN     "refundAmount" DECIMAL(10,2),
ADD COLUMN     "refundedAt" TIMESTAMP(3);
