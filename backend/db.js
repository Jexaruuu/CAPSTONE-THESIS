const mysql = require('mysql2');


const pool = mysql.createPool({
  host: 'localhost',     
  user: 'root',           
  password: '', 
  database: 'db_thesis' 
});


module.exports = pool.promise(); 
