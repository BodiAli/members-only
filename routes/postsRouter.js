const { Router } = require("express");
const postsController = require("../controllers/postsController");

const postsRouter = Router();

postsRouter.post("/:id/delete", postsController.deletePost);

module.exports = postsRouter;
