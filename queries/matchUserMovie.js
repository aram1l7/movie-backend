const matchUserMovie = async (client, movieId, userId) => {
  try {
    const match = await client.query(
      `   SELECT user_id, movie_id
                FROM user_movies
                WHERE movie_id = ($1) AND user_id = ($2)
            `,
      [movieId, userId]
    );
    return match.rows[0];
  } catch (err) {
    console.log(err, "err");
    return null;
  }
};

module.exports = matchUserMovie;
