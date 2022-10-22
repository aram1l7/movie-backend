const { client } = require("../db/connect");
const { redis } = require("../db/redis");
const query = function (req, _, next) {
  req.client = client;
  req.redis = redis;
  next();
};

module.exports = query;
