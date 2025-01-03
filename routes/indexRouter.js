const { Router } = require("express");
const indexController = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.get("/", indexController.getHomePage);
indexRouter.get("/about", indexController.getAboutPage);

module.exports = indexRouter;
