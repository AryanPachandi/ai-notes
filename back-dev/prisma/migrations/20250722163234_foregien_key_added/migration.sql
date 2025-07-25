/*
  Warnings:

  - Added the required column `userID` to the `notes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notes" ADD COLUMN     "userID" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_userID_fkey" FOREIGN KEY ("userID") REFERENCES "userINFO"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
