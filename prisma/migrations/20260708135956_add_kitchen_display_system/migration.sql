-- CreateEnum
CREATE TYPE "KitchenTicketStatus" AS ENUM ('QUEUED', 'PREPARING', 'READY', 'SERVED', 'CANCELLED');

-- CreateTable
CREATE TABLE "kitchen_tickets" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "KitchenTicketStatus" NOT NULL DEFAULT 'QUEUED',
    "assignedChefId" TEXT,
    "queuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "readyAt" TIMESTAMP(3),
    "servedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "kitchen_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kitchen_ticket_items" (
    "id" TEXT NOT NULL,
    "kitchenTicketId" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "status" "KitchenTicketStatus" NOT NULL DEFAULT 'QUEUED',
    "assignedChefId" TEXT,
    "startedAt" TIMESTAMP(3),
    "readyAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kitchen_ticket_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kitchen_tickets_orderId_key" ON "kitchen_tickets"("orderId");

-- CreateIndex
CREATE INDEX "kitchen_tickets_status_idx" ON "kitchen_tickets"("status");

-- CreateIndex
CREATE INDEX "kitchen_tickets_assignedChefId_idx" ON "kitchen_tickets"("assignedChefId");

-- CreateIndex
CREATE INDEX "kitchen_tickets_queuedAt_idx" ON "kitchen_tickets"("queuedAt");

-- CreateIndex
CREATE UNIQUE INDEX "kitchen_ticket_items_orderItemId_key" ON "kitchen_ticket_items"("orderItemId");

-- CreateIndex
CREATE INDEX "kitchen_ticket_items_kitchenTicketId_idx" ON "kitchen_ticket_items"("kitchenTicketId");

-- CreateIndex
CREATE INDEX "kitchen_ticket_items_status_idx" ON "kitchen_ticket_items"("status");

-- CreateIndex
CREATE INDEX "kitchen_ticket_items_assignedChefId_idx" ON "kitchen_ticket_items"("assignedChefId");

-- AddForeignKey
ALTER TABLE "kitchen_tickets" ADD CONSTRAINT "kitchen_tickets_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kitchen_tickets" ADD CONSTRAINT "kitchen_tickets_assignedChefId_fkey" FOREIGN KEY ("assignedChefId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kitchen_ticket_items" ADD CONSTRAINT "kitchen_ticket_items_kitchenTicketId_fkey" FOREIGN KEY ("kitchenTicketId") REFERENCES "kitchen_tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kitchen_ticket_items" ADD CONSTRAINT "kitchen_ticket_items_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kitchen_ticket_items" ADD CONSTRAINT "kitchen_ticket_items_assignedChefId_fkey" FOREIGN KEY ("assignedChefId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
