-- AlterTable
ALTER TABLE "requests" ADD COLUMN     "chatId" TEXT;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE SET NULL ON UPDATE CASCADE;
