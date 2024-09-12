/*
  Warnings:

  - You are about to drop the column `group_id` on the `groups` table. All the data in the column will be lost.
  - Added the required column `admin_id` to the `groups` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_group_id_fkey";

-- AlterTable
ALTER TABLE "groups" DROP COLUMN "group_id",
ADD COLUMN     "admin_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
