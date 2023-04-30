/*
  Warnings:

  - You are about to drop the column `hashId` on the `Blocks` table. All the data in the column will be lost.
  - Added the required column `hash` to the `Blocks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Blocks" DROP COLUMN "hashId",
ADD COLUMN     "hash" TEXT NOT NULL;
