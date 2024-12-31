const asyncHandler = require("express-async-handler");
const db = require("../db/queries");

exports.deletePost = [
  asyncHandler(async (req, res) => {
    await db.deletePost(req.params.id);

    res.redirect(`/?page=${req.query.page || 1}`);
  }),
];
