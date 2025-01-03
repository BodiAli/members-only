const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const authenticationController = require("./authenticationController");
const db = require("../db/queries");

exports.deletePost = [
  asyncHandler(async (req, res) => {
    await db.deletePost(req.params.id);

    const referrer = req.get("Referrer") || "/";

    res.redirect(referrer);
  }),
];

exports.getCreatePostPage = [
  authenticationController.isAuthenticated,
  (req, res) => {
    const postCreatedMessage = req.flash("info");

    res.render("create-post", { flashMessages: postCreatedMessage.length > 0 ? postCreatedMessage : null });
  },
];

const emptyErr = "can not be empty.";

const validatePost = [
  body("title").trim().notEmpty().withMessage(`Post title ${emptyErr}`),
  body("postText").trim().notEmpty().withMessage(`Post text ${emptyErr}`),
];

exports.createPost = [
  validatePost,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("create-post", { errors: errors.array() });
    }
    const { title, postText } = req.body;

    await db.createPost(title, postText, req.user.user_id);

    req.flash("info", "Post created successfully!");
    return res.redirect("/post/new");
  }),
];
