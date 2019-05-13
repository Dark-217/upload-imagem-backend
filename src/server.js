require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

const { port, db_key, db_login } = require("./config/config");

const app = express();

app.use(cors());

const server = require("http").Server(app);
const io = require("socket.io")(server);

io.on("connection", socket => {
  socket.on("connectRoom", box => {
    socket.join(box);
  });
});

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  req.io = io;

  return next();
});

app.use(express.json()); //para enviar json
app.use(express.urlencoded({ extended: true })); //para envia arquivos e fotos
app.use(morgan("dev"));

app.use(
  "/files",
  express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
);

app.use(require("./routes"));

server.listen(port || 3333);
