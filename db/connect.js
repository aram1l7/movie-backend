const { Pool } = require("pg");
require("dotenv").config();

const connectionString =
  process.env.NODE_ENV === "development"
    ? "postgres://postgres:postgres@127.0.0.1:5432/moviesapp"
    : process.env.DB_URL;

const client = new Pool({
  connectionString,
});

const connectDb = async () => {
  try {
    await client.connect();
    console.log("Successfully connected to postgres client");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = {
  client,
  connectDb,
};
