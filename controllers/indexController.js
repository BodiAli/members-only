const asyncHandler = require("express-async-handler");
const db = require("../db/queries");

exports.getHomePage = asyncHandler(async (req, res) => {
  const page = Number.parseInt(req.query.page, 10) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;

  const allPosts = await db.getAllPosts(limit, offset);
  const totalPosts = await db.getPostCount();
  const totalPages = Math.ceil(totalPosts / limit);

  res.render("index", { title: "Home", allPosts, page, totalPages });
});
