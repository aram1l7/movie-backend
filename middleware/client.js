const { client } = require("../db/connect");

const query = function (req, _, next) {
  req.client = client;
  next();
};

module.exports = query;
