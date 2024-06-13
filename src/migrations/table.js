const { client } = require('../db');
const fs = require('fs');
const path = require('path');

module.exports.schemaTable = async (req, res) => {
  console.log("closing");

  try {
    // Check if the table exists
    const tableExists = await checkTableExists();

    if (tableExists) {
      console.log("Table already exists. Skipping schema application.");
      return;
    }

    // Read and execute the SQL file
    const sqlFilePath = path.join("./migrations", 'output_file.sql');
    const sql = await fs.promises.readFile(sqlFilePath, 'utf8');

    // Execute the SQL commands
    await client.query(sql);
    console.log('Database schema applied successfully.');
  } catch (err) {
    console.error('Failed to apply schema:', err);
  } 
};

async function checkTableExists() {
  try {

    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'users';
    `);

    return res.rows.length > 0;
  } catch (err) {
    console.error('Failed to check table existence:', err);
    return false;
  }
}
