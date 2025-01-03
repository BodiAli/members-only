const { Client } = require("pg");

const SQL = `
  CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    isMember BOOLEAN DEFAULT FALSE,
    isAdmin BOOLEAN DEFAULT FALSE
  );

  CREATE TABLE IF NOT EXISTS posts (
    post_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    post_title VARCHAR(255) NOT NULL,
    post_text TEXT NOT NULL,
    post_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP(0),
    post_user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE
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
