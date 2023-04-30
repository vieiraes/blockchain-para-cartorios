/*
  Warnings:

  - You are about to drop the `Block` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Block";

-- CreateTable
CREATE TABLE "Blocks" (
    "id" TEXT NOT NULL,
    "blockNumber" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hashId" TEXT NOT NULL,
    "datas" TEXT[],

    CONSTRAINT "Blocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Blocks_blockNumber_key" ON "Blocks"("blockNumber");
