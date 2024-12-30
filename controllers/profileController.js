const asyncHandler = require("express-async-handler");
const authenticationController = require("./authenticationController");

exports.getProfilePage = [
  authenticationController.isAuthenticated,
  asyncHandler((req, res) => {
    const alreadySignedInMessage = req.flash("info");

    res.render("profile", {
      alreadySignedInMessage: alreadySignedInMessage.length > 0 ? alreadySignedInMessage : null,
    });
  }),
];
