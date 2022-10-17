const search = async (req, res) => {
  try {
    const data = await req.client.query(
      "SELECT * FROM movies WHERE title ILIKE $1",
      ["%" + req.query.title + "%"]
    );
    return res.status(200).json(data.rows);
  } catch (error) {
    console.log(error, "error");
    return res.status(400).json({ error });
  }
};

const searchFavorites = async (req, res) => {
  try {
    const data = await req.client.query(
      "SELECT * FROM movies WHERE title ILIKE $1 AND is_favorite = true",
      ["%" + req.query.title + "%"]
    );
    return res.status(200).json(data.rows);
  } catch (error) {
    console.log(error, "error");
    return res.status(400).json({ error });
  }
};

module.exports = { search, searchFavorites };
