const {client} = require('../db');

module.exports.addNewReview = async (req, res) => {
  try {
    const comment = req.body.comments;
    const rating = req.body.rating;
    const tRegId = req.body.tRegId;
    let courseId = 1;

    const query = 'SELECT MAX(c_id) AS max_c_id FROM reqslots';
    await client.query(query, (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Server error occurred' });
      }
      
      if (results.rows.length > 0) {
        const maxCId = results.rows[0].max_c_id;
        console.log(maxCId)
        courseId = maxCId + 1;
        console.log("courseId",courseId)
      }
      
      const sRegId = req.user.id;
      const insertData = 'INSERT INTO reviews (s_reg_id, t_reg_id, comment, rating, c_id) VALUES ($1, $2, $3, $4, $5) RETURNING *';
      const insertValue = [sRegId, tRegId, comment, rating, courseId];
      
      client.query(insertData, insertValue, (error, result) => {
        if (error) {
          console.error('Error executing insertion query:', error);
          return res.status(500).json({ error: 'Server error occurred' });
        }
        res.status(201).send('Review added successfully');
      });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};


module.exports.getReviews = async (req, res) => {
  try {
    const query = 'SELECT * FROM reviews WHERE s_reg_id=$1 OR t_reg_id=$1';
    const result = await client.query(query, [req.user.id]);
    if (result.rows.length > 0) {
      let totalRatings = 0;
      result.rows.forEach(review => {
        totalRatings += review.rating;
      });
      const averageRating = totalRatings / result.rows.length;
      
      res.status(200).json({ reviews: result.rows, averageRating });
    } else {
      res.status(200).json({ message: 'Reviews not found', averageRating: 0 });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: 'Server error occurred' });
  }
};


module.exports.getReviewsStudent = async (req, res) => {
  try {
    const sRegId = req.user.id;
    const query = 'SELECT * FROM reviews WHERE s_reg_id = $1 OR t_reg_id= $2';
    const result = await client.query(query, [req.user.id]);
    let reviewed=true;
    if (result.rows.length > 0) {
      res.status(200).json({ result: result.rows });
      
    } else {
      res.status(404).json({ message: 'no response found'});
    }
  } catch (e) {
    res.status(500).json({ error: 'Server error occurred' });
  }
};

















  
    



