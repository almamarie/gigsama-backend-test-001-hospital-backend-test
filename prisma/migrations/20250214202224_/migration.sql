/*
  Warnings:

  - A unique constraint covering the columns `[publicKey]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_publicKey_key" ON "users"("publicKey");
