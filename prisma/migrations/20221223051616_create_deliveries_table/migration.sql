-- CreateTable
CREATE TABLE "deliveries" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "deliveryman_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "delivered_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deliveries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_deliveryman_id_fkey" FOREIGN KEY ("deliveryman_id") REFERENCES "deliverymen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
