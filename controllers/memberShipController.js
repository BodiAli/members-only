const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { isAdmin, isMember } = require("./authenticationController");
const db = require("../db/queries");

exports.getMemberPage = [
  isMember,
  (req, res) => {
    res.render("member");
  },
];

exports.getAdminPage = [
  isAdmin,
  (req, res) => {
    res.render("admin");
  },
];

const emptyErr = "can not be empty.";

const validateMemberPasscode = [
  body("memberPass")
    .trim()
    .notEmpty()
    .withMessage(`Passcode ${emptyErr}`)
    .custom((value) => {
      if (value !== "member123") throw new Error("Incorrect passcode.");
      return true;
    }),
];

exports.updateMember = [
  validateMemberPasscode,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("member", { errors: errors.array() });
    }
    await db.updateMembership(req.user.user_id);
    return res.redirect("/");
  }),
];

const validateAdminPasscode = [
  body("adminPass")
    .trim()
    .notEmpty()
    .withMessage(`Passcode ${emptyErr}`)
    .custom((value) => {
      if (value !== process.env.ADMIN_PASSCODE) throw new Error("Incorrect passcode.");
      return true;
    }),
];

exports.updateAdmin = [
  validateAdminPasscode,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("admin", { errors: errors.array() });
    }
    await db.updateAdmin(req.user.user_id);
    return res.redirect("/");
  }),
];
