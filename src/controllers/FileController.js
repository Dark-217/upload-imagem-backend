const File = require("../models/File");
const Box = require("../models/Box");

class FileController {
  async store(req, res) {
    const box = await Box.findById(req.params.id);
    const { originalname: name, size, key, location: url = "" } = req.file;

    console.log("=================================");
    console.log(req.file)
    console.log("=================================");
    const file = await File.create({
      title: name,     
      size,
      key,
      url
    });

    box.files.push(file);

    await box.save();

    req.io.sockets.in(box._id).emit("file", file);

    return res.json(file);
  }

  async destroy(req, res){

    
    console.log("D E L E T E", req.params.id);

    
    const file = await File.findById(req.params.id);
    
    console.log("D E L E T E", file);


    await file.remove();
  
    return res.send();
  }
}

module.exports = new FileController();
