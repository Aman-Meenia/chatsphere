/*
  Warnings:

  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_lastMessage_fkey";

-- DropForeignKey
ALTER TABLE "_chatParticipants" DROP CONSTRAINT "_chatParticipants_A_fkey";

-- DropTable
DROP TABLE "Chat";

-- CreateTable
CREATE TABLE "chats" (
    "id" TEXT NOT NULL,
    "isGroupChat" BOOLEAN DEFAULT false,
    "lastMessage" TEXT NOT NULL,
    "unseenMsgCount" INTEGER NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_chatMessage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_chatMessage_AB_unique" ON "_chatMessage"("A", "B");

-- CreateIndex
CREATE INDEX "_chatMessage_B_index" ON "_chatMessage"("B");

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_lastMessage_fkey" FOREIGN KEY ("lastMessage") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_chatParticipants" ADD CONSTRAINT "_chatParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_chatMessage" ADD CONSTRAINT "_chatMessage_A_fkey" FOREIGN KEY ("A") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_chatMessage" ADD CONSTRAINT "_chatMessage_B_fkey" FOREIGN KEY ("B") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
