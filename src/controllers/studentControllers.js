const {client} = require('../db');

module.exports.singleStudentInfo = async (req, res) => { // get student info
  try {
    const userId = req.user.id;
    const query = 'SELECT * FROM student_info WHERE s_reg_id = $1';
    const result = await client.query(query, [userId]);
  res.status(200).json(result.rows);

  } catch (e) {
      res.status(500).send(e.message);
  }
};

module.exports.addNewStudent = async (req, res) => { //add student info
    try {
      const  s_fname = req.body.s_fname;
      const  s_city = req.body.s_city;
      const  s_lname = req.body.s_lname;
      const  s_gender = req.body.s_gender;
      const  s_number = req.body.s_number;
      const  s_address = req.body.s_address;
      const  coordinates = req.body.coordinates;

      const s_reg_id = req.user.id;
      const userQuery = 'SELECT * FROM student_info WHERE s_reg_id = $1';
      const existingUser = await client.query(userQuery, [s_reg_id]);
  
      if (existingUser.rows.length > 0) {
        return res.status(400).send('Data already exists');
      }
  
      const insertDataQuery = `INSERT INTO student_info (s_address, s_reg_id, s_lname, s_fname, s_city, s_gender, s_number,coordinates)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`;
  
      const insertDataValues = [s_address, s_reg_id, s_lname, s_fname, s_city, s_gender, s_number, coordinates];
      const result = await client.query(insertDataQuery, insertDataValues);
  
      const updateUserQuery = `
        UPDATE users
        SET persona = $1
        WHERE id = $2
        RETURNING *`;
  
      const updateUserValues = [true,s_reg_id];
      const updatedUser = await client.query(updateUserQuery, updateUserValues);
  
      res.status(201).json({ message: 'Data added successfully', data: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error occurred' });
    }
};

  module.exports.updateStudent = async (req, res) => { //update student info
    try {
      const { s_address, s_number, s_lname, s_fname, s_city, s_gender } = req.body;
      const s_reg_id = req.user.id;
      const userQuery = 'SELECT * FROM student_info WHERE s_reg_id = $1';
      const existingUser = await client.query(userQuery, [s_reg_id]);

      const insertDataQuery = 'UPDATE student_info SET s_address = $1, s_lname = $2, s_fname = $3, s_city = $4, s_gender = $5, s_numbe=$6 WHERE s_reg_id = $7 RETURNING *';
      const insertDataValues = [s_address, s_lname, s_fname, s_city, s_gender, s_number,s_reg_id];
      const result = await client.query(insertDataQuery, insertDataValues);
      res.status(201).json({ message: 'Data added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error occurred' });
    }
  };
    
module.exports.singleTutorInfo = async (req, res) => { //display all tutors on search screen and pagination, filters
      try {
        let { page, size, search } = req.query;
    
        if (!page) {
          page = 1;
        }
    
        if (!size) {
          size = 10;
        }
    
        const offset = (page - 1) * size;
    
        let filterConditions = [];
        let filterValues = [];
    
        if (req.query.subject) {
          filterConditions.push("tutor_info.subject = $" + (filterValues.length + 1));
          filterValues.push(req.query.subject);
        }
    
        if (req.query.gender) {
          filterConditions.push("tutor_info.t_gender = $" + (filterValues.length + 1));
          filterValues.push(req.query.gender);
        }
    
        if (req.query.rating) {
          filterConditions.push("reviews.rating = $" + (filterValues.length + 1));
          filterValues.push(req.query.rating);
        }
    
        if (req.query.price) {
          filterConditions.push("tutor_time.price = $" + (filterValues.length + 1));
          filterValues.push(req.query.price);
        }
        if (search) {
          filterConditions.push(`
            (
              tutor_info.t_name ILIKE $${filterValues.length + 1}
              OR tutor_info.t_lname ILIKE $${filterValues.length + 2}
              
            )
          `);
    
          filterValues.push(`%${search}%`);
          filterValues.push(`%${search}%`);
        }
    
        const filterClause = filterConditions.length > 0
          ? `WHERE ${filterConditions.join(" AND ")}`
          : "";
    
          const query = `
          SELECT tutor_info.*, reviews.*, qualify_info.*, img.ima AS image_data
          FROM tutor_info
          LEFT JOIN reviews ON tutor_info.t_reg_id = reviews.t_reg_id
          LEFT JOIN qualify_info ON tutor_info.t_reg_id = qualify_info.t_reg_id
          LEFT JOIN image img ON tutor_info.t_reg_id = img.use_id
          ${filterClause}
          ${filterValues.length > 0 ? `ORDER BY ${filterValues.map((_,index) => `$${index + 1}`).join(", ")} ASC` : "ORDER BY tutor_info.t_reg_id ASC"}
          OFFSET $${filterValues.length + 1}::bigint
          LIMIT $${filterValues.length + 2}::bigint
        `;
        const result = await client.query(query, [...filterValues, offset, size]);
        res.status(200).json(result.rows);
      } catch (e) {
        res.status(400).send(e.message);
      }
};
  
  
      module.exports.getTimes = async (req, res) => { //it will show the time table to this.addNewStudent, when student select any teacher to request
        try {
          const user_id = req.query.id;
          console.log(req.query.id)
          const query = `
            SELECT day, TO_CHAR(start_time, 'HH24') AS start_hour, value
            FROM time_slots
            WHERE user_id = $1;
          `;
          const values = [user_id];
          const result = await client.query(query, values);
      
          const selectedSlots = {};
          result.rows.forEach((row) => {
            const { day, start_hour, value } = row; // Destructure the value column
            if (!selectedSlots[day]) {
              selectedSlots[day] = [];
            }
            selectedSlots[day].push({ start_hour: Number(start_hour), value }); // Include value in the pushed object
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
      

      module.exports.addTime = async (req, res) => { //post req by student with status pending
        try {
          const t_reg_id = req.user.id;
          const { id, subject, clickedSlots } = req.body;
      
          const insertedRows = [];
          for (const slot of clickedSlots) {
            const [day, timeRange] = slot.split(' ');
            const [startTime, endTime] = timeRange.split(' - ')[0].split(':');
            const formattedStartTime = `${startTime}:00:00`;
            const formattedEndTime = `${endTime}:00:00`;
            
            const reqSlotQuery = `
              INSERT INTO reqslots (day, start_time, end_time, subject, t_reg_id, s_reg_id,status)
              VALUES ($1, $2, $3, $4, $5, $6,$7)
              RETURNING *  
            `;
            const reqSlotValues = [day, formattedStartTime, formattedEndTime, subject, id, t_reg_id,"pending"];
            const reqSlotResult = await client.query(reqSlotQuery, reqSlotValues);
            insertedRows.push(reqSlotResult.rows[0]);
      
            const updateTimeSlotQuery = `
              UPDATE time_slots
              SET value = true
              WHERE day = $1 AND start_time = $2;
            `;
            const updateTimeSlotValues = [day, formattedStartTime];
            await client.query(updateTimeSlotQuery, updateTimeSlotValues);
          }
      
          res.status(200).json(insertedRows);
        } catch (error) {
          console.error('Error:', error);
          res.status(500).json({ error: 'Server error occurred' });
        }
      };
      
      //represent in dashboard of student
      module.exports.getAllTimeSlots = async (req, res) => {
        try {
          const query = `
            SELECT 
                rs.day, 
                TO_CHAR(rs.start_time, 'HH24') AS start_hour, 
                rs.subject, 
                rs.t_reg_id,
                rs.status, -- Include the status variable from reqslots
                ti.*,
                img.ima AS image_data 
            FROM 
                reqslots rs
            JOIN 
                tutor_info ti ON rs.t_reg_id = ti.t_reg_id
            LEFT JOIN
                image img ON ti.t_reg_id = img.use_id
            WHERE 
                rs.s_reg_id = $1;
          `;
          const values = [req.user.id]; 
          const result = await client.query(query, values);
          
          const groupedData = result.rows.reduce((acc, row) => {
            const { day, start_hour, subject, t_reg_id, status, ...tutorInfo } = row;
            if (!acc.selectedSlots[day]) {
              acc.selectedSlots[day] = [];
            }
            acc.selectedSlots[day].push({ start_hour: Number(start_hour), subject, t_reg_id, status }); // Include status in selectedSlots
                        acc.tutorInfo = { ...acc.tutorInfo, [t_reg_id]: { ...tutorInfo, status } }; // Include status in tutorInfo
      
            return acc;
          }, { selectedSlots: {}, tutorInfo: {} });
      
          res.status(200).json({
            success: true,
            data: groupedData,
          });
        } catch (error) {
          console.error('Error:', error);
          res.status(500).json({ error: 'Server error occurred' });
        }
      };
      
      
      
      
      
      //useless routes till now
      module.exports.getTimeById = async (req, res) => {  
        const tRegId = req.body.tRegId;
        const sRegId = req.user.id;
        const query = 'SELECT * FROM reqSlots WHERE s_reg_id=$1'
        const result = await client.query(query,[tRegId]);
        res.status(200).json({ result: result.rows,sRegId:sRegId});
      }    

module.exports.getData = async (req, res) => {
  console.log("getdata")
    try {
      const tRegId = req.body.tRegId;       
      const query = `
      SELECT tutor_info.*, qualify_info.*
      FROM tutor_info
      JOIN qualify_info ON tutor_info.t_reg_id = qualify_info.t_reg_id
      WHERE tutor_info.t_reg_id = $1;
      `;
      const result = await client.query(query, [tRegId]);
      res.status(200).json({ rows: result.rows });
    } catch (e) {
      res.status(400).send(e.message);
    }
};