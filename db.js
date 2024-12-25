const sql = require('mssql');

const config = {
    user: 'yearend',
    password: 'P!iJA7JbWgc89pv',
    server: 'yearendreview.database.windows.net',
    database: 'YearEndReview',
    options: {
        encrypt: true // Use this if you're on Windows Azure
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to Azure SQL');
        return pool;
    })
    .catch(err => console.log('Database Connection Failed! Bad Config: ', err));

module.exports = {
    sql, poolPromise
};
