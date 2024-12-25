const { sql, poolPromise } = require('../db');

async function createTask(task) {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('createdDate', sql.DateTime, new Date()) // Automatically set to current date
            .input('eventDate', sql.DateTime, task.eventDate)
            .input('projectType', sql.VarChar, task.projectType)
            .input('timeSpent', sql.Int, task.timeSpent)
            .input('info', sql.VarChar, task.info)
            .input('username', sql.VarChar, task.username)
            .query('INSERT INTO Tasks (createdDate, eventDate, projectType, timeSpent, info, username) VALUES (@createdDate, @eventDate, @projectType, @timeSpent, @info, @username)');
        return { status: 200, message: 'Task created successfully' };
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    }
}

module.exports = {
    createTask
};