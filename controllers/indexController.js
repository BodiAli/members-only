const asyncHandler = require("express-async-handler");
const { query } = require("express-validator");
const db = require("../db/queries");

const validatePageQuery = [
  query("page").customSanitizer(async (value) => {
    if (value <= 0 || Number.isNaN(Number.parseInt(value, 10))) {
      return 1;
    }

    const totalPosts = await db.getPostCount();
    const limit = 5;
    const totalPages = Math.ceil(totalPosts / limit);
    if (value > totalPages) {
      return totalPages;
    }
    return value;
  }),
];

exports.getHomePage = [
  validatePageQuery,
  asyncHandler(async (req, res) => {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    const allPosts = await db.getAllPosts(limit, offset);
    const totalPosts = await db.getPostCount();
    const totalPages = Math.ceil(totalPosts / limit);
    const memberShipMessage = req.flash("info");

    res.render("index", {
      allPosts,
      page,
      totalPages,
      flashMessages: memberShipMessage.length > 0 ? memberShipMessage : null,
    });
  }),
];
