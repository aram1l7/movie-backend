const { Pool } = require("pg");
require("dotenv").config();

const connectionString =
  process.env.NODE_ENV === "development"
    ? process.env.DB_LOCAL_URL
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
