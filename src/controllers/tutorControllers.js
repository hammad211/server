const {client} = require('../db');

module.exports.addNewTutor = async (req, res) => {    //add new tutor
  try {
    const { t_name, t_lname, t_address, t_city, t_gender, number, subject,price,about,coordinates } = req.body;
    let longitude = coordinates.longitude;
    let latitude = coordinates.latitude;
    const value = true;
    const tRegId = req.user.id;

    const deleteComment = 'DELETE FROM approval WHERE t_reg_id = $1 AND profilevalue = $2';
    const deleteResult= await client.query(deleteComment, [tRegId, "profile"]);

    const userQuery = 'SELECT * FROM tutor_info WHERE t_reg_id = $1';
    const existingUser = await client.query(userQuery, [tRegId]);
    
    if (existingUser.rows.length > 0) {
      console.log("exist")
      return res.status(400).send('Data already exists');
    }

    const insertData = 'INSERT INTO tutor_info (t_name, t_lname, t_address, t_city, t_gender, t_reg_id, number, subject,price,about,longitude,latitude) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9,$10,$11,$12) RETURNING *';
    const insertValue = [t_name, t_lname, t_address, t_city, t_gender, tRegId, number, subject,price,about,longitude,latitude];
    const result = await client.query(insertData, insertValue);

    const updateUserTable = 'UPDATE users SET persona = $1 WHERE id = $2';
    const insertUser = [true, tRegId];
    const resultUser = await client.query(updateUserTable, insertUser);
    console.log(resultUser.rows);
    res.status(200).json({ message: 'Info added successfully', data: value });
    
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Server error occurred' });
  }
};

module.exports.updateTutor = async (req, res) => {    //update tutor
  try {
    const { t_name, t_lname, t_address, t_city,t_gender, number,subject,price,about,coordinates } = req.body;
    let longitude = coordinates.longitude;
    let latitude = coordinates.latitude;
    const t_reg_id = req.user.id;
    const userQuery = 'SELECT * FROM tutor_info WHERE t_reg_id = $1';
    const existingUser = await client.query(userQuery, [t_reg_id]);

    const insertData = 'UPDATE tutor_info SET t_name = $1, t_lname = $2, t_address = $3, t_city = $4, t_gender = $5, number = $6, subject=$7, price=$8 ,about=$9, longitude=$10, latitude=$11  WHERE t_reg_id = $12 RETURNING *';
    const insertValue = [t_name, t_lname, t_address, t_city, t_gender, number, subject,price,about,longitude,latitude,t_reg_id];
    const result = await client.query(insertData, insertValue);
    res.status(201).json({ message: 'Info updated successfully'});
  } catch (error) {
    res.status(500).json({ error: 'Server error occurred' });
  }
};
 
module.exports.singleTutorInfo = async (req,res) =>{  //get  profile info of tutor
  try {
    const tRegId = req.user.id;
    console.log("tuttor",req.user.id);
    const query = 'SELECT * FROM tutor_info,image WHERE t_reg_id = $1';
    const result = await client.query(query, [tRegId]);
    res.status(200).json( result.rows);
  } catch (e) {
      res.status(400).send(e.message);
    }
}

module.exports.getComment = async (req,res) =>{  //get  profile info of tutor
  try {
    const tRegId = req.user.id;
    console.log("tuttor",req.user.id);
    const query = 'SELECT * FROM approval WHERE t_reg_id = $1';
    const result = await client.query(query, [tRegId]);
    res.status(200).json( result.rows);
  } catch (e) {
      res.status(400).send(e.message);
    }
}

module.exports.addNewQualify = async (req, res) => {    //add new qualify info
  try {
    const {  degreeName,degreeType,institue,year,city,yearEnd,image } = req.body;
    const value = true;
    const id = req.user.id;

    const deleteComment = 'DELETE FROM approval WHERE t_reg_id = $1 AND qualifyvalue = $2';
    const deleteResult= await client.query(deleteComment, [id, "qualify"]);

    const qualifyValue = "true";
    const userQuery = 'SELECT * FROM qualify_info WHERE t_degreetype = $1'
    const insertData = 'INSERT INTO qualify_info ( t_degree,t_degreetype,t_degreeyear,t_institute,  t_reg_id,city,year_end,image ) VALUES ($1, $2, $3, $4,$5,$6,$7,$8) RETURNING *';
    const insertValue = [degreeName,degreeType,year,institue,id,city,yearEnd,image ];
    const result = await client.query(insertData, insertValue);

    const updateUserTable = 'UPDATE users SET qualify = $1 WHERE id = $2';
    const insertUser = [true, id];
    const resultUser = await client.query(updateUserTable, insertUser);
    console.log(resultUser.rows);
    res.status(200).json({ message: 'Info added successfully', data: value });  
  } 
    catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Server error occurred' });
  }
};

