-- AlterTable
ALTER TABLE "user_profiles" ADD COLUMN     "previously_applied" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "state_of_residence" DROP NOT NULL,
ALTER COLUMN "state_of_residence" SET DEFAULT '',
ALTER COLUMN "gog_membership_date" SET DATA TYPE TEXT;
