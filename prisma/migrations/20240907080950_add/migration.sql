/*
  Warnings:

  - You are about to drop the column `groupId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the `_groupMembers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `groups` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_groupMembers" DROP CONSTRAINT "_groupMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "_groupMembers" DROP CONSTRAINT "_groupMembers_B_fkey";

-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_admin_fkey";

-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_chatId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_groupId_fkey";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "groupId";

-- DropTable
DROP TABLE "_groupMembers";

-- DropTable
DROP TABLE "groups";
