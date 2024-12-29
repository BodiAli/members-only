const asyncHandler = require("express-async-handler");
const authenticationController = require("./authenticationController");

exports.getHomePage = asyncHandler((req, res) => {
  res.render("index", { title: "Home" });
});

exports.getProfilePage = [
  authenticationController.isAuthenticated,
  asyncHandler((req, res) => {
    const alreadySignedInMessage = req.flash("info");

    res.render("profile", {
      alreadySignedInMessage: alreadySignedInMessage.length > 0 ? alreadySignedInMessage : null,
    });
  }),
];
