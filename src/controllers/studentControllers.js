const {client} = require('../db');
const moment = require('moment');

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
      const { s_fname,s_lname,s_gender,s_city,s_address,s_number, coordinates } = req.body;

      let  longitude = coordinates.longitude;
      let  latitude = coordinates.latitude;
      const s_reg_id = req.user.id;
      const userQuery = 'SELECT * FROM student_info WHERE s_reg_id = $1';
      const existingUser = await client.query(userQuery, [s_reg_id]);
  
      if (existingUser.rows.length > 0) {
        return res.status(400).send('Data already exists');
      }
  
      const insertDataQuery = `INSERT INTO student_info (s_address, s_reg_id, s_lname, s_fname, s_city, s_gender, s_number,longitude,latitude)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9)
        RETURNING *`;
  
      const insertDataValues = [s_address, s_reg_id, s_lname, s_fname, s_number,  s_gender,s_city, longitude,latitude];
      const result = await client.query(insertDataQuery, insertDataValues);
  
      const updateUserQuery = `
        UPDATE users
        SET persona = $1
        WHERE id = $2
        RETURNING *`;
  
      const updateUserValues = [true,s_reg_id];
      const updatedUser = await client.query(updateUserQuery, updateUserValues);
  
      res.status(201).json({ message: 'Data Added successfully', data: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error occurred' });
    }
};

