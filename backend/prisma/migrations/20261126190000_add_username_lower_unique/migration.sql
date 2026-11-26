-- AlterTable
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "username_lower" TEXT;

-- Update existing rows to populate username_lower
UPDATE "users" SET "username_lower" = LOWER("username") WHERE "username" IS NOT NULL AND "username_lower" IS NULL;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "users_username_lower_key" ON "users"("username_lower");
