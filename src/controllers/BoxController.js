const Box = require("../models/Box");

class BoxController {
  async store(req, res) {
    const box = await Box.create(req.body);
    console.log(req);
    console.log(res);
    return res.json(box);
  }

  async show(req, res) {
    const box = await Box.findById(req.params.id).populate({
      path: "files",
      options: { sort: { createdAt: -1 } }
    });
    return res.json(box);
  }

  async delete (req, res) {
   
        const post = await Post.findById(req.params.id);
      
        await post.remove();
      
   
    return res.send()
  }
  
}

module.exports = new BoxController();
