/*
  Warnings:

  - Made the column `fullName` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- Backfill existing NULL values before making the column required
UPDATE "User" SET "fullName" = '' WHERE "fullName" IS NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "fullName" SET DEFAULT '', ALTER COLUMN "fullName" SET NOT NULL;
