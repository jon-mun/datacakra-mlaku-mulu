/*
  Warnings:

  - Made the column `employeeId` on table `journeys` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "journeys" DROP CONSTRAINT "journeys_employeeId_fkey";

-- AlterTable
ALTER TABLE "journeys" ALTER COLUMN "employeeId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "journeys" ADD CONSTRAINT "journeys_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
