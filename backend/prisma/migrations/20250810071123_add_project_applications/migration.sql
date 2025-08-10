/*
  Warnings:

  - Added the required column `budget` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ProjectStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."ApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

-- DropForeignKey
ALTER TABLE "public"."Project" DROP CONSTRAINT "Project_freelancerId_fkey";

-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "budget" TEXT DEFAULT '1000000000000000000',
ADD COLUMN     "description" TEXT DEFAULT 'Project description',
ADD COLUMN     "skills" TEXT[],
ADD COLUMN     "status" "public"."ProjectStatus" NOT NULL DEFAULT 'OPEN',
ADD COLUMN     "title" TEXT DEFAULT 'Project Title',
ALTER COLUMN "freelancerId" DROP NOT NULL;

-- Update existing records with proper values
UPDATE "public"."Project" SET 
    "title" = CONCAT('Project #', "id"),
    "description" = CONCAT('Description for project #', "id"),
    "budget" = "budget"
WHERE "title" = 'Project Title';

-- CreateTable
CREATE TABLE "public"."ProjectApplication" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "freelancerId" INTEGER NOT NULL,
    "proposal" TEXT NOT NULL,
    "bid_amount" TEXT NOT NULL,
    "status" "public"."ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectApplication_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectApplication" ADD CONSTRAINT "ProjectApplication_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectApplication" ADD CONSTRAINT "ProjectApplication_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
