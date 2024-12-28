const { Router } = require("express");
const authenticationController = require("../controllers/authenticationController");

const authenticationRouter = Router();

authenticationRouter.get("/auth/google", authenticationController.authenticateWithGoogle);

authenticationRouter.get("/auth/google/callback", authenticationController.googleRedirect);

authenticationRouter.get("/sign-up", authenticationController.getSignUpForm);

authenticationRouter.post("/sign-up", authenticationController.createUser);

authenticationRouter.get("/log-in", authenticationController.getLogInForm);

authenticationRouter.post("/log-in", authenticationController.authenticateWithLocal);

module.exports = authenticationRouter;
