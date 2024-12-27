const { Pool } = require("pg");

// All of the following properties should be read from environment variables

module.exports = new Pool({
  host: "localhost",
  user: "<role_name>",
  database: "top_users",
  password: "<role_password>",
  port: 5432 // The default port
});

