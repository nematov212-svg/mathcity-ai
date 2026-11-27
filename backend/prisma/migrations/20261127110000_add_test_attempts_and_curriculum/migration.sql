-- AlterTable
ALTER TABLE "lessons" ADD COLUMN IF NOT EXISTS "bookNumber" INTEGER;

-- AlterTable
ALTER TABLE "questions" ADD COLUMN IF NOT EXISTS "kind" TEXT NOT NULL DEFAULT 'test';
ALTER TABLE "questions" ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "lesson_progress" ADD COLUMN IF NOT EXISTS "completedSteps" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "lesson_progress" ADD COLUMN IF NOT EXISTS "bestPercent" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "lesson_progress" ADD COLUMN IF NOT EXISTS "lastPercent" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "lesson_progress" ADD COLUMN IF NOT EXISTS "percent" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "lesson_progress" ADD COLUMN IF NOT EXISTS "attempts" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "lesson_progress" ADD COLUMN IF NOT EXISTS "xpGiven" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "lesson_progress" ADD COLUMN IF NOT EXISTS "coinGiven" INTEGER NOT NULL DEFAULT 0;

-- Update existing completed progress to have bestPercent = 100
UPDATE "lesson_progress"
SET "bestPercent" = 100, "lastPercent" = 100
WHERE "isCompleted" = true OR "completedSteps" = 5;

-- CreateTable
CREATE TABLE IF NOT EXISTS "test_attempts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "questionOrder" TEXT NOT NULL,
    "optionOrder" TEXT NOT NULL,
    "correct" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 20,
    "percent" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),

    CONSTRAINT "test_attempts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'test_attempts_userId_fkey'
    ) THEN
        ALTER TABLE "test_attempts" ADD CONSTRAINT "test_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'test_attempts_lessonId_fkey'
    ) THEN
        ALTER TABLE "test_attempts" ADD CONSTRAINT "test_attempts_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
