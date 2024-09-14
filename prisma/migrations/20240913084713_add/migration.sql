/*
  Warnings:

  - The required column `socketId` was added to the `groups` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `socketId` was added to the `requests` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "socketId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "requests" ADD COLUMN     "socketId" TEXT NOT NULL;
