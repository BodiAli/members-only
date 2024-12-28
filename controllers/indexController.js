const asyncHandler = require("express-async-handler");
const authenticationController = require("./authenticationController");

exports.getHomePage = asyncHandler((req, res) => {
  res.render("index", { title: "Home" });
});

exports.getProfilePage = [
  authenticationController.isAuthenticated,
  asyncHandler((req, res) => {
    const messages = req.flash("info");
    console.log(messages);

    res.send(`(${req.user.first_name}) profile. <br /> <a href='/'>Home page</a>`);
  }),
];
