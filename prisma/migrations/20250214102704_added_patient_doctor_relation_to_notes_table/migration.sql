/*
  Warnings:

  - Added the required column `patientDoctorId` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "patientDoctorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_patientDoctorId_fkey" FOREIGN KEY ("patientDoctorId") REFERENCES "PatientDoctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
