const { Client } = require("pg");

const SQL = ``;

async function main() {
  console.log("seeding...");
  const client = new Client({});

  await client.connect();
  await client.query(SQL);
  await client.end();

  console.log("done");
}

main();
