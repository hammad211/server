const { Client } = require('pg');
const fs = require('fs');

// Read the SQL script file
// const sqlScript = fs.readFileSync('20231109085723-initialize-up.sql', 'utf8');

 const client = new Client({
    user: 'postgres',
    user: 'postgres',
    host: 'localhost',
    database: 'tutor_db',
    password: '699699',
    port: 5432,
  });
  
  client.connect(function(err) {
    if (err) throw err;
    console.log("SQL Connected!");
    // return client.query(sqlScript);

  });

module.exports = {
  client
};
