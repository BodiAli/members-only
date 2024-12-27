const { Router } = require("express");
const passport = require("passport");

const indexRouter = Router();

indexRouter.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

indexRouter.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
indexRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

indexRouter.get("/profile", (req, res) => {
  res.send(`Welcome (${req.user.displayName})`);
});

module.exports = indexRouter;
