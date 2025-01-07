const { sql, poolPromise } = require('../db');
const bcrypt = require('bcrypt');

async function createUser(user) {
    try {
        const pool = await poolPromise;
        const hashedPassword = await bcrypt.hash(user.password, 10); // Hash the password with a salt round of 10
        await pool.request()
            .input('username', sql.VarChar, user.username)
            .input('password', sql.VarChar, hashedPassword)
            .query('INSERT INTO Users (username, password) VALUES (@username, @password)');
        return { status: 200, message: 'User created successfully' };
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    }
}

async function loginUser(user) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('username', sql.VarChar, user.username)
            .query('SELECT password FROM Users WHERE username = @username');
        
        if (result.recordset.length > 0) {
            const hashedPassword = result.recordset[0].password;
            const passwordMatch = await bcrypt.compare(user.password, hashedPassword);
            if (passwordMatch) {
                return { status: 200, message: 'Login successful' };
            } else {
                return { status: 401, message: 'Invalid username or password' };
            }
        } else {
            return { status: 401, message: 'Invalid username or password' };
        }
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    }
}

module.exports = {
    createUser,
    loginUser
};