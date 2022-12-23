-- CreateTable
CREATE TABLE "deliverymen" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "profile_name" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deliverymen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "deliverymen_user_id_key" ON "deliverymen"("user_id");

-- AddForeignKey
ALTER TABLE "deliverymen" ADD CONSTRAINT "deliverymen_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
