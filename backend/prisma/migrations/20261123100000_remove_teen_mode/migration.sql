-- Ensure all existing records have mode set to 'KIDS'
UPDATE "student_profiles" SET "mode" = 'KIDS' WHERE "mode"::text = 'TEEN';
UPDATE "courses" SET "mode" = 'KIDS' WHERE "mode"::text = 'TEEN';
UPDATE "building_definitions" SET "mode" = 'KIDS' WHERE "mode"::text = 'TEEN';
UPDATE "game_definitions" SET "mode" = 'KIDS' WHERE "mode"::text = 'TEEN';

-- Recreate Mode enum with only KIDS
ALTER TYPE "Mode" RENAME TO "Mode_old";
CREATE TYPE "Mode" AS ENUM ('KIDS');

ALTER TABLE "student_profiles" ALTER COLUMN "mode" TYPE "Mode" USING ("mode"::text::"Mode");
ALTER TABLE "courses" ALTER COLUMN "mode" TYPE "Mode" USING ("mode"::text::"Mode");

ALTER TABLE "building_definitions" ALTER COLUMN "mode" DROP DEFAULT;
ALTER TABLE "building_definitions" ALTER COLUMN "mode" TYPE "Mode" USING ("mode"::text::"Mode");
ALTER TABLE "building_definitions" ALTER COLUMN "mode" SET DEFAULT 'KIDS';

ALTER TABLE "game_definitions" ALTER COLUMN "mode" DROP DEFAULT;
ALTER TABLE "game_definitions" ALTER COLUMN "mode" TYPE "Mode" USING ("mode"::text::"Mode");
ALTER TABLE "game_definitions" ALTER COLUMN "mode" SET DEFAULT 'KIDS';

DROP TYPE "Mode_old";
