const uuid = require("uuid-random");
const pool = require("./db");

module.exports = {
  createUser: async name => {
    let user = [];
    try {
      const uid = uuid();
      const client = await pool.connect();
      const { rows } = await client.query(
        "SELECT * FROM user_chat where name=$1",
        [name]
      );
      if (!rows[0]) {
        const { rows } = await client.query(
          "INSERT INTO user_chat (uuid_user,name) values ($1, $2)  returning *",
          [uid, name]
        );
        user = rows[0];
      } else {
        user = rows[0];
        console.error("The user already exist!");
      }
    } catch (error) {
      console.error("error: ", error);
    }
    return user;
  },
  getUsers: async () => {
    let users = [];
    try {
      const client = await pool.connect();
      const { rows } = await client.query("SELECT * FROM user_chat");
      users = rows;
    } catch (error) {
      console.error("error", error);
      //  errorHandler(error)
    }
    return users;
  },
  createConversation: async data => {
    let conversation = [];
    let uuid_user_one = data.user_one;
    let uuid_user_two = data.user_two;

    try {
      const uid = uuid();
      const client = await pool.connect();
      const { rows } = await client.query(
        `SELECT * FROM conversation 
          WHERE (uuid_user_one=$1 and uuid_user_two=$2) OR (uuid_user_one=$2 and uuid_user_two=$1)`,
        [uuid_user_one, uuid_user_two]
      );

      if (!rows[0]) {
        const { rows } = await client.query(
          "INSERT INTO conversation (uuid_conversation,uuid_user_one,uuid_user_two) values ($1, $2, $3)  returning *",
          [uid, uuid_user_one, uuid_user_two]
        );
        conversation = rows[0];
      } else {
        conversation = rows[0];
        console.error("The conversation already exist!");
      }
    } catch (error) {
      console.error("error: ", error);
    }
    return conversation;
  },
  newMessage: async data => {
    let message = [];
    let uuid_conversation = data.uuid_conversation;
    let uuid_user = data.uuid_user;
    let text_message = data.text_message;

    try {
      const uid = uuid();
      const client = await pool.connect();
      const { rows } = await client.query(
        `INSERT INTO chat_messages (uuid_message,uuid_conversation,uuid_user,text_message) values ($1, $2, $3, $4)  returning *`,
        [uid, uuid_conversation, uuid_user, text_message]
      );
      message = rows[0];
    } catch (error) {
      console.error("error: ", error);
    }
    return message;
  },
  getMessages: async (uuid_conversation) => {
    let messages = [];
    try {
      const client = await pool.connect();
      const { rows } = await client.query(`SELECT * FROM chat_messages WHERE uuid_conversation=$1`, [uuid_conversation]);
      messages = rows;
    } catch (error) {
      console.error("error", error);
      //  errorHandler(error)
    }
    return messages;
  },
};
