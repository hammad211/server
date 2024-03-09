const {client} = require('../db');

module.exports.singleStudentInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const query = 'SELECT * FROM student_info WHERE s_reg_id = $1';
    const result = await client.query(query, [userId]);
  res.status(200).json(result.rows);

  } catch (e) {
      res.status(500).send(e.message);
  }
};

  module.exports.addNewStudent = async (req, res) => {
    try {
      const  s_fname = req.body.s_fname;
      const  s_city = req.body.s_city;
      const  s_lname = req.body.s_lname;
      const  s_gender = req.body.s_gender;
      const  s_number = req.body.s_number;
      const  s_address = req.body.s_address;
      const s_reg_id = req.user.id;
      const userQuery = 'SELECT * FROM student_info WHERE s_reg_id = $1';
      const existingUser = await client.query(userQuery, [s_reg_id]);
  
      if (existingUser.rows.length > 0) {
        return res.status(400).send('Data already exists');
      }
  
      const insertDataQuery = `INSERT INTO student_info (s_address, s_reg_id, s_lname, s_fname, s_city, s_gender, s_number)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`;
  
      const insertDataValues = [s_address, s_reg_id, s_lname, s_fname, s_city, s_gender, s_number];
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

  module.exports.updateStudent = async (req, res) => {
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
  
  module.exports.getData = async (req, res) => {
      try {
        const tRegId = req.body.tRegId; // Assuming  send t_reg_id in the request body        
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

    
    module.exports.singleTutorInfo = async (req, res) => {
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
          filterConditions.push(`$1 = ANY(tutor_time.course)`);
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
          // Add conditions to search in multiple fields
          filterConditions.push(`
            (
              tutor_info.t_name ILIKE $${filterValues.length + 1}
              OR tutor_info.t_lname ILIKE $${filterValues.length + 2}
              OR tutor_time.course ILIKE $${filterValues.length + 3}
              -- Add more fields as needed
            )
          `);
    
          // Add the search term for each field
          filterValues.push(`%${search}%`);
          filterValues.push(`%${search}%`);
          filterValues.push(`%${search}%`);
        }
    
        const filterClause = filterConditions.length > 0
          ? `WHERE ${filterConditions.join(" AND ")}`
          : "";
    
        const query = `
          SELECT tutor_info.*, tutor_time.*, reviews.*
          FROM tutor_info
          LEFT JOIN tutor_time ON tutor_info.t_reg_id = tutor_time.t_reg_id
          LEFT JOIN reviews ON tutor_info.t_reg_id = reviews.t_reg_id
          ${filterClause}
          ${filterValues.length > 0 ? `ORDER BY ${filterValues.map((_, index) => `$${index + 1}`).join(", ")} ASC` : "ORDER BY tutor_info.t_reg_id ASC"}
          OFFSET $${filterValues.length + 1}::bigint
          LIMIT $${filterValues.length + 2}::bigint
        `;
    
        console.log(query);
        const result = await client.query(query, [...filterValues, offset, size]);
        console.log(result.rows)
        res.status(200).json(result.rows);
      } catch (e) {
        res.status(400).send(e.message);
      }
    };
    

    module.exports.getQualifyInfo = async (req,res) =>{  //at student side we want to show the information so that student see and contact them
      try {
        const query = 'SELECT * FROM qualify_info';
        const result = await client.query(query);
          res.status(200).json(result.rows);
        } catch (e) {
          res.status(400).send(e.message);
        }
    };
    
    
    module.exports.getTime = async (req, res) => {   /// it will show the all teacher courses to every student who authenticate but dont do any request to teacher
        const t_reg_id = req.params.id;
        const query = 'SELECT * FROM tutor_time WHERE t_reg_id = $1';
        const result = await client.query(query, [tRegId]);

        res.status(200).json({ result: result.rows});
      } 
    
      module.exports.getCourseRequest = async (req, res) => {
        try {
          const sRegId = req.user.id;
          const { searchTerm } = req.query;
      
          const decodedSearchTerm = Array.isArray(searchTerm)
            ? searchTerm.map((value) => decodeURIComponent(value))
            : decodeURIComponent(searchTerm);
      
          let baseQuery = `
            SELECT req_table.*, student_info.*, tutor_info.*
            FROM req_table
            INNER JOIN student_info ON req_table.s_reg_id = student_info.s_reg_id
            INNER JOIN tutor_info ON req_table.t_reg_id = tutor_info.t_reg_id
            WHERE req_table.s_reg_id = $1
          `;
      
          const params = [sRegId];
      
          if (decodedSearchTerm && decodedSearchTerm.trim() !== '') {
            baseQuery += `
              AND (tutor_info.t_name ILIKE $2 OR student_info.s_fname ILIKE $2 OR req_table.course_name ILIKE $2)
            `;
      
            params.push(`%${decodedSearchTerm}%`);
          }
      
          console.log('Generated SQL query:', baseQuery);
          console.log('Parameters:', params);
      
          const result = await client.query(baseQuery, params);
      
          console.log('Query result:', result.rows);
      
          if (result.rows.length > 0) {
            res.status(200).json({ result: result.rows });
          } else {
            res.status(404).json({ error: 'No course requests found for the user' });
          }
        } catch (e) {
          console.error(e);
          res.status(500).json({ error: 'Server error occurred' });
        }
      };
      
      
    module.exports.getTimeById = async (req, res) => {  
        const tRegId = req.body.tRegId;
        const sRegId = req.user.id;
        const query = 'SELECT * FROM reqSlots WHERE s_reg_id=$1'
        const result = await client.query(query,[tRegId]);
        res.status(200).json({ result: result.rows,sRegId:sRegId});
      }    


      module.exports.getTimes = async (req, res) => {
        try {
          console.log(req.query)
          const user_id = req.query.id;
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
            selectedSlots[day].push(Number(start_hour)); 
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

      module.exports.addTime = async (req, res) => {
        try {
          console.log(req.body);
          const t_reg_id = req.user.id;
          const { id, subject, clickedSlots } = req.body;
      
          const insertedRows = [];
          for (const slot of clickedSlots) {
            const [day, timeRange] = slot.split(' ');
            const [startTime, endTime] = timeRange.split(' - ')[0].split(':');
            const formattedStartTime = `${startTime}:00:00`;
            const formattedEndTime = `${endTime}:00:00`;
      
            // Insert data into reqslots table
            const reqSlotQuery = `
              INSERT INTO reqslots (day, start_time, end_time, subject, t_reg_id, s_reg_id)
              VALUES ($1, $2, $3, $4, $5, $6)
              RETURNING *;
            `;
            const reqSlotValues = [day, formattedStartTime, formattedEndTime, subject, id, t_reg_id];
            const reqSlotResult = await client.query(reqSlotQuery, reqSlotValues);
            insertedRows.push(reqSlotResult.rows[0]);
      
            // Update time_slot table
            const updateTimeSlotQuery = `
              UPDATE time_slots
              SET value = true
              WHERE day = $1 AND start_time = $2;
            `;
            const updateTimeSlotValues = [day, formattedStartTime];
            await client.query(updateTimeSlotQuery, updateTimeSlotValues);
          }
      
          // Return the array of inserted rows
          res.status(200).json(insertedRows);
        } catch (error) {
          console.error('Error:', error);
          res.status(500).json({ error: 'Server error occurred' });
        }
      };
      
      
      module.exports.getAllTimeSlots = async (req, res) => {
        try {
          const query = `
            SELECT 
              rs.day, 
              TO_CHAR(rs.start_time, 'HH24') AS start_hour, 
              rs.subject, 
              rs.t_reg_id,
              ti.*  
            FROM 
              reqslots rs
            JOIN 
              tutor_info ti ON rs.t_reg_id = ti.t_reg_id
            WHERE 
              rs.s_reg_id = $1;
          `;
          const values = [req.user.id]; 
          const result = await client.query(query, values);
          
          const groupedData = result.rows.reduce((acc, row) => {
            const { day, start_hour, subject, t_reg_id, ...tutorInfo } = row;
            if (!acc.selectedSlots[day]) {
              acc.selectedSlots[day] = [];
            }
            acc.selectedSlots[day].push({ start_hour: Number(start_hour), subject, t_reg_id }); 
      
            // Push tutorInfo separately
            acc.tutorInfo = { ...acc.tutorInfo, [t_reg_id]: tutorInfo };
      
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
      
      
      
      
      
      