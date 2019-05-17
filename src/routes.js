const express = require("express");
const validate = require("express-validation");
const multer = require("multer");
const multerConfig = require("./config/multer");
const handle = require("express-async-handler");

const routes = express.Router();

const authMiddleware = require("./app/middlewares/auth");

const controllers = require("./app/controllers");
const validators = require("./app/validators");

routes.post(
  "/users",
  validate(validators.User),
  handle(controllers.UserController.store)
);
routes.post(
  "/sessions",
  validate(validators.Session),
  handle(controllers.SessionController.store)
);

routes.use(authMiddleware);

/**
 * Boxes
 */

routes.post("/boxes", handle(controllers.BoxController.store));
routes.get("/boxes/:id", controllers.BoxController.show);

/**
 * Files
 */

routes.post(
  "/boxes/:id/files",
  multer(multerConfig).single("file"),
  handle(controllers.FileController.store)
);

routes.delete("/boxes/:box_id/:id", handle(controllers.FileController.destroy));

module.exports = routes;
