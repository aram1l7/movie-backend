const { client } = require("../db/connect");
const fs = require("fs");
const createTables = async () => {
  await client.connect();
  const tables = `CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, name VARCHAR(128) NOT NULL);
   CREATE TABLE IF NOT EXISTS movies(
          id SERIAL PRIMARY KEY,
          title VARCHAR(35) UNIQUE NOT NULL,
          is_favorite BOOLEAN,
          year VARCHAR(25) NOT NULL,
          runtime VARCHAR(25) NOT NULL,
          genre TEXT[] NOT NULL,
          director VARCHAR(35) NOT NULL,
          country VARCHAR(35),
          plot VARCHAR(255),
          awards VARCHAR(255),
          poster_src VARCHAR(255),
          imdb_rating VARCHAR(20)
        );
  CREATE TABLE IF NOT EXISTS user_movies(
         id SERIAL PRIMARY KEY, 
         user_id INTEGER REFERENCES users (id) ON DELETE CASCADE, 
         movie_id INTEGER REFERENCES movies (id) ON DELETE CASCADE
        );
        `;
  client
    .query(tables)
    .then((res) => {
      if (process.env.NODE_ENV === "development") {
        fs.writeFile(
          __dirname + `/../migrations/migration-${Date.now()}.sql`,
          tables,
          (err) => {
            console.log(err);
          }
        );
      }
      console.log(res);
      client.end();
    })
    .catch((err) => {
      console.log(err);
      client.end();
    });
};

const removeTables = async () => {
  await client.connect();
  const removeQuery = `
  DROP SCHEMA public CASCADE;
  CREATE SCHEMA public;`;
  client
    .query(removeQuery)
    .then((res) => {
      console.log(res);
      client.end();
    })
    .catch((err) => {
      console.log(err);
      client.end();
    });
};

client.on("remove", () => {
  console.log("client removed");
  process.exit(0);
});

module.exports = {
  createTables,
  removeTables,
};

require("make-runnable");
