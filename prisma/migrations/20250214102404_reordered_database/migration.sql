/*
  Warnings:

  - You are about to drop the column `actionId` on the `PatientDoctor` table. All the data in the column will be lost.
  - The primary key for the `Reminders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `actionId` on the `Reminders` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Reminders` table. All the data in the column will be lost.
  - You are about to drop the `Actions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `duration` to the `Reminders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frequency` to the `Reminders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noteId` to the `Reminders` table without a default value. This is not possible if the table is not empty.
  - The required column `reminderId` was added to the `Reminders` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `task` to the `Reminders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PatientDoctor" DROP CONSTRAINT "PatientDoctor_actionId_fkey";

-- DropForeignKey
ALTER TABLE "Reminders" DROP CONSTRAINT "Reminders_actionId_fkey";

-- DropIndex
DROP INDEX "PatientDoctor_actionId_key";

-- DropIndex
DROP INDEX "Reminders_actionId_key";

-- AlterTable
ALTER TABLE "PatientDoctor" DROP COLUMN "actionId";

-- AlterTable
ALTER TABLE "Reminders" DROP CONSTRAINT "Reminders_pkey",
DROP COLUMN "actionId",
DROP COLUMN "id",
ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "frequency" TEXT NOT NULL,
ADD COLUMN     "noteId" TEXT NOT NULL,
ADD COLUMN     "reminderId" TEXT NOT NULL,
ADD COLUMN     "task" TEXT NOT NULL,
ADD CONSTRAINT "Reminders_pkey" PRIMARY KEY ("reminderId");

-- DropTable
DROP TABLE "Actions";

-- CreateTable
CREATE TABLE "Notes" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "encryptedNote" TEXT NOT NULL,
    "checklist" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reminders" ADD CONSTRAINT "Reminders_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Notes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
