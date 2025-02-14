/*
  Warnings:

  - You are about to drop the column `encryptedForDoctor` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `encryptedForPatient` on the `Note` table. All the data in the column will be lost.
  - Added the required column `doctorEncryptedNote` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientEncryptedNote` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Note" DROP COLUMN "encryptedForDoctor",
DROP COLUMN "encryptedForPatient",
ADD COLUMN     "doctorEncryptedNote" TEXT NOT NULL,
ADD COLUMN     "patientEncryptedNote" TEXT NOT NULL;
