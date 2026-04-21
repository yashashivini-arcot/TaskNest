-- Database schema migration for user_id specifics

-- 1. Submissions user_id
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);

-- 2. Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
    classroom_id INTEGER,
    user_id INTEGER REFERENCES users(id),
    PRIMARY KEY (classroom_id, user_id)
);

-- 3. Groups user_id (if they want an explicit user_id mapping on the parent table)
ALTER TABLE groups ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);
