require('dotenv').config();
const jwt = require('jsonwebtoken');
const { client } = require('../db');

async function auth(req, res, next) {
  const tokenHeader = req.header('authorization');
  if (!tokenHeader) return res.status(400).send('Token Not Provided');
  const token = tokenHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const userId = decodedToken.id;

    const checkUserQuery = 'SELECT * FROM users WHERE id = $1';
    const checkUserValues = [userId];
    const userResult = await client.query(checkUserQuery, checkUserValues);
    req.user = userResult.rows[0];
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json('Token expired');
    }
    return res.status(401).json({ error: 'Invalid Token' });
  }

  next();
}

module.exports = auth;
