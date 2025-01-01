const asyncHandler = require("express-async-handler");
const { query } = require("express-validator");
const authenticationController = require("./authenticationController");
const db = require("../db/queries");

const validatePageQuery = [
  query("page").customSanitizer(async (value, { req }) => {
    if (value <= 0 || Number.isNaN(Number.parseInt(value, 10))) {
      return 1;
    }
    const totalPosts = await db.getUserPostsCount(req.user.user_id);
    const limit = 5;
    const totalPages = Math.ceil(totalPosts / limit);

    if (value > totalPages) {
      return totalPages;
    }
    return value;
  }),
];

exports.getProfilePage = [
  authenticationController.isAuthenticated,
  validatePageQuery,
  asyncHandler(async (req, res) => {
    const page = Number.parseInt(req.query.page, 10) || 1;

    const limit = 5;
    const offset = (page - 1) * limit;

    const userPosts = await db.getUserPosts(req.user.user_id, limit, offset);

    const totalUserPosts = await db.getUserPostsCount(req.user.user_id);
    const totalPages = Math.ceil(totalUserPosts / limit);

    const alreadySignedInMessage = req.flash("info");

    res.render("profile", {
      flashMessages: alreadySignedInMessage.length > 0 ? alreadySignedInMessage : null,
      userPosts,
      totalPages,
      page,
    });
  }),
];
