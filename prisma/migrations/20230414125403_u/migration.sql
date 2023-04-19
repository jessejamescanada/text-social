-- DropForeignKey
ALTER TABLE "Favorites" DROP CONSTRAINT "Favorites_postId_fkey";

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
