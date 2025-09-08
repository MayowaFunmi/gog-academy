/*
  Warnings:

  - You are about to drop the column `marked` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the column `is_approved` on the `presentation_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `is_submitted` on the `presentation_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `battalion_id` on the `presentations` table. All the data in the column will be lost.
  - You are about to drop the column `is_approved` on the `task_submission` table. All the data in the column will be lost.
  - You are about to drop the column `is_submitted` on the `task_submission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[battalion_id,user_id]` on the table `battalion_members` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[presentation_id,battalion_id]` on the table `presentation_submissions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."SubmissionStatus" AS ENUM ('PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT');

-- DropForeignKey
ALTER TABLE "public"."presentation_submissions" DROP CONSTRAINT "presentation_submissions_presentation_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."presentations" DROP CONSTRAINT "presentations_battalion_id_fkey";

-- AlterTable
ALTER TABLE "public"."attendance" DROP COLUMN "marked",
ADD COLUMN     "status" "public"."AttendanceStatus" NOT NULL DEFAULT 'ABSENT';

-- AlterTable
ALTER TABLE "public"."presentation_submissions" DROP COLUMN "is_approved",
DROP COLUMN "is_submitted",
ADD COLUMN     "status" "public"."SubmissionStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "public"."presentations" DROP COLUMN "battalion_id";

-- AlterTable
ALTER TABLE "public"."task_submission" DROP COLUMN "is_approved",
DROP COLUMN "is_submitted",
ADD COLUMN     "status" "public"."SubmissionStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "public"."battalion_presentation" (
    "id" TEXT NOT NULL,
    "battalion_id" TEXT NOT NULL,
    "presentation_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "battalion_presentation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "battalion_presentation_battalion_id_presentation_id_key" ON "public"."battalion_presentation"("battalion_id", "presentation_id");

-- CreateIndex
CREATE UNIQUE INDEX "battalion_members_battalion_id_user_id_key" ON "public"."battalion_members"("battalion_id", "user_id");

-- CreateIndex
CREATE INDEX "battalions_cohort_id_idx" ON "public"."battalions"("cohort_id");

-- CreateIndex
CREATE INDEX "presentation_submissions_status_idx" ON "public"."presentation_submissions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "presentation_submissions_presentation_id_battalion_id_key" ON "public"."presentation_submissions"("presentation_id", "battalion_id");

-- CreateIndex
CREATE INDEX "presentations_cohort_id_task_type_id_is_activated_idx" ON "public"."presentations"("cohort_id", "task_type_id", "is_activated");

-- AddForeignKey
ALTER TABLE "public"."presentation_submissions" ADD CONSTRAINT "presentation_submissions_presentation_id_fkey" FOREIGN KEY ("presentation_id") REFERENCES "public"."presentations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."battalion_presentation" ADD CONSTRAINT "battalion_presentation_battalion_id_fkey" FOREIGN KEY ("battalion_id") REFERENCES "public"."battalions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."battalion_presentation" ADD CONSTRAINT "battalion_presentation_presentation_id_fkey" FOREIGN KEY ("presentation_id") REFERENCES "public"."presentations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
