-- Migration v6: Fix submissions table to support both group and individual submissions
-- Run this if your submissions table doesn't have student_id, file_url, or comment columns

ALTER TABLE submissions ADD COLUMN IF NOT EXISTS student_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS file_url VARCHAR(500);
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS comment TEXT;

-- Make group_id nullable (individual submissions won't have a group)
ALTER TABLE submissions ALTER COLUMN group_id DROP NOT NULL;

-- Drop old unique constraint that only covered (assignment_id, group_id)
ALTER TABLE submissions DROP CONSTRAINT IF EXISTS submissions_assignment_id_group_id_key;

-- Add a flexible unique constraint: one submission per (assignment + group) OR (assignment + student)
-- We enforce this in the controller instead to handle both cases cleanly.
