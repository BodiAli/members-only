const { Router } = require("express");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const passport = require("passport");
const db = require("../db/queries");

const authenticationRouter = Router();

authenticationRouter.get("/sign-up", (req, res) => {
  res.render("sign-up-form");
});

authenticationRouter.post(
  "/sign-up",
  asyncHandler(async (req, res) => {
    const { firstName, lastName, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.createUser(firstName, lastName, username, hashedPassword);
    res.redirect("/");
  })
);

authenticationRouter.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
    failureFlash: true,
  })
);

module.exports = authenticationRouter;
