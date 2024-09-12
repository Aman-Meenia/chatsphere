-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_lastMessage_fkey";

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_lastMessage_fkey" FOREIGN KEY ("lastMessage") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
