const express = require("express");
const { connectDb } = require("./db/connect");
const app = express();
const searchRoutes = require("./routes/search");
const movieRoutes = require("./routes/movies");
const cors = require("cors");
const { connectRedis } = require("./db/redis");

connectDb();
connectRedis();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("Alive");
});

app.use("/api/movies", movieRoutes);

app.use("/search", searchRoutes);

app.listen(process.env.PORT || 4000);
