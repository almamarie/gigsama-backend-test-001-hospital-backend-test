/*
  Warnings:

  - You are about to drop the column `encryptedNote` on the `Note` table. All the data in the column will be lost.
  - Added the required column `encryptedForDoctor` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `encryptedForPatient` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Note" DROP COLUMN "encryptedNote",
ADD COLUMN     "encryptedForDoctor" TEXT NOT NULL,
ADD COLUMN     "encryptedForPatient" TEXT NOT NULL;
