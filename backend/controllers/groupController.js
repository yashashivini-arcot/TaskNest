const { query } = require('../config/db');

// @route   GET api/groups
// @desc    Get groups relevant to the user
//   Faculty: groups they created
//   Student: groups they are a member of
exports.getGroups = async (req, res) => {
  try {
    const userId = req.user.id;

    let result;
    if (req.user.role === 'faculty') {
      result = await query(
        `SELECT g.*, 
          (SELECT COUNT(*) FROM group_members WHERE group_id = g.id) AS member_count
         FROM groups g
         WHERE g.created_by = $1
         ORDER BY g.created_at DESC`,
        [userId]
      );
    } else {
      // Students see groups they belong to
      result = await query(
        `SELECT g.*,
          (SELECT COUNT(*) FROM group_members WHERE group_id = g.id) AS member_count
         FROM groups g
         JOIN group_members gm ON g.id = gm.group_id
         WHERE gm.user_id = $1
         ORDER BY g.created_at DESC`,
        [userId]
      );
    }

    res.json(result.rows || []);
  } catch (err) {
    console.error('getGroups error:', err.message);
    res.status(500).json({ msg: 'Failed to fetch groups.' });
  }
};

// @route   POST api/groups
// @desc    Create a group
exports.createGroup = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ msg: 'Group name is required.' });

  try {
    const userId = req.user.id;

    const newGroup = await query(
      'INSERT INTO groups (name, created_by) VALUES ($1, $2) RETURNING *',
      [name, userId]
    );

    // Automatically add the creator as a member
    await query(
      'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [newGroup.rows[0].id, userId]
    );

    res.status(201).json(newGroup.rows[0]);
  } catch (err) {
    console.error('createGroup error:', err.message);
    res.status(500).json({ msg: 'Failed to create group.' });
  }
};

// @route   POST api/groups/:id/add-member
// @desc    Add a member to a group (by userId or email)
exports.addMember = async (req, res) => {
  const { userId, email } = req.body;

  try {
    let targetUserId = userId;

    if (email) {
      const userResult = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
      if (userResult.rows.length === 0) {
        return res.status(404).json({ msg: 'No user found with that email.' });
      }
      targetUserId = userResult.rows[0].id;
    }

    if (!targetUserId) {
      return res.status(400).json({ msg: 'User ID or email is required.' });
    }

    await query(
      'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.params.id, targetUserId]
    );

    res.json({ msg: 'Member added successfully.' });
  } catch (err) {
    console.error('addMember error:', err.message);
    res.status(500).json({ msg: 'Failed to add member.' });
  }
};
