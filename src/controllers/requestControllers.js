const {client} = require ('../db');
const value = require("../statusValues/status")

module.exports.addCourseRequest = async (req, res) => {
  try {
    const { comments,class_level,subject,price,s_reg_id,t_reg_id,id } = req.body;
    let status = value.RequestStatus.PENDING;
    const statusValue = "fill";
    const existingUserQuery = 'SELECT * FROM req_table WHERE s_reg_id = $1 AND c_id = $2';
    console.log(id);
    const existingUser = await client.query(existingUserQuery, [s_reg_id, id]);
    if (existingUser.rows.length > 0) {
      return res.status(200).send('Request already exists');
    }
    const time = "8:00 pm";
    const date = "22-02-2024";
    const insertData = 'INSERT INTO req_table (status, t_reg_id, s_reg_id, course_name,price,time,date,comments,level,c_id) VALUES ($1, $2, $3, $4,$5,$6,$7,$8,$9,$10) RETURNING *';
    const insertValues = [status, t_reg_id, s_reg_id, subject,price,time,date,comments,class_level,id];
    const result = await client.query(insertData, insertValues);

    const deleteQuery = 'DELETE FROM student_proposal WHERE id = $1 AND s_reg_id = $2 RETURNING *';
const valuesDelete = [id, s_reg_id];
const deleteresult = await client.query(deleteQuery, valuesDelete);

    

    return res.status(200).send('Request sent successfully');

    
  } catch (error) {
    res.status(500).json({ error: 'Server error occurred' });
    console.log(error);
  }
};

module.exports.getCourseRequest = async (req, res) => {
  try {
    const tRegId = req.user.id;
    const { searchTerm } = req.query;

    const decodedSearchTerm = Array.isArray(searchTerm)
      ? searchTerm.map((value) => decodeURIComponent(value))
      : decodeURIComponent(searchTerm);
    let baseQuery = `
      SELECT req_table.*, tutor_info.*, student_info.*
      FROM req_table
      INNER JOIN tutor_info ON req_table.t_reg_id = tutor_info.t_reg_id
      INNER JOIN student_info ON req_table.s_reg_id = student_info.s_reg_id
      WHERE req_table.t_reg_id = $1
    `;
    const params = [tRegId];
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




//update the request with status accept
module.exports.updateCourseRequest = async (req, res) => {    //update the req response 
  try {
    const { courseId, val } = req.body;
    
    const tRegId = req.user.id;
    const existingRequestQuery = 'SELECT * FROM req_table WHERE t_reg_id = $1 AND c_id = $2';
    const existingRequest = await client.query(existingRequestQuery, [tRegId, courseId]);
    if (existingRequest.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    let status = null;
    if (value.RequestStatus.ACCEPTED === val ) {
      status = 'accept';
    } else if (value.RequestStatus.COMPLETED === val) {
      status = 'complete';
    }  else {
      status = 'pending';
    }
    console.log(status)
    const query = 'UPDATE req_table SET status = $1 WHERE t_reg_id = $2 AND c_id = $3 RETURNING *';
    const values = [status, tRegId, courseId];
    const result = await client.query(query, values);
    res.status(200).json({ message: 'Request updated successfully', result });
  } catch (error) {
    res.status(500).json({ error: 'Server error occurred' });
  }
};

//reject the request
module.exports.deleteRecordById = async (req, res) => {
  try {
    const c_id = req.params.id;
    console.log(c_id);

    const query = 'DELETE FROM req_table WHERE c_id = $1 RETURNING *';
    const result = await client.query(query, [c_id]);

    if (result.rowCount === 1) {
      res.status(200).json({ message: 'Record deleted successfully.', deletedRecord: result.rows[0] });
    } else {
      res.status(404).json({ error: 'No Record Found.' });
    }
  } catch (error) {
    if (error.response) {
      console.error('Server responded with error status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else {
      console.error('Error setting up the request:', error.message);
    }
  }
}





  
    



