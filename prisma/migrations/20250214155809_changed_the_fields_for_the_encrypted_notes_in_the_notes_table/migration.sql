/*
  Warnings:

  - You are about to drop the column `doctorEncryptedNote` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `patientEncryptedNote` on the `Note` table. All the data in the column will be lost.
  - Added the required column `encryptedAESKeyForDoctor` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `encryptedAESKeyForPatient` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `encryptedNote` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iv` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Note" DROP COLUMN "doctorEncryptedNote",
DROP COLUMN "patientEncryptedNote",
ADD COLUMN     "encryptedAESKeyForDoctor" TEXT NOT NULL,
ADD COLUMN     "encryptedAESKeyForPatient" TEXT NOT NULL,
ADD COLUMN     "encryptedNote" TEXT NOT NULL,
ADD COLUMN     "iv" TEXT NOT NULL;
