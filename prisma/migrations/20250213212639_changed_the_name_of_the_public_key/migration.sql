/*
  Warnings:

  - You are about to drop the column `encryptedPublicKey` on the `users` table. All the data in the column will be lost.
  - Added the required column `publicKey` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "encryptedPublicKey",
ADD COLUMN     "publicKey" TEXT NOT NULL;
