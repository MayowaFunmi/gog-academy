-- AlterTable
ALTER TABLE "academic_task_type" ADD COLUMN     "requires_attendance" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requires_mark" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requires_submissions" BOOLEAN NOT NULL DEFAULT false;
