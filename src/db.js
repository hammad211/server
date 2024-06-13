const { Client } = require('pg');


// Create a new instance of the Client
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Connect to the database
client.connect(async function(err) {
  if (err) throw err;
  console.log("SQL Connected!");

 
});

module.exports = {
  client
};
