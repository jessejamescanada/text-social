/*
  Warnings:

  - Added the required column `email` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "email" TEXT NOT NULL;
