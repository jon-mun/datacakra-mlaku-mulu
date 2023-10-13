-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ROOT', 'EMPLOYEE', 'TOURIST');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'TOURIST';
