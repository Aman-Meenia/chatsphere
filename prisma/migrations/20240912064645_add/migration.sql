/*
  Warnings:

  - You are about to drop the column `unseenMsgCount` on the `chats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "chats" DROP COLUMN "unseenMsgCount",
ADD COLUMN     "unseenMsgCount1" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "unseenMsgCount2" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "user1" INTEGER,
ADD COLUMN     "user2" INTEGER;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_user1_fkey" FOREIGN KEY ("user1") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_user2_fkey" FOREIGN KEY ("user2") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
