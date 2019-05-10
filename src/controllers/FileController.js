const File = require("../models/File");
const Box = require("../models/Box");

class FileController {
  async store(req, res) {
    const box = await Box.findById(req.params.id);
    const { originalname: name, size, key, location: url = "" } = req.file;
    console.log("=================================");

    console.log("originalname", req.file.originalname);
    console.log("size", req.file.size);
    console.log("key", req.file.key);
    console.log("Req: ", req);

    console.log("=================================");
    console.log("=================================");

    console.log("req.file:: ", req.file);
    console.log("=================================");
    console.log("=================================");

    const file = await File.create({
      title: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      url: req.file.url
    });

    box.files.push(file);

    await box.save();

    req.io.sockets.in(box._id).emit("file", file);

    return res.json(file);
  }
}

module.exports = new FileController();
