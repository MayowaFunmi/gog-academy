-- DropForeignKey
ALTER TABLE "public"."attendance" DROP CONSTRAINT "attendance_userId_fkey";

-- DropIndex
DROP INDEX "public"."attendance_userId_key";

-- DropIndex
DROP INDEX "public"."attendance_userId_taskId_date_key";

-- DropIndex
DROP INDEX "public"."task_submission_user_id_task_id_key";

-- AddForeignKey
ALTER TABLE "public"."attendance" ADD CONSTRAINT "attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
