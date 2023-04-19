/*
  Warnings:

  - The primary key for the `Favorites` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Favorites` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Favorites" DROP CONSTRAINT "Favorites_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Favorites_pkey" PRIMARY KEY ("userId", "postId");