module.exports.updateStudent = async (req, res) => { //update student info
  try {
    const { s_fname,s_lname,s_gender,s_city,s_address,s_number, coordinates } = req.body;
    let longitude = coordinates.longitude;
    let latitude = coordinates.latitude;
    const s_reg_id = req.user.id;
    const userQuery = 'SELECT * FROM student_info WHERE s_reg_id = $1';
    const existingUser = await client.query(userQuery, [s_reg_id]);

    const insertDataQuery = 'UPDATE student_info SET s_address = $1, s_lname = $2, s_fname = $3, s_city = $4, s_gender = $5, s_number=$6,longitude=$7,latitude=$8 WHERE s_reg_id = $9 RETURNING *';
    const insertDataValues = [s_gender, s_lname, s_fname, s_number, s_address, s_city,longitude,latitude,s_reg_id];
    const result = await client.query(insertDataQuery, insertDataValues);
    res.status(201).json({ message: 'Data added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};
    


const { cos, sin, sqrt, atan2 } = Math;
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function calculateDistance(lat1, lon1, lat2, lon2,t_id) {
  console.log(lat1, lon1, lat2, lon2)
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians( lon2 - lon1);
  const a =
    sin(dLat / 2) * sin(dLat / 2) +
    cos(toRadians(lat1)) * cos(toRadians(lat2)) * sin(dLon / 2) * sin(dLon / 2);
  const c = 2 * atan2(sqrt(a), sqrt(1 - a));
  const distance = R * c;
  console.log("distance",distance)
  return distance;
}

//get all coordinates of teacher and store in array
const getCoordinate = async (req, res) => {
  try {
    const query = 'SELECT latitude, longitude, t_reg_id FROM tutor_info';
    const result = await client.query(query);
    return result.rows;
  } catch (e) {
    res.status(500).send(e.message);
  }
}


// module.exports.singleTutorInfo = async (req, res) => {3
//   try {
//     let { page, size, search, range } = req.query;

//     if (!page) {
//       page = 1;
//     }

//     if (!size) {
//       size = 10;
//     }


//     const offset = (page - 1) * size;
//     const student_id = req.user.id;
//     let filterConditions = [];
//     let filterValues = [];

//     let paramIndex = 1;

//     if (req.query.subject) {
//       filterConditions.push(`tutor_info.subject LIKE '%' || $${paramIndex} || '%'`);
//       filterValues.push(req.query.subject);
//       paramIndex++; // Increment paramIndex for the next parameter
//     }

//     if (req.query.gender) {
//       filterConditions.push(`tutor_info.t_gender = $${paramIndex}`);
//       filterValues.push(req.query.gender);
//       paramIndex++;
//     }

//     if (req.query.rating) {
//       filterConditions.push(`reviews.rating = $${paramIndex}`);
//       filterValues.push(req.query.rating);
//       paramIndex++;
//     }

//     if (req.query.price) {
//       filterConditions.push(`tutor_info.price <= $${paramIndex}`);
//       filterValues.push(req.query.price);
//       paramIndex++;
//     }

//     const s_reg_id = req.user.id;

//     const studentCoordinatesQuery = `
//       SELECT latitude::float, longitude::float 
//       FROM student_info
//       WHERE s_reg_id = $1
//     `;

//     const studentCoordinatesResult = await client.query(studentCoordinatesQuery, [s_reg_id]);

//     if (studentCoordinatesResult.rows.length === 0) {
//       throw new Error('Student coordinates not found');
//     }

//     const { latitude: studentLatitude, longitude: studentLongitude } = studentCoordinatesResult.rows[0];

//     const tutorCoordinates = await getCoordinate();
    
//     const distanceResults = tutorCoordinates.map(tutor => ({
//       ...tutor,
//       distance_in_km: calculateDistance(
//         studentLatitude,
//         studentLongitude,
//         tutor.latitude,
//         tutor.longitude
//       )
//     }));

//     const filterClause = filterConditions.length > 0
//       ? `WHERE ${filterConditions.join(" AND ")}`
//       : "";

//           const subquery = `
//           SELECT t_reg_id
//           FROM reqslots
//           WHERE s_reg_id = $${paramIndex} AND status IN ('pending', 'accepted')
//         `;
//     const query = `
//     SELECT DISTINCT ON (tutor_info.t_reg_id) tutor_info.*, reviews.*, qualify_info.*, img.ima AS image_data,
//     CASE WHEN reqslot.t_reg_id IS NOT NULL THEN TRUE ELSE FALSE END AS matched_reqslot
//     FROM tutor_info
//     LEFT JOIN reviews ON tutor_info.t_reg_id = reviews.t_reg_id
//     LEFT JOIN qualify_info ON tutor_info.t_reg_id = qualify_info.t_reg_id
//     LEFT JOIN image img ON tutor_info.t_reg_id = img.use_id
//     LEFT JOIN (${subquery}) AS reqslot ON tutor_info.t_reg_id = reqslot.t_reg_id
//     ${filterClause}
//     ORDER BY tutor_info.t_reg_id ASC
//     OFFSET $${paramIndex + 1}::bigint
//     LIMIT $${paramIndex + 2}::bigint
//     `;

//     const result = await client.query(query, [...filterValues, parseInt(student_id), offset, size]);

//     result.rows.forEach(row => {
//     const matchingEntry = distanceResults.find(entry => entry.t_reg_id === row.t_reg_id);

//     if (matchingEntry) {
//       row.distance = matchingEntry.distance_in_km;
//   }
// });
// if (req.query.distance) {
//   const rowsToSendToFrontend = result.rows.filter(row => row.distance >= req.query.distance);
//   res.status(200).json(rowsToSendToFrontend);
// }
// else {
//   res.status(200).json(result.rows);
// }



//   } catch (e) {
//     console.error(e.message);
//     res.status(400).send(e.message);
//   }
// };


module.exports.singleTutorInfo = async (req, res) => {
  try {
    let { page, size, subject, gender, rating, price, distance, search } = req.query;
    page = page || 1;
    size = size || 10;

    const offset = (page - 1) * size;
    const student_id = req.user.id;
    let filterConditions = [];
    let filterValues = [];

    let paramIndex = 1;

    if (subject) {
      filterConditions.push(`tutor_info.subject LIKE '%' || $${paramIndex} || '%'`);
      filterValues.push(subject);
      paramIndex++;
    }

    if (gender) {
      filterConditions.push(`tutor_info.t_gender = $${paramIndex}`);
      filterValues.push(gender);
      paramIndex++;
    }

    if (price) {
      filterConditions.push(`tutor_info.price <= $${paramIndex}`);
      filterValues.push(price);
      paramIndex++;
    }

    if (search) {
      filterConditions.push(`LOWER(CONCAT(tutor_info.t_name, ' ', tutor_info.t_lname)) LIKE LOWER('%' || $${paramIndex} || '%')`);
      filterValues.push(search);
      paramIndex++;
    }
    
    const s_reg_id = req.user.id;

    const studentCoordinatesQuery = `
      SELECT latitude::float, longitude::float 
      FROM student_info
      WHERE s_reg_id = $1
    `;

    const studentCoordinatesResult = await client.query(studentCoordinatesQuery, [s_reg_id]);

    if (studentCoordinatesResult.rows.length === 0) {
      throw new Error('Student coordinates not found');
    }

    const { latitude: studentLatitude, longitude: studentLongitude } = studentCoordinatesResult.rows[0];

    const tutorCoordinates = await getCoordinate();

    const distanceResults = tutorCoordinates.map(tutor => ({
      ...tutor,
      distance_in_km: calculateDistance(
        studentLatitude,
        studentLongitude,
        tutor.latitude,
        tutor.longitude
      )
    }));

    const filterClause = filterConditions.length > 0
      ? `WHERE ${filterConditions.join(" AND ")}`
      : "";

    const subquery = `
      SELECT t_reg_id
      FROM reqslots
      WHERE s_reg_id = $${paramIndex} AND status IN ('pending', 'accepted')
    `;
    paramIndex++;

    const reviewsCTE = `
      WITH reviews_agg AS (
        SELECT 
          t_reg_id,
          json_agg(json_build_object(
            'id', id,
            'comment', comment,
            'rating', rating
          )) AS reviews,
          AVG(rating::numeric) AS average_rating
        FROM reviews
        GROUP BY t_reg_id
      )
    `;

    const query = `
      ${reviewsCTE}
      SELECT 
        tutor_info.*,
        qa.*,
        img.ima AS image_data,
        ra.reviews,
        ra.average_rating,
        CASE WHEN reqslot.t_reg_id IS NOT NULL THEN TRUE ELSE FALSE END AS matched_reqslot
      FROM tutor_info
      LEFT JOIN qualify_info qa ON tutor_info.t_reg_id = qa.t_reg_id
      LEFT JOIN image img ON tutor_info.t_reg_id = img.use_id
      LEFT JOIN (${subquery}) AS reqslot ON tutor_info.t_reg_id = reqslot.t_reg_id
      LEFT JOIN reviews_agg ra ON tutor_info.t_reg_id = ra.t_reg_id
      ${filterClause}
      ORDER BY tutor_info.t_reg_id ASC
      OFFSET $${paramIndex}::bigint
      LIMIT $${paramIndex + 1}::bigint
    `;

    const result = await client.query(query, [...filterValues, s_reg_id, offset, size]);

    const filteredRows = result.rows.filter(row => {
      const matchingEntry = distanceResults.find(entry => entry.t_reg_id === row.t_reg_id);
      if (matchingEntry) {
        row.distance = matchingEntry.distance_in_km;
      }
      return !distance || row.distance <= distance;
    });

    if (rating) {
      const ratingFilteredRows = filteredRows.filter(row => row.average_rating <= rating);
      res.status(200).json(ratingFilteredRows);
    } else {
      res.status(200).json(filteredRows);
    }

  } catch (e) {
    console.error(e.message);
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
      

      const parseDate = (dateString) => {
        const [day, datePart, timeRange] = dateString.split(' ');
        const [date, month, year] = datePart.split('-');
        const formattedDate = `${year}-${month}-${date}`;
        return moment(formattedDate + ' ' + timeRange.split('-')[0], 'YYYY-MM-DD HH:mm').format();
      };
      
      module.exports.addTime = async (req, res) => {
        try {
          let courseId = 1;
          
          // Query to get the maximum c_id from reqslots
          const maxIdQuery = 'SELECT MAX(c_id) AS max_c_id FROM reqslots';
          const maxIdResult = await client.query(maxIdQuery);
      
          if (maxIdResult.rows.length > 0 && maxIdResult.rows[0].max_c_id !== null) {
            courseId = maxIdResult.rows[0].max_c_id + 1;
          }
      
          const s_reg_id = req.user.id;
          console.log(req.body)
          const { id, subject, clickedSlots } = req.body;
      
          const insertedRows = [];
      
          for (const slot of clickedSlots) {
            const [day, date, timeRange] = slot.split(' ');
      
            const formattedDate = parseDate(slot); // Ensure you have a parseDate function defined
      
            const reqSlotQuery = `
              INSERT INTO reqslots (day, time_date, start_time, end_time, subject, t_reg_id, s_reg_id, status, c_id)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
              RETURNING *;
            `;
      
            const reqSlotValues = [day, formattedDate, timeRange.split('-')[0], timeRange.split('-')[1], subject, id, s_reg_id, "pending", courseId];
            const reqSlotResult = await client.query(reqSlotQuery, reqSlotValues);
      
            insertedRows.push(reqSlotResult.rows[0]);
      
            const updateTimeSlotQuery = `
              UPDATE time_slots
              SET value = true
              WHERE day = $1 AND start_time = $2;
            `;
            
            const updateTimeSlotValues = [day, timeRange.split('-')[0]];
            await client.query(updateTimeSlotQuery, updateTimeSlotValues);
          }
      
          res.status(200).json(insertedRows);
        } catch (error) {
          console.error('Error:', error);
          res.status(500).json({ error: 'Server error occurred' });
        }
      };
      
      
      
    // represent in dashboard of student  
    module.exports.getAllTimeSlots = async (req, res) => {
      console.log("getAllTimeSlots");
      try {
          const { status } = req.params;
          let query = `
    SELECT 
        rs.day, 
        TO_CHAR(rs.start_time, 'HH24') AS start_hour, 
        rs.subject, 
        rs.t_reg_id,
        rs.status,
        ti.*,
        img.ima AS image_data 
    FROM 
        reqslots rs
    JOIN 
        tutor_info ti ON rs.t_reg_id = ti.t_reg_id
    LEFT JOIN
        image img ON ti.t_reg_id = img.use_id
    WHERE 
        rs.s_reg_id = $1 AND (rs.status = 'pending' OR rs.status = 'accepted');
     `;

          const values = [req.user.id];
          const result = await client.query(query,values);
  
          const groupedData = result.rows.reduce((acc, row) => {
          const { day, start_hour, subject, t_reg_id, status, ...tutorInfo } = row;

            if (!acc.selectedSlots[day]) {
                acc.selectedSlots[day] = [];
            }
            acc.selectedSlots[day].push({ start_hour: Number(start_hour), subject, t_reg_id, status }); // Include status in selectedSlots
            acc.tutorInfo = { ...acc.tutorInfo, [t_reg_id]: { ...tutorInfo, status, t_reg_id } }; // Include status and t_reg_id in tutorInfo
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
  
  

module.exports.getAllTimeSlots3 = async (req, res) => {
  try {
    console.log("getAllTimeSlots3", req.user.id);

    const s_reg_id = req.user.id;

    // Fetch reviews based on s_reg_id
    const reviewQuery = `
      SELECT * FROM reqs_handling WHERE s_reg_id = $1;
    `;
    const reviewValues = [s_reg_id];
    const reviewResult = await client.query(reviewQuery, reviewValues);
    const reviews = reviewResult.rows;

    // Fetch slots and tutor info based on s_reg_id
    const query = `
      SELECT 
        rs.day, 
        TO_CHAR(rs.start_time, 'HH24') AS start_hour, 
        rs.subject, 
        rs.s_reg_id AS s_reg_id,
        rs.status,
        rs.c_id,
        ti.t_name,
        ti.t_lname,
        ti.t_gender,
        ti.t_address,
        ti.t_reg_id,
        ti.price,
        img.ima AS image_data
      FROM 
        reqslots rs
      JOIN 
        (SELECT DISTINCT ON (t_reg_id) t_reg_id, t_name, t_lname, t_gender, t_address, price FROM tutor_info) ti
      ON rs.t_reg_id = ti.t_reg_id
      JOIN
        image img ON rs.t_reg_id = img.use_id
      WHERE 
        rs.s_reg_id = $1;
    `;

    const values = [s_reg_id];
    const result = await client.query(query, values);

    let groupedData = {
      selectedSlots: {
        pending: [],
        accepted: [],
        completed: []
      },
      tutorInfo: {
        pending: [],
        accepted: [],
        completed: []
      }
    };

    let requestCounts = { accepted: 0, pending: 0, completed: 0 };

    let uniqueTutorCIds = { pending: new Set(), accepted: new Set(), completed: new Set() };

    result.rows.forEach(row => {
      const { day, start_hour, subject, t_reg_id, status, image_data, s_reg_id, c_id, ...tutorInfo } = row;
      const slot = {
        start_hour: Number(start_hour),
        day,
        subject,
        t_reg_id,
        status,
        s_reg_id,
        c_id
      };

      groupedData.selectedSlots[status].push(slot);

      if (!uniqueTutorCIds[status].has(c_id)) {
        uniqueTutorCIds[status].add(c_id);

        // Add review data to the tutorInfo object
        const reviewData = reviews.find(review => review.c_id === c_id); // Ensure c_id is unique in review data
        groupedData.tutorInfo[status].push({ ...tutorInfo, c_id, t_reg_id, image_data, status, s_reg_id, reviewData });
        requestCounts[status]++;
      }
    });

    // Handle counting of accepted requests
    result.rows.forEach(row => {
      const { status, c_id } = row;
      if (status === 'accepted' && !uniqueTutorCIds.accepted.has(c_id)) {
        requestCounts.accepted++;
      }
    });

    console.log(groupedData);
    console.log(requestCounts);

    res.status(200).json({
      success: true,
      data: groupedData,
      requestCounts: requestCounts
    });
  } catch (error) {
    console.error('Error:', error);
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

module.exports.getData = async (req, res) => {
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