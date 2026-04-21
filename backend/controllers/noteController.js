const { query } = require('../config/db');

// Get notes strictly by classroom
exports.getNotesByClassroom = async (req, res) => {
  try {
    const notes = await query(
      'SELECT n.*, u.name as uploaded_by_name FROM notes n JOIN users u ON n.uploaded_by = u.id WHERE n.classroom_id = $1 ORDER BY n.created_at DESC',
      [req.params.classroomId]
    );
    res.json(notes.rows);
  } catch (err) {
    res.status(500).json({ msg: 'Resource Service Error' });
  }
};

exports.uploadNote = async (req, res) => {
  const { title, description, link, classroomId } = req.body;
  if (!title || !link) {
    return res.status(400).json({ msg: 'Title and link are required' });
  }
  try {
    const userId = req.user.id || req.user.userId;
    const newNote = await query(
      'INSERT INTO notes (title, description, file_link, classroom_id, uploaded_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, link, classroomId || null, userId]
    );
    res.json(newNote.rows[0]);
  } catch (err) {
    res.status(500).json({ msg: 'Resource Service Error' });
  }
};

exports.updateNote = async (req, res) => {
  const { title, description, link, classroomId } = req.body;
  try {
    const userId = req.user.id || req.user.userId;
    const updated = await query(
      'UPDATE notes SET title = $1, description = $2, file_link = $3, classroom_id = $4 WHERE id = $5 AND uploaded_by = $6 RETURNING *',
      [title, description, link, classroomId, req.params.id, userId]
    );
    if (updated.rows.length === 0) return res.status(404).json({ msg: 'Resource not found or unauthorized' });
    res.json(updated.rows[0]);
  } catch (err) {
    res.status(500).json({ msg: 'Resource Service Error' });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    const deleted = await query('DELETE FROM notes WHERE id = $1 AND uploaded_by = $2 RETURNING *', [req.params.id, userId]);
    if (deleted.rows.length === 0) return res.status(404).json({ msg: 'Resource not found or unauthorized' });
    res.json({ msg: 'Resource removed' });
  } catch (err) {
    res.status(500).json({ msg: 'Resource Service Error' });
  }
};
