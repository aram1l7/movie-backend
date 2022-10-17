const express = require("express");
const { connectDb } = require("./db/connect");
const app = express();
const searchRoutes = require("./routes/search");
const movieRoutes = require("./routes/movies");
const bodyParser = require("body-parser");
const cors = require("cors");
connectDb();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use("/api/movies", movieRoutes);

app.use("/search", searchRoutes);

app.listen(4000, () => {
  console.log("Running on port 4000");
});
