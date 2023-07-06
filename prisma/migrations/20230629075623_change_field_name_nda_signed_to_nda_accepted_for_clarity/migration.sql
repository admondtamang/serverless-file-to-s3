/*
  Warnings:

  - You are about to drop the column `ndaSigned` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "ndaSigned",
ADD COLUMN     "ndaAccepted" BOOLEAN NOT NULL DEFAULT false;
