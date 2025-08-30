/*
  Warnings:

  - Made the column `score` on table `task_submission` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."task_submission" ALTER COLUMN "score" SET NOT NULL;
