-- AlterTable
ALTER TABLE "public"."presentations" ADD COLUMN     "is_activated" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."presentation_submissions" (
    "id" TEXT NOT NULL,
    "presentation_id" TEXT NOT NULL,
    "battalion_id" TEXT NOT NULL,
    "is_submitted" BOOLEAN NOT NULL DEFAULT false,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "score" INTEGER NOT NULL DEFAULT 0,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "presentation_submissions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."presentation_submissions" ADD CONSTRAINT "presentation_submissions_presentation_id_fkey" FOREIGN KEY ("presentation_id") REFERENCES "public"."presentations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
