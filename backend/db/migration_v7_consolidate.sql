-- Migration v7: Consolidate schema — safe to run multiple times

-- 1. Ensure enrollments table exists (used by classroomController)
CREATE TABLE IF NOT EXISTS enrollments (
    classroom_id INTEGER REFERENCES classrooms(id) ON DELETE CASCADE,
    user_id      INTEGER REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (classroom_id, user_id)
);

-- 2. Ensure assignment_targets table exists
CREATE TABLE IF NOT EXISTS assignment_targets (
    id            SERIAL PRIMARY KEY,
    assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
    target_type   VARCHAR(50) NOT NULL CHECK (target_type IN ('classroom', 'group', 'student')),
    target_id     INTEGER NOT NULL
);

-- 3. Ensure assignments has assignment_type column
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS assignment_type VARCHAR(50) DEFAULT 'group';

-- 4. Add student_id, file_url, comment to submissions if missing
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS student_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS file_url VARCHAR(500);
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS comment TEXT;

-- 5. Make group_id nullable so individual submissions work
ALTER TABLE submissions ALTER COLUMN group_id DROP NOT NULL;

-- 6. Drop ALL old unique constraints on submissions (they block NULL group_id inserts)
ALTER TABLE submissions DROP CONSTRAINT IF EXISTS submissions_assignment_id_group_id_key;
ALTER TABLE submissions DROP CONSTRAINT IF EXISTS submissions_pkey CASCADE;
-- Re-add primary key if it was accidentally dropped
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'submissions_pkey'
  ) THEN
    ALTER TABLE submissions ADD PRIMARY KEY (id);
  END IF;
END $$;

-- 7. Drop old partial indexes if they exist, then recreate cleanly
DROP INDEX IF EXISTS idx_unique_group_submission;
DROP INDEX IF EXISTS idx_unique_student_submission;

-- Only enforce uniqueness where the key is actually set (NOT NULL)
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_group_submission
    ON submissions (assignment_id, group_id)
    WHERE group_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_student_submission
    ON submissions (assignment_id, student_id)
    WHERE student_id IS NOT NULL;
