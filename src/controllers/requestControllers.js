const {client} = require ('../db');
const value = require("../statusValues/status")


module.exports.updateCourseRequest = async (req, res) => { // update req by teacher with status accepted
  try {
    const t_reg_id = req.user.id;
    const { matchedSlots, studentId } = req.body;

    for (const day in matchedSlots) {
      for (const slotId of matchedSlots[day]) {
        const updateTimeSlotQuery = `
          UPDATE reqslots
          SET status = 'accepted'
          WHERE s_reg_id = $1 AND t_reg_id = $2;
        `;
        const updateTimeSlotValues = [studentId, t_reg_id];
        await client.query(updateTimeSlotQuery, updateTimeSlotValues);
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

module.exports.getCourseRequest = async (req, res) => { // Showing student request on teacher side
  try {
    console.log("called12");

    const t_reg_id = req.user.id;
    const query = `
      SELECT 
        rs.day, 
        TO_CHAR(rs.start_time, 'HH24') AS start_hour, 
        rs.subject, 
        rs.t_reg_id AS t_reg_id,
        rs.status, -- Include the status column from the database
        si.*, 
        img.ima AS image_data
      FROM 
        reqslots rs
      JOIN 
        student_info si ON rs.s_reg_id = si.s_reg_id
      JOIN
        image img ON rs.t_reg_id = img.use_id
      WHERE 
        rs.t_reg_id = $1;
    `;

    const values = [t_reg_id]; 
    const result = await client.query(query, values);
    
    const groupedData = result.rows.reduce((acc, row) => {
      const { day, start_hour, subject, t_reg_id, status, ima, ...studentInfo } = row;
      if (!acc.selectedSlots[day]) {
        acc.selectedSlots[day] = [];
      }
      acc.selectedSlots[day].push({ start_hour: Number(start_hour), subject, t_reg_id, status }); 
  
      acc.studentInfo = { ...acc.studentInfo, [t_reg_id]: { ...studentInfo, t_id:t_reg_id, ima, status } };
      return acc;
    }, { selectedSlots: {}, studentInfo: {} });
  
    res.status(200).json({
      success: true,
      data: groupedData,
    });
  } catch (error) {
    console.error('Error:', error);
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





  
    



