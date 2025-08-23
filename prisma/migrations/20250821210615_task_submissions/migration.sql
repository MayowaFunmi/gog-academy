-- CreateTable
CREATE TABLE "task_submission" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "week_id" TEXT NOT NULL,
    "submission" TEXT,
    "score" INTEGER,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_late" BOOLEAN DEFAULT false,
    "is_approved" BOOLEAN DEFAULT false,

    CONSTRAINT "task_submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission_screenshot" (
    "id" TEXT NOT NULL,
    "submission_id" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submission_screenshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "task_submission_user_id_task_id_key" ON "task_submission"("user_id", "task_id");

-- CreateIndex
CREATE UNIQUE INDEX "submission_screenshot_submission_id_key" ON "submission_screenshot"("submission_id");

-- AddForeignKey
ALTER TABLE "task_submission" ADD CONSTRAINT "task_submission_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "daily_task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_submission" ADD CONSTRAINT "task_submission_week_id_fkey" FOREIGN KEY ("week_id") REFERENCES "academic_week"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_screenshot" ADD CONSTRAINT "submission_screenshot_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "task_submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
