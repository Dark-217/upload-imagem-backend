require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

const Youch = require("youch");
const Sentry = require("@sentry/node");
const validate = require("express-validation");
const databaseConfig = require("./config/database");
const sentryConfig = require("./config/sentry");

class App {
  constructor() {
    this.express = express();

    this.middlewares_cors();

    const server = require("http").Server(this.express);
    this.io = require("socket.io")(server);

    this.isDev = process.env.NODE_ENV !== "production";

    this.connectSocket();
    this.sentry();
    this.database();
    this.middlewares();
    this.routes();
    this.exception();
  }

  connectSocket() {
    this.io.on("connection", socket => {
      socket.on("connectRoom", box => {
        socket.join(box);
      });
    });
  }
  sentry() {
    Sentry.init(sentryConfig);
  }

  database() {
    mongoose.connect(databaseConfig.uri, {
      useCreateIndex: true,
      useNewUrlParser: true
    });
  }
  middlewares_cors() {
    this.express.use(cors());
  }
  middlewares() {
    this.express.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      req.io = this.io;

      return next();
    });
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true })); //para envia arquivos e fotos
    this.express.use(morgan("dev"));
    this.express.use(Sentry.Handlers.requestHandler());
    this.express.use(
      "/files",
      express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
    );
  }

  routes() {
    this.express.use(require("./routes"));
  }

  exception() {
    if (process.env.NODE_ENV === "production") {
      this.express.use(Sentry.Handlers.errorHandler());
    }

    this.express.use(async (err, req, res, next) => {
      if (err instanceof validate.ValidationError) {
        return res.status(err.status).json(err);
      }

      if (process.env.NODE_ENV !== "production") {
        const youch = new Youch(err, req);

        return res.json(await youch.toJSON());
      }

      return res
        .status(err.status || 500)
        .json({ error: "Internal Server Error" });
    });
  }
}

module.exports = new App().express;
