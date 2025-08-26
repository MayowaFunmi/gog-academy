/*
  Warnings:

  - You are about to drop the column `is_submitted` on the `daily_task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."daily_task" DROP COLUMN "is_submitted";

-- AlterTable
ALTER TABLE "public"."task_submission" ADD COLUMN     "is_submitted" BOOLEAN NOT NULL DEFAULT false;
