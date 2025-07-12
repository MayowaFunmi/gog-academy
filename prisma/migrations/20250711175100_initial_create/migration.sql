-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "Title" AS ENUM ('Mr', 'Mrs', 'Miss', 'Brother', 'Sister', 'Dr', 'Prof', 'Rev', 'Pastor', 'Evangelist', 'Apostle', 'Bishop', 'Elder', 'Deacon', 'Deaconess', 'Prophet', 'Prophetess', 'Chief', 'Honorable');

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "unique_id" TEXT NOT NULL,
    "matric_number" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "last_login" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" "Title" NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "state_of_residence" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "marital_status" TEXT NOT NULL,
    "salvation_status" TEXT NOT NULL,
    "salvation_story" TEXT NOT NULL,
    "gog_membership_status" BOOLEAN NOT NULL,
    "gog_membership_date" TIMESTAMP(3),
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
CREATE TABLE "academy_cohort" (
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
CREATE TABLE "academic_task_type" (
    "id" TEXT NOT NULL,
    "cohort_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_task_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_week" (
    "id" TEXT NOT NULL,
    "cohort_id" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "currentWeek" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_week_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_task" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "taskTypeId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "weekId" TEXT NOT NULL,
    "start_day" TIMESTAMP(3) NOT NULL,
    "end_day" TIMESTAMP(3) NOT NULL,
    "activated" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_unique_id_key" ON "users"("unique_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_matric_number_key" ON "users"("matric_number");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_userId_roleId_key" ON "user_roles"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "user_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "academy_cohort_slug_key" ON "academy_cohort"("slug");

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_task_type" ADD CONSTRAINT "academic_task_type_cohort_id_fkey" FOREIGN KEY ("cohort_id") REFERENCES "academy_cohort"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_week" ADD CONSTRAINT "academic_week_cohort_id_fkey" FOREIGN KEY ("cohort_id") REFERENCES "academy_cohort"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_task" ADD CONSTRAINT "daily_task_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "academic_week"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_task" ADD CONSTRAINT "daily_task_taskTypeId_fkey" FOREIGN KEY ("taskTypeId") REFERENCES "academic_task_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
