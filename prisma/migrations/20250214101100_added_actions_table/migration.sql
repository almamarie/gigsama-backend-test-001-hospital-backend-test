/*
  Warnings:

  - You are about to drop the column `planId` on the `PatientDoctor` table. All the data in the column will be lost.
  - You are about to drop the `Plan` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[actionId]` on the table `PatientDoctor` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "PatientDoctor" DROP CONSTRAINT "PatientDoctor_planId_fkey";

-- DropIndex
DROP INDEX "PatientDoctor_planId_key";

-- AlterTable
ALTER TABLE "PatientDoctor" DROP COLUMN "planId",
ADD COLUMN     "actionId" TEXT;

-- DropTable
DROP TABLE "Plan";

-- CreateTable
CREATE TABLE "Actions" (
    "actionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "checkList" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "patientDoctorId" TEXT NOT NULL,

    CONSTRAINT "Actions_pkey" PRIMARY KEY ("actionId")
);

-- CreateTable
CREATE TABLE "Reminders" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "actionId" TEXT,

    CONSTRAINT "Reminders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Actions_patientDoctorId_key" ON "Actions"("patientDoctorId");

-- CreateIndex
CREATE UNIQUE INDEX "Reminders_actionId_key" ON "Reminders"("actionId");

-- CreateIndex
CREATE UNIQUE INDEX "PatientDoctor_actionId_key" ON "PatientDoctor"("actionId");

-- AddForeignKey
ALTER TABLE "PatientDoctor" ADD CONSTRAINT "PatientDoctor_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Actions"("actionId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminders" ADD CONSTRAINT "Reminders_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Actions"("actionId") ON DELETE SET NULL ON UPDATE CASCADE;
