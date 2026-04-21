const { query } = require('../config/db');

exports.getExams = async (req, res) => {
  try {
    const exams = await query('SELECT * FROM exams ORDER BY exam_date ASC');
    res.json(exams.rows);
  } catch (err) {
    res.status(500).json({ msg: 'Exam Service Error' });
  }
};

exports.addExam = async (req, res) => {
  const { subject, date, time } = req.body;
  try {
    const newExam = await query(
      'INSERT INTO exams (subject, exam_date, exam_time) VALUES ($1, $2, $3) RETURNING *',
      [subject, date, time]
    );
    res.json(newExam.rows[0]);
  } catch (err) {
    res.status(500).json({ msg: 'Exam Service Error' });
  }
};

exports.updateExam = async (req, res) => {
  const { subject, date, time } = req.body;
  try {
    const updated = await query(
      'UPDATE exams SET subject = $1, exam_date = $2, exam_time = $3 WHERE id = $4 RETURNING *',
      [subject, date, time, req.params.id]
    );
    res.json(updated.rows[0]);
  } catch (err) {
    res.status(500).json({ msg: 'Exam Service Error' });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    await query('DELETE FROM exams WHERE id = $1', [req.params.id]);
    res.json({ msg: 'Exam deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Exam Service Error' });
  }
};
