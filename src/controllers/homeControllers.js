const {client} = require('../db');



module.exports.getReview = async (req, res) => { //get reviews on home page
    try {
      const query = `SELECT 
      si.s_fname, 
      si.s_lname, 
      im.ima,
      r.comment,
      r.rating
  FROM 
      reviews r
  JOIN 
      student_info si ON r.s_reg_id = si.s_reg_id
  JOIN 
      image im ON r.t_reg_id = im.use_id`;

      const result = await client.query(query);
      res.status(200).json(result.rows);
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
  
 