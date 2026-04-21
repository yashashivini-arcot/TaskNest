-- Upgrade notes table
ALTER TABLE notes ADD COLUMN IF NOT EXISTS classroom_id INTEGER REFERENCES classrooms(id) ON DELETE CASCADE;
ALTER TABLE notes RENAME COLUMN file_url TO file_link;
