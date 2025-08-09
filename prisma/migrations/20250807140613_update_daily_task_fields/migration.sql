/*
  Warnings:

  - You are about to drop the column `end_day` on the `daily_task` table. All the data in the column will be lost.
  - You are about to drop the column `start_day` on the `daily_task` table. All the data in the column will be lost.
  - Added the required column `day_of_week` to the `daily_task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_time` to the `daily_task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `daily_task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "daily_task" DROP COLUMN "end_day",
DROP COLUMN "start_day",
ADD COLUMN     "day_of_week" INTEGER NOT NULL,
ADD COLUMN     "end_time" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "has_extension" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "start_time" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "activated" SET DEFAULT false;
