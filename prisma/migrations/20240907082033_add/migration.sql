-- CreateTable
CREATE TABLE "groups" (
    "id" TEXT NOT NULL,
    "group_id" INTEGER NOT NULL,
    "groupName" TEXT NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
