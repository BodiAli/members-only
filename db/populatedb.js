const { Client } = require("pg");

const SQL = `
  CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    isMember BOOLEAN,
    isAdmin BOOLEAN
  );

  CREATE TABLE IF NOT EXISTS posts (
    post_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    post_title VARCHAR(255),
    post_text TEXT,
    post_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP(0),
    posts_user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE
  );
`;

const connectionString = process.argv[2];

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString,
  });

  await client.connect();
  await client.query(SQL);
  await client.end();

  console.log("done");
}

main();
