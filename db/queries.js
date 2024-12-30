const pool = require("./pool");

exports.createUser = async (firstName, lastName, username, password) => {
  await pool.query("INSERT INTO users (first_name, last_name,username,password) VALUES ($1,$2,$3,$4)", [
    firstName,
    lastName,
    username,
    password,
  ]);
};

exports.getUserByEmail = async (email) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [email]);
  return rows;
};

exports.getAllPosts = async (limit, offset) => {
  const { rows } = await pool.query(
    "SELECT post_id, post_title, post_text, post_added, CONCAT(first_name, ' ', last_name) AS author FROM posts JOIN users ON post_user_id = user_id ORDER BY post_added DESC LIMIT $1 OFFSET $2;",
    [limit, offset]
  );
  return rows;
};

exports.getUserPosts = async (userId) => {
  const { rows } = await pool.query("SELECT * FROM posts WHERE post_user_id = $1", [userId]);
  return rows;
};

exports.getPostCount = async () => {
  const { rows } = await pool.query("SELECT COUNT(*) FROM posts;");
  return Number.parseInt(rows[0].count, 10);
};
