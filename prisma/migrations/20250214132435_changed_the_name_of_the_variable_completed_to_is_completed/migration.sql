/*
  Warnings:

  - You are about to drop the column `completed` on the `Reminder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "completed",
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false;
