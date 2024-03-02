const {client} = require('../db');

module.exports.addNewReview = async (req, res) => {    //add new tutor
  
  try {
    const comment = req.body.values.comment;
    const rating = req.body.values.ratting;
    const reviewId = req.body.tRegId.tRegId;
    const sRegId = req.user.id;
    const courseId = req.body.tRegId.cId;
    const insertData = 'INSERT INTO reviews ( s_reg_id, t_reg_id, comment, rating,c_id ) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const insertValue = [sRegId,reviewId, comment, rating, courseId];
    const result = await client.query(insertData, insertValue);
    res.status(201).send('review added successfully');

  } catch (error) {
    res.status(500).json({ error: 'Server error occurred' });
    console.log(error);
  }
};

module.exports.getReviews = async (req, res) => {
  try {
    const tRegId = req.user.id;
    const query = 'SELECT * FROM reviews WHERE t_reg_id = $1';
    const result = await client.query(query, [tRegId]);
    let reviewed=true;
    if (result.rows.length > 0) {
      res.status(200).json( result.rows, reviewed );
      
    } else {
      res.status(404).json({ message: 'request  not found'});
    }
  } catch (e) {
    res.status(500).json({ error: 'Server error occurred' });
  }
};

module.exports.getReviewsStudent = async (req, res) => {
  try {
    const sRegId = req.user.id;
    const query = 'SELECT * FROM reviews WHERE s_reg_id = $1';
    const result = await client.query(query, [sRegId]);
    let reviewed=true;
    if (result.rows.length > 0) {
      res.status(200).json({ result: result.rows, reviewed });
      
    } else {
      res.status(404).json({ message: 'no response found'});
    }
  } catch (e) {
    res.status(500).json({ error: 'Server error occurred' });
  }
};

















  
    



