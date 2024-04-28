const {client} = require('../db');



module.exports.singleTutorInfo = async (req, res) => { //get profile info of tutor
    try {
      const query = 'SELECT * FROM tutor_info JOIN qualify_info ON tutor_info.t_reg_id = qualify_info.t_reg_id JOIN image ON tutor_info.t_reg_id = image.use_id;';
      const result = await client.query(query);
      res.status(200).json(result.rows);
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
  
  module.exports.addNewTutor = async (req, res) => {    //add new tutor
    try {
      const { comment, t_reg_id} = req.body;
   ;
      const value = true;
  
      const insertData = 'INSERT INTO approval (profile,profilevalue, t_reg_id) VALUES ($1, $2, $3) RETURNING *';
      const insertValue = [comment,true, t_reg_id];
      const result = await client.query(insertData, insertValue);
  
      const updateUserTable = 'UPDATE users SET persona = $1 WHERE id = $2';
      const insertUser = [false, t_reg_id];
      const resultUser = await client.query(updateUserTable, insertUser);
      console.log(resultUser.rows);
      res.status(200).json({ message: 'Info added successfully', data: value });
      
    } catch (error) {
        console.log(error)
      res.status(500).json({ error: 'Server error occurred' });
    }
  };  