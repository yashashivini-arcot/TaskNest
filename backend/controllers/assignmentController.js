const { query } = require('../config/db');

// @route   GET api/assignments
// @desc    Get all assignments
exports.getAssignments = async (req, res) => {
  try {
    let assignments;
    const baseQuery = `
      SELECT a.*, 
      COALESCE(
        (SELECT json_agg(json_build_object('type', target_type, 'id', target_id))
         FROM assignment_targets 
         WHERE assignment_id = a.id), 
        '[]'
      ) as targets
      FROM assignments a
    `;

    if (req.user.role === 'faculty') {
      assignments = await query(`${baseQuery} WHERE a.created_by = $1 ORDER BY a.created_at DESC`, [req.user.id]);
    } else {
      // TEMPORARILY BYPASS TARGET FILTERING: Make all assignments visible to all students
      assignments = await query(`${baseQuery} ORDER BY a.created_at DESC`);
    }
    res.json(assignments.rows || []);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Assignment Service Error' });
  }
};

// @route   POST api/assignments
// @desc    Create an assignment (Faculty only)
exports.createAssignment = async (req, res) => {
  const { title, description, due_date, link, assignment_type, targets } = req.body;
  try {
    const newAssignment = await query(
      'INSERT INTO assignments (title, description, due_date, link, created_by, assignment_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, due_date, link, req.user.id, assignment_type || 'group']
    );
    
    const assignmentId = newAssignment.rows[0].id;

    // Handle targeting
    if (targets && Array.isArray(targets)) {
      for (const target of targets) {
        await query(
          'INSERT INTO assignment_targets (assignment_id, target_type, target_id) VALUES ($1, $2, $3)',
          [assignmentId, target.type, target.id]
        );
      }
    }

    res.json(newAssignment.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Assignment Service Error' });
  }
};

// @route   PUT api/assignments/:id
// @desc    Update assignment (Faculty only)
exports.updateAssignment = async (req, res) => {
  const { title, description, due_date, link, assignment_type, targets } = req.body;
  try {
    const updated = await query(
      'UPDATE assignments SET title = $1, description = $2, due_date = $3, link = $4, assignment_type = $5 WHERE id = $6 RETURNING *',
      [title, description, due_date, link, assignment_type || 'group', req.params.id]
    );

    // Sync targets
    if (targets && Array.isArray(targets)) {
      await query('DELETE FROM assignment_targets WHERE assignment_id = $1', [req.params.id]);
      for (const target of targets) {
        await query(
          'INSERT INTO assignment_targets (assignment_id, target_type, target_id) VALUES ($1, $2, $3)',
          [req.params.id, target.type, target.id]
        );
      }
    }

    res.json(updated.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Assignment Service Error' });
  }
};

// @route   DELETE api/assignments/:id
// @desc    Delete assignment (Faculty only)
exports.deleteAssignment = async (req, res) => {
  try {
    await query('DELETE FROM assignments WHERE id = $1', [req.params.id]);
    res.json({ msg: 'Assignment removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Assignment Service Error' });
  }
};
