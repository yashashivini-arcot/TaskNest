const { query } = require('../config/db');

exports.createClassroom = async (req, res) => {
    const { name } = req.body;
    try {
        const result = await query(
            'INSERT INTO classrooms (name, created_by) VALUES ($1, $2) RETURNING *',
            [name, req.user.id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Error creating classroom' });
    }
};

exports.getAllClassrooms = async (req, res) => {
    try {
        const userId = req.user.id || req.user.userId;
        let result;
        if (req.user.role === 'faculty') {
            result = await query(`
                SELECT c.*, 
                (SELECT COUNT(*) FROM enrollments WHERE classroom_id = c.id) as active_capacity 
                FROM classrooms c WHERE created_by = $1 ORDER BY created_at DESC`, [userId]);
        } else {
            result = await query(`
                SELECT c.*, 
                (SELECT COUNT(*) FROM enrollments WHERE classroom_id = c.id) as active_capacity 
                FROM classrooms c WHERE id IN (SELECT classroom_id FROM enrollments WHERE user_id = $1) ORDER BY created_at DESC`, [userId]);
        }
        res.json(result.rows || []);
    } catch (err) {
        console.error('Error fetching classrooms', err);
        res.status(500).json({ message: 'Error fetching classrooms' });
    }
};

exports.addStudent = async (req, res) => {
    const { id } = req.params;
    const { studentEmail } = req.body;
    try {
        const userResult = await query('SELECT id FROM users WHERE email = $1 AND role = $2', [studentEmail, 'student']);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'Student not found with this email' });
        }
        
        const studentId = userResult.rows[0].id;
        
        await query(
            'INSERT INTO enrollments (classroom_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [id, studentId]
        );
        res.json({ message: 'Student added to classroom' });
    } catch (err) {
        res.status(500).json({ message: 'Error adding student to classroom' });
    }
};

exports.removeStudent = async (req, res) => {
    const { id, userId } = req.params;
    try {
        await query('DELETE FROM enrollments WHERE classroom_id = $1 AND user_id = $2', [id, userId]);
        res.json({ message: 'Student removed from classroom' });
    } catch (err) {
        res.status(500).json({ message: 'Error removing student' });
    }
};

exports.getClassroomMembers = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query(`
            SELECT u.id, u.name, u.email FROM users u
            JOIN enrollments e ON u.id = e.user_id
            WHERE e.classroom_id = $1
        `, [id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching classroom members' });
    }
};

exports.deleteClassroom = async (req, res) => {
    try {
        await query('DELETE FROM classrooms WHERE id = $1 AND created_by = $2', [req.params.id, req.user.id || req.user.userId]);
        res.json({ message: 'Classroom deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting classroom' });
    }
};
