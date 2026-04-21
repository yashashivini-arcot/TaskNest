const { query } = require('../config/db');

// @route   GET api/submissions
// @desc    Get submissions
//   - Faculty: ALL submissions with joined details
//   - Student: Only this student's submissions
exports.getSubmissions = async (req, res) => {
  try {
    let result;

    if (req.user.role === 'faculty') {
      // Faculty sees all submissions, with group name, student name, assignment title
      result = await query(`
        SELECT 
          s.id,
          s.assignment_id,
          s.status,
          s.grade,
          s.feedback,
          s.submitted_at,
          s.file_url,
          s.comment,
          a.title AS assignment_title,
          COALESCE(g.name, u.name) AS group_name,
          u.name AS student_name,
          u.email AS student_email,
          s.group_id,
          s.student_id
        FROM submissions s
        LEFT JOIN assignments a ON s.assignment_id = a.id
        LEFT JOIN groups g ON s.group_id = g.id
        LEFT JOIN users u ON s.student_id = u.id
        ORDER BY s.submitted_at DESC NULLS LAST
      `);
    } else {
      // Student sees only their own submissions (by student_id or group membership)
      result = await query(`
        SELECT 
          s.id,
          s.assignment_id,
          s.status,
          s.grade,
          s.feedback,
          s.submitted_at,
          s.file_url,
          s.comment,
          a.title AS assignment_title
        FROM submissions s
        LEFT JOIN assignments a ON s.assignment_id = a.id
        WHERE s.student_id = $1
          OR s.group_id IN (
            SELECT group_id FROM group_members WHERE user_id = $1
          )
        ORDER BY s.submitted_at DESC NULLS LAST
      `, [req.user.id]);
    }

    res.json(result.rows || []);
  } catch (err) {
    console.error('getSubmissions error:', err.message);
    res.status(500).json({ msg: 'Failed to fetch submissions.' });
  }
};

// @route   GET api/submissions/assignment/:assignmentId
// @desc    Get submissions for a specific assignment (Faculty only)
exports.getSubmissionsByAssignment = async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        s.id,
        s.assignment_id,
        s.status,
        s.grade,
        s.feedback,
        s.submitted_at,
        s.file_url,
        s.comment,
        a.title AS assignment_title,
        COALESCE(g.name, u.name) AS group_name,
        u.name AS student_name,
        u.email AS student_email,
        s.group_id,
        s.student_id
      FROM submissions s
      LEFT JOIN assignments a ON s.assignment_id = a.id
      LEFT JOIN groups g ON s.group_id = g.id
      LEFT JOIN users u ON s.student_id = u.id
      WHERE s.assignment_id = $1
      ORDER BY s.submitted_at DESC NULLS LAST
    `, [req.params.assignmentId]);

    res.json(result.rows || []);
  } catch (err) {
    console.error('getSubmissionsByAssignment error:', err.message);
    res.status(500).json({ msg: 'Failed to fetch submissions.' });
  }
};

// @route   POST api/submissions
// @desc    Submit an assignment (Student)
exports.submitAssignment = async (req, res) => {
  const { assignmentId, groupId, studentId, fileUrl, comment } = req.body;

  if (!assignmentId || !fileUrl) {
    return res.status(400).json({ msg: 'Assignment ID and file URL are required.' });
  }

  try {
    // Check if already submitted (prevent duplicates)
    const existing = await query(
      `SELECT id FROM submissions 
       WHERE assignment_id = $1 
         AND (student_id = $2 OR (group_id = $3 AND group_id IS NOT NULL))`,
      [assignmentId, req.user.id, groupId || null]
    );

    if (existing.rows.length > 0) {
      // Update existing submission
      const updated = await query(
        `UPDATE submissions 
         SET file_url = $1, comment = $2, status = 'Submitted', submitted_at = NOW()
         WHERE id = $3
         RETURNING *`,
        [fileUrl, comment || null, existing.rows[0].id]
      );
      return res.json(updated.rows[0]);
    }

    // Create new submission
    const result = await query(
      `INSERT INTO submissions (assignment_id, student_id, group_id, status, file_url, comment, submitted_at)
       VALUES ($1, $2, $3, 'Submitted', $4, $5, NOW())
       RETURNING *`,
      [assignmentId, req.user.id, groupId || null, fileUrl, comment || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('submitAssignment error:', err.message);
    // If it's a missing column error, give a helpful message
    if (err.message.includes('column') || err.message.includes('does not exist')) {
      return res.status(500).json({ 
        msg: 'Database schema is outdated. Please run: node backend/run_migration_v7.js' 
      });
    }
    if (err.message.includes('unique') || err.message.includes('duplicate')) {
      return res.status(400).json({ msg: 'You have already submitted this assignment.' });
    }
    res.status(500).json({ msg: err.message || 'Failed to submit assignment.' });
  }
};

// @route   PUT api/submissions/evaluate/:id
// @desc    Grade a submission (Faculty only)
exports.gradeSubmission = async (req, res) => {
  const { grade, feedback } = req.body;

  if (!grade) {
    return res.status(400).json({ msg: 'Grade is required.' });
  }

  try {
    const updated = await query(
      `UPDATE submissions 
       SET grade = $1, feedback = $2, status = 'Graded'
       WHERE id = $3
       RETURNING *`,
      [grade, feedback || null, req.params.id]
    );

    if (updated.rows.length === 0) {
      return res.status(404).json({ msg: 'Submission not found.' });
    }

    res.json(updated.rows[0]);
  } catch (err) {
    console.error('gradeSubmission error:', err.message);
    res.status(500).json({ msg: 'Failed to grade submission.' });
  }
};
