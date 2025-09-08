/*
  Warnings:

  - You are about to drop the column `presentationDate` on the `presentations` table. All the data in the column will be lost.
  - You are about to drop the column `submissionDeadline` on the `presentations` table. All the data in the column will be lost.
  - Added the required column `presentation_date` to the `presentations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."presentations" DROP COLUMN "presentationDate",
DROP COLUMN "submissionDeadline",
ADD COLUMN     "presentation_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "submission_deadline" TIMESTAMP(3);