module.exports.updateQualify = async (req, res) => { //update tutor qualification
  try {
    const { degreeName, degreeType, institue, year, city,yearEnd,image } = req.body;
    console.log(req.body);
    const id = req.user.id;
    const Id = req.body.id;
    const updateValue = "true";
    const updateData = `
      UPDATE qualify_info
      SET t_degree = $1, t_degreetype = $2, t_degreeyear = $3, t_institute = $4, city = $5, year_end=$6, image=$7
      WHERE t_reg_id = $8 AND id = $9
      RETURNING *;
    `;

    const updateValues = [degreeName, degreeType, year, institue, city,yearEnd,image, id,Id];
    
    const result = await client.query(updateData, updateValues);
    
    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Info updated successfully', result: result.rows[0] });
    } else {
      res.status(404).json({ error: 'Qualification not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

module.exports.deleteQualifyInfo = async (req, res) => { // delete tutor qualify by id
  try {
    console.log(req.params.id); // Use req.params.id instead of req.query.id
    const tRegId = req.params.id;
    const query = 'DELETE FROM qualify_info WHERE t_reg_id = $1';
    await client.query(query, [tRegId]); 
    res.status(200).send("Qualify information deleted successfully.");
  } catch (e) {
    res.status(400).send(e.message);
  }
};

module.exports.getQualifyInfo = async (req,res) =>{  //get qualify info of tutor
  try {
    const tRegId = req.user.id;
    const query = 'SELECT * FROM qualify_info WHERE t_reg_id = $1';
    const result = await client.query(query, [tRegId]);
      res.status(200).json(result.rows);
    } catch (e) {
      res.status(400).send(e.message);
    }
}

module.exports.addTime_slot = async (req, res) => { //time table added by teacher
  try { 
    const { selectedSlots } = req.body;
    const user_id = req.user.id;
    for (const slot of selectedSlots) {
      const { day, hour } = slot;
      const endTime = hour + 1; // Assuming each slot is for an hour
      const formattedStartTime = `${hour}:00:00`;
      const formattedEndTime = `${endTime}:00:00`;
      const query = `
        INSERT INTO time_slots (user_id, day, start_time, end_time,value)
        VALUES ($1, $2, $3, $4,$5)
        RETURNING *;
      `;
      const values = [user_id, day, formattedStartTime, formattedEndTime,false];
      const result = await client.query(query, values);
    }
    
    const updateUserTable = 'UPDATE users SET time = $1 WHERE id = $2';
    const insertUser = [true, user_id];
    const resultUser = await client.query(updateUserTable, insertUser);

    res.status(200).json({ message: 'Info added successfully', data: true }); 

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while saving the time slots',
      error: error.message,
    });
  }
};

module.exports.getSelectedSlots = async (req, res) => { // get selected slots added by teacher, no need to send id, it will get the id on its self
 
  try {
    
    const user_id = req.user.id;
    const query = `
      SELECT day, TO_CHAR(start_time, 'HH24') AS start_hour, value
      FROM time_slots
      WHERE user_id = $1;
      
    `;
    const values = [user_id];
    const result = await client.query(query, values);

    const selectedSlots = {};
    result.rows.forEach((row) => {
      const { day, start_hour, value } = row;
      if (!selectedSlots[day]) {
        selectedSlots[day] = [];
      }
      selectedSlots[day].push({ start_hour: Number(start_hour), value }); 
    });

    res.status(200).json({
      success: true,
      data: { selectedSlots },
    });
  } catch (error) {
    console.error('Error fetching selected time slots:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the selected time slots',
      error: error.message,
    });
  }
};






