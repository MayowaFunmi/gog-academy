-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "public"."Title" AS ENUM ('Mr', 'Mrs', 'Miss', 'Brother', 'Sister', 'Dr', 'Prof', 'Rev', 'Pastor', 'Evangelist', 'Apostle', 'Bishop', 'Elder', 'Deacon', 'Deaconess', 'Prophet', 'Prophetess', 'Chief', 'Honorable');

-- CreateTable
CREATE TABLE "public"."roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "unique_id" TEXT NOT NULL,
    "matric_number" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile_strength" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "last_login" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_roles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_profiles" (
    "id" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" "public"."Title" NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "state_of_residence" TEXT DEFAULT '',
    "country" TEXT NOT NULL,
    "marital_status" TEXT NOT NULL,
    "salvation_status" TEXT NOT NULL,
    "salvation_story" TEXT NOT NULL,
    "gog_membership_status" BOOLEAN NOT NULL,
    "previously_applied" BOOLEAN NOT NULL DEFAULT false,
    "gog_membership_date" TEXT,
    "commitment_status" BOOLEAN NOT NULL,
    "assignment_commitment_status" BOOLEAN NOT NULL,
    "reason_for_joining" TEXT NOT NULL,
    "church_name" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "profile_picture" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "referee_name" TEXT NOT NULL,
    "referee_phone_number" TEXT NOT NULL,
    "referee_email" TEXT NOT NULL,
    "referee_relationship" TEXT NOT NULL,
    "consent_check" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."academy_cohort" (
    "id" TEXT NOT NULL,
    "cohort" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "date_started" TIMESTAMP(3) NOT NULL,
    "cohor_batch" TEXT NOT NULL,
    "date_ended" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academy_cohort_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."academic_task_type" (
    "id" TEXT NOT NULL,
    "cohort_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "requires_attendance" BOOLEAN NOT NULL DEFAULT false,
    "requires_submissions" BOOLEAN NOT NULL DEFAULT false,
    "requires_mark" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_task_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."academic_week" (
    "id" TEXT NOT NULL,
    "cohort_id" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_week_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."daily_task" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "taskTypeId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "weekId" TEXT NOT NULL,
    "task_link" TEXT,
    "task_scriptures" TEXT,
    "day_of_week" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "has_extension" BOOLEAN NOT NULL DEFAULT false,
    "activated" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."task_submission" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "week_id" TEXT NOT NULL,
    "submission" TEXT,
    "score" INTEGER,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_submitted" BOOLEAN NOT NULL DEFAULT false,
    "is_late" BOOLEAN DEFAULT false,
    "is_approved" BOOLEAN DEFAULT false,

    CONSTRAINT "task_submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."submission_screenshot" (
    "id" TEXT NOT NULL,
    "submission_id" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submission_screenshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."attendance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "attended_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "marked" BOOLEAN NOT NULL DEFAULT false,
    "isLate" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "public"."roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_unique_id_key" ON "public"."users"("unique_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_matric_number_key" ON "public"."users"("matric_number");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "public"."users"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_userId_roleId_key" ON "public"."user_roles"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "public"."user_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "academy_cohort_slug_key" ON "public"."academy_cohort"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "task_submission_user_id_task_id_key" ON "public"."task_submission"("user_id", "task_id");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_userId_key" ON "public"."attendance"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_userId_taskId_date_key" ON "public"."attendance"("userId", "taskId", "date");

-- AddForeignKey
ALTER TABLE "public"."user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."academic_task_type" ADD CONSTRAINT "academic_task_type_cohort_id_fkey" FOREIGN KEY ("cohort_id") REFERENCES "public"."academy_cohort"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."academic_week" ADD CONSTRAINT "academic_week_cohort_id_fkey" FOREIGN KEY ("cohort_id") REFERENCES "public"."academy_cohort"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."daily_task" ADD CONSTRAINT "daily_task_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "public"."academic_week"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."daily_task" ADD CONSTRAINT "daily_task_taskTypeId_fkey" FOREIGN KEY ("taskTypeId") REFERENCES "public"."academic_task_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_submission" ADD CONSTRAINT "task_submission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_submission" ADD CONSTRAINT "task_submission_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."daily_task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_submission" ADD CONSTRAINT "task_submission_week_id_fkey" FOREIGN KEY ("week_id") REFERENCES "public"."academic_week"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."submission_screenshot" ADD CONSTRAINT "submission_screenshot_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "public"."task_submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."attendance" ADD CONSTRAINT "attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."attendance" ADD CONSTRAINT "attendance_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."daily_task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
