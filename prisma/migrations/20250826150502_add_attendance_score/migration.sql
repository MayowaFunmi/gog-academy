/*
  Warnings:

  - Added the required column `score` to the `attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."attendance" ADD COLUMN     "score" INTEGER NOT NULL;
