const { client } = require('../db');

module.exports.addImage =  async (req, res) => {
    const { selectedFile } = req.body;
    console.log(req.body)
    const value = "true";
    try {
      const userid = req.user.id;
      if (!selectedFile) {
        return res.status(400).json({ error: 'No file selected' });
      }
      const userQuery = 'SELECT * FROM image WHERE use_id = $1';
      const existingUser = await client.query(userQuery, [userid]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({message:'Image already exists'});
      }
      const insertDataQuery = `
        INSERT INTO image (use_id, ima)
        VALUES ($1, $2)
        RETURNING * `;
     
      const insertDataValues = [userid, selectedFile];
      const result = await client.query(insertDataQuery, insertDataValues);

      const updateUserTable = 'UPDATE users SET image = $1 WHERE id = $2';
    const insertUser = [true, userid];
    const resultUser = await client.query(updateUserTable, insertUser);
    res.status(200).json({ message: 'Info added successfully', data: value }); 
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Server error occurred' });
    }
    
  };

  module.exports.getImage = async (req, res) => {
    try {
      const userId = req.user.id;
      const userQuery = 'SELECT image FROM image WHERE use_id = $1';
      const result = await client.query(userQuery, [userId]);
      if (result.rows.length === 0) {
        return res.status(500).json({ error: 'No image exists for this user' });
      }
      const imageBuffer = result.rows[0].image;
      return res.status(200).send(imageBuffer);
    } catch (error) {
      res.status(500).json({ error: 'Server error occurred' });
    }
  };

  module.exports.getImageById = async (req, res) => {
    try {
      const userId = req.params.id;
      const userQuery = 'SELECT image FROM image WHERE use_id = $1';
      const result = await client.query(userQuery, [userId]);
      if (result.rows.length === 0) {
        return res.status(500).json({ error: 'No image exists for this user' });
      }
      const imageBuffer = result.rows[0].image;
      return res.status(200).send(imageBuffer);
    } catch (error) {
      res.status(500).json({ error: 'Server error occurred' });
    }
  };
  
             
module.exports.updateImage = async (req, res) => {    //update image
    const { selectedFile } = req.body;
    try {
      const userid = req.user.id;
      if (!selectedFile) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      const insertDataQuery = `
      UPDATE image SET image = $2 WHERE use_id = $1 RETURNING *
     `;
      const insertDataValues = [userid, selectedFile];
      const result = await client.query(insertDataQuery, insertDataValues);
      res.status(201).json({ message: 'Image change successfully', result });
    } catch (error) {
      res.status(500).json({ error: 'Server error occurred' });
    }
};