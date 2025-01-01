const asyncHandler = require("express-async-handler");
const db = require("../db/queries");

exports.deletePost = [
  asyncHandler(async (req, res) => {
    await db.deletePost(req.params.id);

    const referrer = req.get("Referrer") || "/";

    res.redirect(referrer);
  }),
];
