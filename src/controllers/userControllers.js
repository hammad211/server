const jwt = require('jsonwebtoken');
const config = require('config');
const {client} = require('../db');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const cache = {};

//refresh the token
module.exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    jwt.verify(refreshToken, config.get('jwtPrivateKey'), async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }

      // Fetch user data from the database based on the decoded information
      const userQuery = 'SELECT * FROM users WHERE id = $1';
      const userResult = await client.query(userQuery, [decoded.id]);

      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = userResult.rows[0];

      const newAccessToken = jwt.sign(
        { id: user.id, name: user.name },
        config.get('jwtPrivateKey'),
        { expiresIn: '24h' } 
      );
      console.log("token refresh successfully");
      return res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

//login member
module.exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log(req.body);
    const userQuery = 'SELECT * FROM users WHERE email = $1 AND roles = $2';
    const userResult = await client.query(userQuery, [email, role]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({message:'User do not Exist'});
    }

    const user = userResult.rows[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).send({message:'Invalid Password'});
    }

    const token = jwt.sign(
      { id: user.id, name: user.name },
      config.get('jwtPrivateKey'),
      { expiresIn: '24h' } 
    );

    

    return res.status(200).json({
      user: {
        email: user.email,
        name: user.name,
        id: user.id,
        role: user.roles,
        approve: user.approve
      },
      token: token,
      personalInfo:user.persona,
      qualifyInfo:user.qualify,
      image:user.image,
      image:user.image,
      time:user.time,
      approve: user.approve,
      message: 'Login successful',
    });
  } catch (error) {
    return res.status(500).send({message:'Server error occurred'});
  }
};

//add new member
module.exports.Signup = async (req, res) => {
  try {
    const { name, email, password, roles } = req.body;
    console.log(req.body);
    const value= "false";
    const persona= "false";
    const qualify= "false";
    const image= "false";
    const time=  "false";
    const roleQuery = 'SELECT * FROM users WHERE email = $1 AND roles = $2';
    const existing = await client.query(roleQuery, [email, roles]);

    if (existing.rows.length > 0) {
      return res.status(404).send({message:'User already exists'});
    }     
    else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const insertData = 'INSERT INTO users (name, email, password, roles,persona, qualify,image, time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
      const insertValue = [name, email, hashedPassword, roles, persona, qualify,image, time];
      const result = await client.query(insertData, insertValue);
      return res.status(201).json({ message: 'User created successfully' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error occurred' });
  }
};

//reset password
module.exports.resetPassword = async (req, res) => {    
  try {
    const query = "SELECT * FROM users";
    const result = await client.query(query);
      res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Server error occurred" });
  }
};

module.exports.resetPassword = async (req, res) => {    //forget password
  console.log("reset",req.body);
  try {
    const { resetEmail,roles,resetPassword } = req.body;

    const query = 'SELECT * FROM users WHERE email = $1 AND roles = $2';
    const values = [resetEmail,roles];
    const result = await client.query(query, values);

    if (result.rows.length > 0) {
      const hashedPassword = await bcrypt.hash(resetPassword, 10);
     const passwordQuery = 'UPDATE users SET password = $1 WHERE email = $2 AND roles = $3';
     const passwordValues = [hashedPassword, resetEmail, roles];
      await client.query(passwordQuery, passwordValues);
    } else {
     return res.status(404).send({message:'User not found'});
    }
      res.status(200).send({message:'Password reset successfully'});
  } catch (error) {
    res.status(500).json({ error: 'Server error occurred' });
  }
};

//find the user before reset the password
// module.exports.findUser = async (req, res) => {   
//   console.log(req.body);
//   try {
//     const {resetEmail, roles } = req.body;
//     const query = 'SELECT * FROM users WHERE email = $1 AND roles = $2';
//     const values = [resetEmail, roles];
//     const result = await client.query(query, values);

//     if (result.rows.length > 0) {
//       return res.status(200).send({message:'User exists'});
//     } else {
//       return res.status(404).send({message:'Account not found'});
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Server error occurred' });
//   }
// };

module.exports.findUser = async (req, res) => {
  console.log("finduser");
  try {
    const { resetEmail, roles } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Create JWT token with OTP, resetEmail, and roles
    const token = jwt.sign({ otp, resetEmail, roles }, config.get('jwtResetKey'), { expiresIn: '2m' });

    // Send email with JWT token included
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: 'hammad6991515@gmail.com',
        pass: 'ohzi lksp qwya lbjs'
      }
    });

    const mailOptions = {
      from: 'hammad6991515@gmail.com',
      to: resetEmail,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error:', error);
        return res.status(500).send({ message: 'Error sending email' });
      } else {
        console.log('Email sent:', info.response);
        return res.status(200).send({ message: 'User exists and email sent',storedOTP:otp, email: resetEmail, role: roles, token:token });
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Server error occurred' });
  }
};

// Match OTP with JWT Token
module.exports.matchOTP = (req, res) => {
  
  try {
    const { email, roles, otp,token } = req.body;
    jwt.verify(token, config.get('jwtResetKey'), (err, decoded) => {
      if (err) {
        console.error('Error:', err);
        return res.status(401).send({ message: 'Invalid token' });
      }

      // Extract data from decoded
      const { storedOTP: storedOTP, resetEmail, roles: storedRoles } = decoded;
      if (otp == storedOTP && email == resetEmail && roles == storedRoles) {
        return res.status(200).send({ message: 'Account Match' });
      } else {
        return res.status(404).send({ message: 'Account not found' });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Server error occurred' });
  }
};

