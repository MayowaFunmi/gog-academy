-- AddForeignKey
ALTER TABLE "task_submission" ADD CONSTRAINT "task_submission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
