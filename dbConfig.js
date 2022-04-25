
const sql = require("mssql/msnodesqlv8")

const conn = new sql.ConnectionPool({
    database: "blockchain",
    server: "localhost",
    driver: "msnodesqlv8",
    options: {
        trustServerCertificate: true,
        trustedConnection: true
    }
})

module.exports = conn