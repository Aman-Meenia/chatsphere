-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_lastMessage_fkey";

-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_chat_id_fkey";

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_lastMessage_fkey" FOREIGN KEY ("lastMessage") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE SET NULL ON UPDATE CASCADE;
