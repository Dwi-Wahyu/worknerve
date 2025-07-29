-- AlterTable
ALTER TABLE "User" ADD COLUMN     "credentials_pin" TEXT,
ADD COLUMN     "lock_credentials" BOOLEAN NOT NULL DEFAULT false;
