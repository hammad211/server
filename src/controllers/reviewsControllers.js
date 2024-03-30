const {client} = require('../db');

module.exports.addNewReview = async (req, res) => {    //add new tutor
  
  try {
    const comment = req.body.comment;
    const rating = req.body.ratting;
    const reviewId = req.body.tRegId;
    const sRegId = req.user.id;
    const insertData = 'INSERT INTO reviews ( s_reg_id, t_reg_id, comment, rating ) VALUES ($1, $2, $3, $4) RETURNING *';
    const insertValue = [sRegId,reviewId, comment, rating];
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

















  
    



