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
  
  module.exports.addNewTutor = async (req, res) => {    //add new tutor
    try {
      const { changes, t_reg_id, type} = req.body;
      console.log("comment, t_reg_id, type",changes, t_reg_id, type)
      // const value = true;
  
      const insertData = 'INSERT INTO approval (profile,profilevalue, t_reg_id) VALUES ($1, $2, $3) RETURNING *';
      const insertValue = [changes,type,t_reg_id];
      const result = await client.query(insertData, insertValue);

  if(type==="profile"){
      const updateUserTable = 'UPDATE users SET persona = $1 WHERE id = $2';
      const insertUser = [false, t_reg_id];
      const resultUser = await client.query(updateUserTable, insertUser);
  }
  else if(type === "qualify"){
      const updateUserTable = 'UPDATE users SET qualify = $1 WHERE id = $2';
      const insertUser = [false, t_reg_id];
      const resultUser = await client.query(updateUserTable, insertUser);
      console.log(resultUser.rows);
      res.status(200).json({ message: 'Info added successfully', data: value });
  } 
    } catch (error) {
        console.log(error)
      res.status(500).json({ error: 'Server error occurred' });
    }
  };  

  module.exports.approveTutor = async (req, res) => {    //add new tutor
    try {  
      console.log(req.body);
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