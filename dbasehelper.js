const mysql = require('mysql');
const config = require('./config');

const pool;

const startConn = async()=> {
    pool = mysql.createPool(config.database);
}

const getConnection = async () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            if (err) reject(err);
            else resolve(conn);
        })
    })
}

const executeQuery = async (query, conn) => {
    return new Promise((resolve, reject) => {
        pool.query(query, (err, rows, fields) => {
            if (err) reject(err);
            else resolve(rows);
        })
    })
}

const query = async(sql)=>{
    var con = await getConnection();
    var hasil = await executeQuery(sql,con);
    con.release();
    return hasil;
}

const endConn = async()=> {
    pool.end(function (err) {
        // all connections in the pool have ended
      });
}


module.exports = {
    'executeQuery' : executeQuery,
    'getConnection' : getConnection,
    "query" : query,
    "end":endConn,
    "start":startConn
}