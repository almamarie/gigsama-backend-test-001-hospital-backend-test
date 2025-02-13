/*
  Warnings:

  - Added the required column `encryptedPublicKey` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "encryptedPublicKey" TEXT NOT NULL;
