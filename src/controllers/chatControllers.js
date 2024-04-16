const {client} = require('../db');

module.exports.getConversationId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const query = `
    SELECT c.id AS conversation_id, u.id AS user_id, u.email, u.name AS name
    FROM conversations AS c
    JOIN users AS u ON u.id = ANY(c.members) AND u.id != $1
    WHERE $1 = ANY(c.members);
    `;
    const result = await client.query(query, [userId]);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).send('Server error occurred');
  }
};


//useless
// module.exports.postConversation = async (req, res) => {
//   // console.log(id);
//   console.log("chat",req.body);
//   try {
//     const { sRegId,tRegId  } = req.body;
//     console.log(req.body);
//     console.log(sRegId,tRegId);
//     const insertData = 'INSERT INTO conversations (members) VALUES (ARRAY[$1::integer, $2::integer]) RETURNING *';
//     const insertValues = [tRegId, sRegId];
//     const result = await client.query(insertData, insertValues);
//     console.log(result);
//     res.status(200).send("Conversation created successfully");
//   } catch (err) {
//     res.status(500).send("Server error occurred");
//   }
// };


module.exports.postMessage = async (req, res) => {
  try {
    const { conversation_id, sender_id, messages, receiver_id, formattedTime, formattedDate } = req.body;

    if (!sender_id || !messages) {
      return res.status(400).send("Please fill all required fields.");
    }

    // Convert the formattedDate to the PostgreSQL date format 'YYYY-MM-DD'
    const [day, month, year] = formattedDate.split('/');
    const date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

    // Convert the formattedTime to the PostgreSQL time format 'HH:MM:SS'
    const time = new Date(`2000-01-01 ${formattedTime}`).toISOString().substr(11, 8);

    if (conversation_id && receiver_id) {
      const conversationExists = await client.query('SELECT id FROM conversations WHERE id = $1', [conversation_id]);
      if (!conversationExists.rows.length) {
        return res.status(400).send("The conversation doesn't exist.");
      }

      const newMessageQuery = 'INSERT INTO messages (conversation_id, sender_id, receiver_id, messages, time_value, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
      const insertValues = [conversation_id, sender_id, receiver_id, messages, time, date];
      const result = await client.query(newMessageQuery, insertValues);

      return res.status(200).json({ message: "Message sent successfully"});
    } else {
      return res.status(400).send("Conversation ID and Receiver ID are required.");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error occurred");
  }
};


module.exports.getMessage = async (req, res) => {
  try {
    const conversation_id = req.params.conversation_id;
    const messages = await client.query('SELECT * FROM messages WHERE conversation_id = $1', [conversation_id]);
    if(messages.rows.length === 0){
      res.status(200).json([{ conversation_id: conversation_id , message: "" }]);
    }
    else {
    const messageUserData = await Promise.all(messages.rows.map(async (message) => {
      const user = await client.query('SELECT * FROM users WHERE id = $1', [message.receiver_id]);
      return {
        user: { receive: user.rows[0].id, email: user.rows[0].email, name: user.rows[0].name },
        message: message.messages,
        conversation_id : conversation_id,
        time:message.time_value,
        date:message.date
      };
    }
    ));

    res.status(200).json(messageUserData);
  }
  } catch (error) {
    res.status(500).send("Server error occurred");
  }
};


module.exports.getUsers= async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await client.any('SELECT * FROM ' + usersTable + ' WHERE id != $1', [userId]);
    const userData = await Promise.all(user.map(async (user) => {
      return {
        user: { email: user.email, fullName: user.full_name, receiverId: user.id },
      };
    }));

    res.status(200).json(userData);
  } catch (error) {
    return res.status(400).send("server error occurred");
  }
};

