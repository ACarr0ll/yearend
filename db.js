const sql = require('mssql');
const { HttpsProxyAgent } = require('https-proxy-agent');

const config = {
    user: process.env.dbuser,
    password: process.env.password,
    server: process.env.server,
    database: process.env.database,
    options: {
        encrypt: true // Use this if you're on Windows Azure
    }
};

if (process.env.PROXIMO_URL) {
    const proxyAgent = new HttpsProxyAgent(process.env.PROXIMO_URL);
    config.options.agent = proxyAgent;
}

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
