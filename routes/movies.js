const express = require("express");
const movieController = require("../controllers/movies");
const query = require("../middleware/client");
const router = express.Router();

router.get("/", query, movieController.getAll);
router.get("/favorites", query, movieController.getFavorites);
router.get("/:id", query, movieController.getById);
router.post("/", query, movieController.addMovie);
router.put("/:id", query, movieController.updateById);
router.put("/toggle-favorite/:id", query, movieController.toggleFavorite);
router.delete("/:id/:username", query, movieController.deleteById);

module.exports = router;
