const {client} = require('../db');

module.exports.singleTutorInfo = async (req, res) => { //get profile info of tutor
    try {
      const query = 'SELECT * FROM tutor_info JOIN qualify_info ON tutor_info.t_reg_id = qualify_info.t_reg_id JOIN image ON tutor_info.t_reg_id = image.use_id JOIN users ON tutor_info.t_reg_id = users.id ';
      const result = await client.query(query);
      res.status(200).json(result.rows);
    } catch (e) {
      res.status(400).send(e.message);
    }
  }

  module.exports.approveResponse = async (req, res) => {
    const t_reg_id = req.params.id;
    console.log("id", t_reg_id);
  
    try {
      const query = {
        text: 'SELECT * FROM approval WHERE t_reg_id = $1',
        values: [t_reg_id],
      };
  
      const result = await client.query(query);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Personal tutor not found' });
      }

      // Send all rows matching the t_reg_id to the frontend
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
};


  
module.exports.addNewTutor = async (req, res) => {
  try {
    const { changes, t_reg_id, type } = req.body;
    console.log("comment, t_reg_id, type", changes, t_reg_id, type);


    if (type === "profile") {
      const insertData = 'INSERT INTO approval (profile, profilevalue, t_reg_id) VALUES ($1, $2, $3) RETURNING *';
      const insertValue = [changes, type, t_reg_id];
      const result = await client.query(insertData, insertValue);

      const deleteTutorInfo = 'DELETE FROM tutor_info WHERE t_reg_id = $1';
      const deleteImage = 'DELETE FROM image WHERE use_id = $1';
      await client.query(deleteTutorInfo, [t_reg_id]);
      await client.query(deleteImage, [t_reg_id]);

      const updateUserTable = 'UPDATE users SET persona = $1, image = $2 WHERE id = $3';
      const insertUser = [false, false, t_reg_id];
      await client.query(updateUserTable, insertUser);

      res.status(200).json({ message: 'Profile info added successfully' });

    } else if (type === "qualify") {
      const insertData = 'INSERT INTO approval (qualify, qualifyvalue, t_reg_id) VALUES ($1, $2, $3) RETURNING *';
      const insertValue = [changes, type, t_reg_id];
      const result = await client.query(insertData, insertValue);

      const deleteQualifyInfo = 'DELETE FROM qualify_info WHERE t_reg_id = $1';
      const result1= await client.query(deleteQualifyInfo, [t_reg_id]);

      const updateUserTable = 'UPDATE users SET qualify = $1 WHERE id = $2';
      const insertUser = [false, t_reg_id];
      const result2 = await client.query(updateUserTable, insertUser);

      res.status(200).json({ message: 'Qualification info added successfully' });

    } else {
      res.status(400).json({ error: 'Invalid type provided' });
    }
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error occurred' });
  } finally {
    await client.end();
  }
};

  module.exports.approveTutor = async (req, res) => {    //add new tutor
    try {  
      console.log("req",req.body);
      const {t_reg_id} = req.body;
      const updateUserTable = 'UPDATE users SET approve = $1 WHERE id = $2';
      const insertUser = [true, t_reg_id];
      const resultUser = await client.query(updateUserTable, insertUser);
      res.status(200).json({ message: 'response added successfully'});
    } catch (error) {
        console.log(error)
      res.status(500).json({ error: 'Server error occurred' });
    }
  };  