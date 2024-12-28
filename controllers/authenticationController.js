const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const bcrypt = require("bcrypt");
const db = require("../db/queries");

exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/log-in");
};

exports.isNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }

  req.flash("info", "You are already signed in.");
  return res.redirect("/profile");
};

exports.authenticateWithGoogle = passport.authenticate("google", { scope: ["profile", "email"] });

exports.googleRedirect = [
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/profile");
  },
];

exports.getSignUpForm = [
  this.isNotAuthenticated,
  (req, res) => {
    res.render("sign-up-form");
  },
];

const emptyErr = "can not be empty.";
const alreadyExistsErr = "already exists.";
const passwordLengthErr = "must be at least 5 characters long.";
const doNotMatchErr = "do not match.";
const isEmailErr = "must be a valid email.";

const validateCreateUser = [
  body("firstName").trim().notEmpty().withMessage(`First name ${emptyErr}`),
  body("lastName").trim().notEmpty().withMessage(`Last name ${emptyErr}`),
  body("username")
    .trim()
    .notEmpty()
    .withMessage(`Email ${emptyErr}`)
    .isEmail()
    .withMessage(`Email ${isEmailErr}`)
    .custom(async (value) => {
      const rows = await db.getUserByEmail(value);

      if (rows.length > 0) {
        throw new Error(`A user with this email ${alreadyExistsErr}`);
      }
      return true;
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage(`Password ${emptyErr}`)
    .isLength({ min: 5 })
    .withMessage(`Password ${passwordLengthErr}`),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage(`Password and password confirmation ${doNotMatchErr}`),
];

exports.createUser = [
  validateCreateUser,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("sign-up-form", { errors: errors.array() });
    }
    const { firstName, lastName, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.createUser(firstName, lastName, username, hashedPassword);
    return res.redirect("/");
  }),
];

exports.getLogInForm = [
  this.isNotAuthenticated,
  (req, res) => {
    res.render("log-in-form");
  },
];

exports.authenticateWithLocal = passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/log-in",
  failureFlash: true,
});