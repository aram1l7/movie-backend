const express = require("express");
const searchController = require("../controllers/search");
const query = require("../middleware/client");
const router = express.Router();

router.get("/", query, searchController.search);
router.get("/favorites", query, searchController.searchFavorites);
module.exports = router;
