const {client} = require('../db');

module.exports.addProposal = async (req, res) => {
  try {
    const comments = req.body.values.comments;
    const subject = req.body.values.subject;
    const price = req.body.values.price;
    const classLevel = req.body.values.currentClass;
    const tRegId = req.body.values.id;
    const sRegId = req.user.id;
    // Check if the proposal already exists
    const checkQuery =
      'SELECT * FROM student_proposal WHERE t_reg_id = $1 AND subject = $2';
    const checkValues = [tRegId, subject];
    const checkResult = await client.query(checkQuery, checkValues);

    if (checkResult.rows.length > 0) {
      // Proposal with the same t_reg_id and subject already exists
      return res.status(400).json(
       'your proposal for this subject already exists.'
      );
    }

    const insertData =
      'INSERT INTO student_proposal (subject, comments, class_level, s_reg_id, t_reg_id, price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const insertValue = [subject, comments, classLevel, sRegId, tRegId, price];
    const result = await client.query(insertData, insertValue);

    res.status(201).send('Request added successfully');
  } catch (error) {
    res.status(500).json({ error: 'Server error occurred' });
    console.log(error);
  }
};

module.exports.getProposal = async (req, res) => {
  try {
    const tRegId = req.user.id;
    const { searchTerm } = req.query;
    console.log(req.query);
    // Decode the search term
    const decodedSearchTerm = Array.isArray(searchTerm)
      ? searchTerm.map((value) => decodeURIComponent(value))
      : decodeURIComponent(searchTerm);

    let baseQuery = `
      SELECT tp.*, si.*                         
      FROM student_proposal tp
      JOIN student_info si ON tp.s_reg_id = si.s_reg_id
      WHERE tp.t_reg_id = $1
    `;

    // Initialize parameters array with the teacher's registration ID
    const params = [tRegId];

    // Add filtering conditions if a search term is provided
    if (decodedSearchTerm && decodedSearchTerm.trim() !== '') {
      baseQuery += `
        AND (si.s_fname ILIKE $2 OR tp.subject ILIKE $2)
      `;

      // Add the decoded search term to the parameters array
      params.push(`%${decodedSearchTerm}%`);
    }

    const result = await client.query(baseQuery, params);


    if (result.rows.length > 0) {
      res.status(200).json({ result: result.rows });
    } else {
      res.status(404).json({ error: 'No proposals found for the user' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

module.exports.getProposalStudent = async (req, res) => {
  try {
    const id = req.user.id;
    const query = 'SELECT * FROM student_proposal WHERE s_reg_id = $1';
    const result = await client.query(query, [id]);
    if (result.rows.length > 0) {
      res.status(200).json( result.rows );
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

















  
    



