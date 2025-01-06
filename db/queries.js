/* eslint-disable class-methods-use-this */
const pool = require("./pool");

class Database {
  async createUser(firstName, lastName, username, password) {
    await pool.query("INSERT INTO users (first_name, last_name,username,password) VALUES ($1,$2,$3,$4)", [
      firstName,
      lastName,
      username,
      password,
    ]);
  }

  async getUserByEmail(email) {
    const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [email]);
    return rows;
  }

  async getAllPosts(limit, offset) {
    const { rows } = await pool.query(
      "SELECT post_id, post_title, post_text, post_added, CONCAT(first_name, ' ', last_name) AS author FROM posts JOIN users ON post_user_id = user_id ORDER BY post_added DESC LIMIT $1 OFFSET $2;",
      [limit, offset]
    );
    return rows;
  }

  async getUserPosts(userId, limit, offset) {
    const { rows } = await pool.query(
      "SELECT * FROM posts WHERE post_user_id = $1 ORDER BY post_added DESC LIMIT $2 OFFSET $3",
      [userId, limit, offset]
    );
    return rows;
  }

  async getUserPostsCount(userId) {
    const { rows } = await pool.query("SELECT COUNT(*) FROM posts WHERE post_user_id = $1", [userId]);
    return Number.parseInt(rows[0].count, 10);
  }

  async getPostCount() {
    const { rows } = await pool.query("SELECT COUNT(*) FROM posts;");
    return Number.parseInt(rows[0].count, 10);
  }

  async updateMembership(userId) {
    await pool.query("UPDATE users SET ismember = true WHERE user_id = $1", [userId]);
  }

  async updateAdmin(userId) {
    await pool.query("UPDATE users SET isadmin = true WHERE user_id = $1", [userId]);
  }

  async deletePost(postId) {
    await pool.query("DELETE FROM posts WHERE post_id = $1", [postId]);
  }

  async createPost(title, text, userId) {
    await pool.query("INSERT INTO posts (post_title, post_text, post_user_id) VALUES ($1, $2, $3)", [
      title,
      text,
      userId,
    ]);
  }

  async removeMemberStatus(userId) {
    await pool.query("UPDATE users SET ismember = false WHERE user_id = $1", [userId]);
  }

  async removeAdminStatus(userId) {
    await pool.query("UPDATE users SET isadmin = false WHERE user_id = $1", [userId]);
  }
}

module.exports = new Database();
