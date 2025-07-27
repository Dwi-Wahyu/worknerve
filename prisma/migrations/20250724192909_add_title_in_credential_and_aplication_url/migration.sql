/*
  Warnings:

  - Added the required column `title` to the `Credential` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "url" TEXT;

-- AlterTable
ALTER TABLE "Credential" ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;
