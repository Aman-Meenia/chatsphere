/*
  Warnings:

  - Added the required column `chat_id` to the `groups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "chat_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "groupId" TEXT;

-- CreateTable
CREATE TABLE "_groupMembers" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_groupMembers_AB_unique" ON "_groupMembers"("A", "B");

-- CreateIndex
CREATE INDEX "_groupMembers_B_index" ON "_groupMembers"("B");

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_groupMembers" ADD CONSTRAINT "_groupMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_groupMembers" ADD CONSTRAINT "_groupMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
