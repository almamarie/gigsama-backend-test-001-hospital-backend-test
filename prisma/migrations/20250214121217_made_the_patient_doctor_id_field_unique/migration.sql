/*
  Warnings:

  - You are about to drop the column `task` on the `Reminder` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[patientDoctorId]` on the table `Note` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `message` to the `Reminder` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `frequency` on the `Reminder` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ReminderFrequency" AS ENUM ('ONCE_DAILY', 'TWICE_DAILY', 'THREE_TIMES_DAILY', 'FOUR_TIMES_DAILY');

-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "task",
ADD COLUMN     "message" TEXT NOT NULL,
DROP COLUMN "frequency",
ADD COLUMN     "frequency" "ReminderFrequency" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Note_patientDoctorId_key" ON "Note"("patientDoctorId");
