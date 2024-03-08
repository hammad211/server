const {client} = require('../db');

module.exports.addNewTutor = async (req, res) => {    //add new tutor
  try {
    const { t_name, t_lname, t_address, t_city, t_gender, number, subject,price } = req.body;
    const value = true;
    const tRegId = req.user.id;
    const userQuery = 'SELECT * FROM tutor_info WHERE t_reg_id = $1';
    const existingUser = await client.query(userQuery, [tRegId]);
    
    if (existingUser.rows.length > 0) {
      return res.status(400).send('Data already exists');
    }

    const insertData = 'INSERT INTO tutor_info (t_name, t_lname, t_address, t_city, t_gender, t_reg_id, number, subject,price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9) RETURNING *';
    const insertValue = [t_name, t_lname, t_address, t_city, t_gender, tRegId, number, subject,price];
    const result = await client.query(insertData, insertValue);

    const updateUserTable = 'UPDATE users SET persona = $1 WHERE id = $2';
    const insertUser = [true, tRegId];
    const resultUser = await client.query(updateUserTable, insertUser);
    console.log(resultUser.rows);
    res.status(200).json({ message: 'Info added successfully', data: value });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};


module.exports.updateTutor = async (req, res) => {    //update tutor
  try {
    const { t_name, t_lname, t_address, t_city,t_gender, number } = req.body;
    const t_reg_id = req.user.id;
    const userQuery = 'SELECT * FROM tutor_info WHERE t_reg_id = $1';
    const existingUser = await client.query(userQuery, [t_reg_id]);

    const insertData = 'UPDATE tutor_info SET t_name = $1, t_lname = $2, t_address = $3, t_city = $4, t_gender = $5, number = $6 WHERE t_reg_id = $7 RETURNING *';
    const insertValue = [t_name, t_lname, t_address, t_city, t_gender, number, t_reg_id];
    const result = await client.query(insertData, insertValue);
    res.status(201).json({ message: 'Info updated successfully'});
  } catch (error) {
    res.status(500).json({ error: 'Server error occurred' });
  }
};
 
module.exports.singleTutorInfo = async (req,res) =>{  //get new profile info of tutor
  try {
    const tRegId = req.user.id;
    const query = 'SELECT * FROM tutor_info WHERE t_reg_id = $1';
    const result = await client.query(query, [tRegId]);
    res.status(200).json( result.rows);
  } catch (e) {
      res.status(400).send(e.message);
    }
}

module.exports.addNewQualify = async (req, res) => {    //add new qualify info
  try {
    const {  degreeName,degreeType,institue,year,city,yearEnd } = req.body;
    console.log(req.body);
    const value = true;

    const id = req.user.id;
    const qualifyValue = "true";
    const userQuery = 'SELECT * FROM qualify_info WHERE t_degreetype = $1'
    const insertData = 'INSERT INTO qualify_info ( t_degree,t_degreetype,t_degreeyear,t_institute,  t_reg_id,city, qualify_value,year_end ) VALUES ($1, $2, $3, $4,$5,$6,$7,$8) RETURNING *';
    const insertValue = [degreeName,degreeType,year,institue,id,city,qualifyValue,yearEnd ];
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

module.exports.updateQualify = async (req, res) => {
  try {
    const { degreeName, degreeType, institue, year, city,yearEnd } = req.body;
    console.log(req.body);
    const id = req.user.id;
    const Id = req.body.id;
    const updateValue = "true";
    const updateData = `
      UPDATE qualify_info
      SET t_degree = $1, t_degreetype = $2, t_degreeyear = $3, t_institute = $4, city = $5, qualify_value=$6,year_end=$7
      WHERE t_reg_id = $8 AND id = $9
      RETURNING *;
    `;

    const updateValues = [degreeName, degreeType, year, institue, city,updateValue,yearEnd, id,Id];
    
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

module.exports.getQualifyInfo = async (req,res) =>{  //get new qualify info of tutor
  try {
    const tRegId = req.user.id;
    const query = 'SELECT * FROM qualify_info WHERE t_reg_id = $1';
    const result = await client.query(query, [tRegId]);
      res.status(200).json(result.rows);
    } catch (e) {
      res.status(400).send(e.message);
    }
}

module.exports.getTime = async (req,res) =>{     // get the time schdule
 try{
  const regId = req.user.id;
  const query = 'SELECT * FROM tutor_time WHERE t_reg_id = $1';
  const result = await client.query(query, [regId]);
    res.status(200).json(result.rows);
  } catch (e) {
    res.status(400).send(e.message);
  }
}

module.exports.getTimeScdule = async (req,res) =>{     // get the tutor courses
  try{
   const regId = req.user.id;
   const query = 'SELECT * FROM availability_table WHERE t_reg_id = $1';
   const result = await client.query(query, [regId]);
     res.status(200).json(result.rows);
   } catch (e) {
     res.status(400).send(e.message);
   }
 }
     
 module.exports.addTime = async (req, res) => {
  try {
    const {  values } = req.body; // Destructure time values from request body
    const regId = req.user.id; 
    const value=true;
    const insertData = `
      INSERT INTO availability_table (fromMonday, toMonday, fromTuesday, toTuesday, fromWednesday, toWednesday, fromThursday, toThursday, fromFriday, toFriday, fromSaturday, toSaturday, fromSunday, toSunday )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`;
      
    const insertValues = [values.fromMonday, values.toMonday, values.fromTuesday, values.toTuesday, values.fromWednesday, values.toWednesday, values.fromThursday, values.toThursday, values.fromFriday, values.toFriday, values.fromSaturday, values.toSaturday, values.fromSunday, values.toSunday ];

    const result = await client.query(insertData, insertValues);

    const updateUserTable = 'UPDATE users SET time = $1 WHERE id = $2';
    const insertUser = [true, regId];
    const resultUser = await client.query(updateUserTable, insertUser);
    console.log(resultUser.rows);
    res.status(200).json({ message: 'Info added successfully', data: value }); 
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

module.exports.addTime_slot = async (req, res) => {
  console.log(req.body);

  try {
    const { selectedSlots } = req.body;
    const user_id = req.user.id;

    // Iterate over the selected slots and insert them into the database
    for (const day in selectedSlots) {
      if (selectedSlots.hasOwnProperty(day)) {
        const timeSlots = selectedSlots[day];
        for (const startTime of timeSlots) {
          const endTime = startTime + 1; // Assuming each slot is for an hour
          // Format start_time and end_time as 'HH:00:00'
          const formattedStartTime = `${startTime}:00:00`;
          const formattedEndTime = `${endTime}:00:00`;
          // Insert the time slot into the database
          const query = `
            INSERT INTO time_slots (user_id, day, start_time, end_time)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
          `;
          const values = [user_id, day, formattedStartTime, formattedEndTime];
          const result = await client.query(query, values);
                  }
      }
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

module.exports.getSelectedSlots = async (req, res) => {
  try {
    const user_id = req.user.id;
    const query = `
      SELECT day, TO_CHAR(start_time, 'HH24') AS start_hour
      FROM time_slots
      WHERE user_id = $1;
    `;
    const values = [user_id];
    const result = await client.query(query, values);

    const selectedSlots = {};
    result.rows.forEach((row) => {
      const { day, start_hour } = row;
      if (!selectedSlots[day]) {
        selectedSlots[day] = [];
      }
      selectedSlots[day].push(Number(start_hour)); // Convert start_hour to number
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





module.exports.deleteTime = async (req, res) => {    //delete the time
  try {
    const id = req.params.id;

    const deleteQuery = 'DELETE FROM tutor_time WHERE id = $1';
    const result = await client.query(deleteQuery, [id]);

    if (result) {
      return res.status(200).send("Record deleted successfully");
    } else {
      return res.status(404).send("Record not found");
    }
  } catch (err) {
    return res.status(500).send("Error deleting record");
  }
}

module.exports.updateTime = async (req, res) => { // update the time schedule
  try {
    const { value, course, price } = req.body;
    const regId = req.user.id;
    const qvalue="true"
    const checkQuery = 'SELECT * FROM tutor_time WHERE value = $1';
    const existingTime = await client.query(checkQuery, [value]);

    if (existingTime.rows.length === 0) {
      return res.status(404).json({ error: 'Time schedule not found' });
    }

    const updateData = 'UPDATE tutor_time SET course = $2, price = $3, WHERE value = $1 AND reg_id = $5 RETURNING *';
    const updateValues = [value, course, price, regId,];
    const result = await client.query(updateData, updateValues);

    res.status(200).json({ message: 'Time schedule updated successfully', result });
  } catch (error) {
    res.status(500).json({ error: 'Server error occurred' });
  }
}



module.exports.getSubject = async (req,res) =>{     // get the subject and price
  try{
   const regId = req.user.id;
   const query = 'SELECT * FROM tutor_time WHERE t_reg_id = $1';
   const result = await client.query(query, [regId]);
     res.status(200).json(result.rows);
   } catch (e) {
     res.status(400).send(e.message);
   }
 }
     
module.exports.addSubject = async (req,res) =>{      
  try {
    const { subject, language, minPrice, maxPrice} = req.body;
    console.log(subject, language, minPrice, maxPrice)
    const regId = req.user.id;
    console.log(regId)
    const insertData = 'INSERT INTO tutor_time (course,language,min_price,max_price,t_reg_id ) VALUES ($1,$2,$3,$4,$5) RETURNING *';
    const insertValue = [subject, language, minPrice, maxPrice,regId];
    const result = await client.query(insertData, insertValue);
    res.status(200).json({ message: 'Course added Successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Server error occurred' });
  }
}
  
    
module.exports.updateSubject = async (req, res) => {
  try {
    const { subject, language, minPrice, maxPrice } = req.body;
    const regId = req.user.id;
    const course_value=true;
    const updateData ='UPDATE tutor_time SET language = $1, min_price = $2, max_price = $3,  course = $4,course_value =$5 WHERE t_reg_id = $6 RETURNING *';
    const updateValues = [language, minPrice, maxPrice, subject,course_value, regId];
    const result = await client.query(updateData, updateValues);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json({ message: 'Course updated successfully' });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};



