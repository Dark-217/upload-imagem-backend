const File = require("../models/File");
const Box = require("../models/Box");

class FileController {
  async store(req, res) {
    const box = await Box.findById(req.params.id);
    const { originalname: name, size, key, location: url = "" } = req.file;

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
    const { url, params } = req;

    console.log('Paramentro ID File: ', params.id)
  console.log('====>>>>>>>>>>>>: ', url)
  const box_id = url.indexOf("/boxes/");  
  const box_id_ = url.lastIndexOf("/");
  const id_box = url.substring(box_id + 7, box_id_);

  console.log('SubString Final: ', id_box); 

    const file = await File.findById(params.id);
    
    await file.remove();
  
  
    req.io.sockets.in(id_box).emit("id", params.id);
     
    
    return res.send();
  }
}

module.exports = new FileController();
