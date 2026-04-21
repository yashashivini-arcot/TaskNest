-- TaskNest Migration v2: Classrooms & Flexible Targeting

-- 1. Add assignment_type to assignments
-- Defaulting to 'group' to maintain backward compatibility with existing data
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS assignment_type VARCHAR(50) DEFAULT 'group' CHECK (assignment_type IN ('individual', 'group'));

-- 2. Update submissions for individual support
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS student_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE submissions ALTER COLUMN group_id DROP NOT NULL;

-- Remove old unique constraint if it exists (assignment_id + group_id)
ALTER TABLE submissions DROP CONSTRAINT IF EXISTS submissions_assignment_id_group_id_key;

-- New unique constraints using partial indexes to support both types
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_group_submission ON submissions (assignment_id, group_id) WHERE group_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_student_submission ON submissions (assignment_id, student_id) WHERE student_id IS NOT NULL;

-- 3. Classrooms
CREATE TABLE IF NOT EXISTS classrooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Classroom Members
CREATE TABLE IF NOT EXISTS classroom_members (
    classroom_id INTEGER REFERENCES classrooms(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (classroom_id, student_id)
);

-- 5. Assignment Targets
CREATE TABLE IF NOT EXISTS assignment_targets (
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
    target_type VARCHAR(50) NOT NULL CHECK (target_type IN ('classroom', 'group', 'student')),
    target_id INTEGER NOT NULL
);
