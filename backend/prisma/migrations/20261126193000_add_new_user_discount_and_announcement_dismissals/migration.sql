-- AlterTable
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "new_user_discount_used_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE IF NOT EXISTS "user_announcement_dismissals" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "announcement_id" TEXT NOT NULL,
    "dismissed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_announcement_dismissals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "user_announcement_dismissals_user_id_announcement_id_key" ON "user_announcement_dismissals"("user_id", "announcement_id");
CREATE INDEX IF NOT EXISTS "user_announcement_dismissals_user_id_idx" ON "user_announcement_dismissals"("user_id");

-- AddForeignKey
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'user_announcement_dismissals_user_id_fkey'
    ) THEN
        ALTER TABLE "user_announcement_dismissals" ADD CONSTRAINT "user_announcement_dismissals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
