-- DropForeignKey
ALTER TABLE "requests" DROP CONSTRAINT "requests_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "requests" DROP CONSTRAINT "requests_senderId_fkey";

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
