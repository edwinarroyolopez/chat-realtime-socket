const uuid = require("uuid-random");
const pool = require("./db");

module.exports = {
  createUser: async name => {
    console.log("data-user: ", name);

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
      }

      console.log("user: ", user);
    } catch (error) {
      console.error("error: ", error);
    }
    return user;
  },
  getData: async () => {
    let courses = [];
    try {
      const client = await pool.connect();
      const { rows } = await client.query("SELECT * FROM course");
      courses = rows;
    } catch (error) {
      console.error("error", error);
      //  errorHandler(error)
    }
    return courses;
  }
};
