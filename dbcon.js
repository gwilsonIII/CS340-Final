var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_wilsoger',
  password        : 'TinTin1!',
  database        : 'cs290_wilsoger'
});

module.exports.pool = pool;