const createOrSelectUser = require("../queries/createUser");
const matchUserMovie = require("../queries/matchUserMovie");
const { toLowerKeys } = require("../utils");
const axios = require("axios");

require("dotenv").config();

const getAll = async (req, res) => {
  req.redis.get("movies", (err, data) => {
    if (err) console.log(err);
    if (data != null) {
      return res.status(200).json(JSON.stringify(data));
    }
  });
  try {
    const { rows } = await req.client.query(`SELECT * FROM movies`);
    req.redis.set("movies", JSON.stringify(rows), "EX", 60 * 60 * 24);
    return res.status(200).json(rows);
  } catch (error) {
    console.log(error, "error");
    return res.status(500).json(error);
  }
};

const getFavorites = async (req, res) => {
  req.redis.get("favorites", (err, data) => {
    if (err) console.log(err);
    if (data != null) {
      return res.status(200).json(JSON.stringify(data));
    }
  });
  try {
    const { rows } = await req.client.query(
      `SELECT * FROM movies WHERE is_favorite = true`
    );
    req.redis.set("favorites", JSON.stringify(rows), "EX", 60 * 60 * 24);
    return res.status(200).json(rows);
  } catch (error) {
    console.log(error, "err");
    return res.status(500).json(error);
  }
};

const getById = async (req, res) => {
  const { id } = req.params;
  req.redis.get(`movies?id=${id}`, (err, data) => {
    if (err) console.log(err);
    if (data != null) {
      return res.status(200).json(JSON.stringify(data));
    }
  });
  try {
    const data = await req.client.query(
      `SELECT * FROM movies WHERE id = ($1)`,
      [id]
    );
    req.redis.set(
      `movies?id=${id}`,
      JSON.stringify(data.rows[0]),
      "EX",
      60 * 60 * 24
    );
    return res.status(200).json(data.rows[0]);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const addMovie = async (req, res) => {
  const { title, year, runtime, genre, director, username } = req.body;
  const args = [title, year, runtime, genre, director];
  try {
    const { data } = await axios.get(
      `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${title}`
    );
    let finalData = toLowerKeys(data);
    let movie = {};
    if (finalData.response === "True") {
      const { country, awards, plot, imdbrating, poster } = finalData;
      args.push(country, awards, plot, imdbrating, poster);
      movie = await req.client.query(
        `
        INSERT INTO movies 
               (title, year, runtime, genre, 
                director, country, awards, plot,
                imdb_rating, poster_src
                ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
        `,
        [...args]
      );
    } else {
      movie = await req.client.query(
        `
      INSERT INTO movies (title, year, runtime, genre, director) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [...args]
      );
    }

    const user = await createOrSelectUser(req.client, username);

    await req.client.query(
      `INSERT INTO user_movies (user_id, movie_id)
         VALUES ($1, $2)
        `,
      [user.id, movie.rows[0].id]
    );
    return res.status(200).json(movie.rows[0]);
  } catch (err) {
    console.log(err, "err");
    return res.status(400).json(err);
  }
};

const updateById = async (req, res) => {
  const movieId = req.params.id;
  const { title, year, runtime, genre, director, username } = req.body;
  const user = await createOrSelectUser(req.client, username);
  const movieMatch = await matchUserMovie(req.client, movieId, user.id);
  if (movieMatch) {
    await req.client.query(
      `
        UPDATE movies
        SET title = $1,
            year = $2,
            runtime = $3,
            genre = $4,
            director = $5
        WHERE id = $6    
      `,
      [title, year, runtime, genre, director, movieMatch.movie_id]
    );
    return res.status(200).json({ success: true });
  }
  return res.status(400).json({ message: "This user cannot edit this movie" });
};

const toggleFavorite = async (req, res) => {
  const movieId = req.params.id;
  const { favorite, username } = req.body;
  const user = await createOrSelectUser(req.client, username);
  const movieMatch = await matchUserMovie(req.client, movieId, user.id);

  if (movieMatch) {
    await req.client.query(
      `
        UPDATE movies
        SET is_favorite = $1
        WHERE id = $2    
      `,
      [favorite, movieMatch.movie_id]
    );
    return res.status(200).json({ success: true });
  }
  return res
    .status(400)
    .json({ message: "This user cannot favorite/unfavorite this movie" });
};

const deleteById = async (req, res) => {
  const movieId = req.params.id;
  const { username } = req.params;
  const user = await createOrSelectUser(req.client, username);
  const movieMatch = await matchUserMovie(req.client, movieId, user.id);
  if (movieMatch) {
    await req.client.query(
      `
        DELETE FROM movies
        WHERE id = $1
      `,
      [movieId]
    );
    return res.status(204).json({ success: true });
  }
  return res.status(400).json({
    message: "This user cannot delete this movie or the movie is deleted",
  });
};

module.exports = {
  addMovie,
  getAll,
  getFavorites,
  getById,
  updateById,
  toggleFavorite,
  deleteById,
};
