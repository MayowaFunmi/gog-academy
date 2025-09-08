-- CreateTable
CREATE TABLE "public"."presentations" (
    "id" TEXT NOT NULL,
    "cohort_id" TEXT NOT NULL,
    "battalion_id" TEXT NOT NULL,
    "task_type_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "presentationDate" TIMESTAMP(3) NOT NULL,
    "submissionDeadline" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "presentations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."battalion_members" (
    "id" TEXT NOT NULL,
    "battalion_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_leader" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "battalion_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."battalions" (
    "id" TEXT NOT NULL,
    "cohort_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "battalions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."presentations" ADD CONSTRAINT "presentations_task_type_id_fkey" FOREIGN KEY ("task_type_id") REFERENCES "public"."academic_task_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."presentations" ADD CONSTRAINT "presentations_battalion_id_fkey" FOREIGN KEY ("battalion_id") REFERENCES "public"."battalions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."battalion_members" ADD CONSTRAINT "battalion_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."battalion_members" ADD CONSTRAINT "battalion_members_battalion_id_fkey" FOREIGN KEY ("battalion_id") REFERENCES "public"."battalions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
