const express = require("express");
const multer = require("multer");
const multerConfig = require("./config/multer");
const handle = require('express-async-handler')

const routes = express.Router();

const BoxController = require("./controllers/BoxController");
const FileController = require("./controllers/FileController");

routes.post("/boxes", BoxController.store);
routes.get("/boxes/:id", BoxController.show);


routes.post(
  "/boxes/:id/files",
  multer(multerConfig).single("file"),
  FileController.store
);


routes.delete("/boxes/:box_id/:id", handle(FileController.destroy));
module.exports = routes;
