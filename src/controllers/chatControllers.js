const {client} = require('../db');

module.exports.getConversationId = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId);
    const query = `
    SELECT c.id AS conversation_id, u.id AS user_id, u.email, u.name AS name
    FROM conversations AS c
    JOIN users AS u ON u.id = ANY(c.members) AND u.id != $1
    WHERE $1 = ANY(c.members);
    `;
    const result = await client.query(query, [userId]);
    console.log(result.rows[0]);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).send('Server error occurred');
  }
};

module.exports.postConversation = async (req, res) => {
  try {
    const { sRegId,tRegId  } = req.body;
    console.log(req.body);
    console.log(sRegId,tRegId);
    const insertData = 'INSERT INTO conversations (members) VALUES (ARRAY[$1::integer, $2::integer]) RETURNING *';
    const insertValues = [tRegId, sRegId];
    const result = await client.query(insertData, insertValues);
    console.log(result);
    res.status(200).send("Conversation created successfully");
  } catch (err) {
    res.status(500).send("Server error occurred");
  }
};


module.exports.postMessage = async (req, res) => {
  try {
    const conversationId = req.body.conversationId; 
    const senderId = req.body.senderId;
    const messages = req.body.messages;
    const receiver_id = req.body.receiver_id;
    const time = req.body.formattedTime;
    const date = req.body.formattedDate;
    if (!sender_id || !messages) {
      return res.status(400).send("Please fill all required fields.");
    }

    if (conversation_id && receiver_id) {
      const conversationExists = await client.query('SELECT id FROM conversations WHERE id = $1', [conversation_id]);
    if (!conversationExists) {
        return res.status(400).send("The conversation doesn't exist.");
      }

      const newMessage = 'INSERT INTO messages (conversation_id, sender_id, receiver_id, messages, time_value, date_value) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
      const insertValues =  [conversation_id,sender_id,receiver_id,messages,time,date];
      const result = await client.query(newMessage, insertValues);
      return res.status(200).json({ message: "Message sent successfully"});
    }  
  } catch (err) {
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
      const user = await client.query('SELECT * FROM users WHERE id = $1', [message.receiverId]);
      return {
        user: { receive: user.rows[0].id, email: user.rows[0].email, name: user.rows[0].name },
        message: message.messages,
        conversation_id : conversation_id,
        time:message.time_value,
        date:message.date_value
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

