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

app.get("/", (req, res) => {
  res.send("Alive");
});

app.use("/api/movies", movieRoutes);

app.use("/search", searchRoutes);

app.listen(process.env.PORT || 4000)

