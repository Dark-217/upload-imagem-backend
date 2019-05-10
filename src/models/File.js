const mongoose = require("mongoose");
const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const s3 = new aws.S3();

const File = new mongoose.Schema(
  {
    title: { type: String, required: true },
    path: {
      type: String,
      required: true
    },
    size: Number,
    url: String
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

/*
File.virtual("url").get(function() {
  const url = process.env.URL || "http://localhost:3333";
  return `${url}/files/${encodeURIComponent(this.path)}`;
});*/ 

File.pre("save", function() {
  if (!this.url) {
    this.url = `${process.env.APP_URL}/files/${encodeURIComponent(this.path)}`;
  }
  console.log("Model::::: ", this.url)
});

File.pre("remove", function() {

  if (process.env.STORAGE_TYPE === "s3") {
    return s3
      .deleteObject({
        Bucket: process.env.BUCKET_NAME,
        Key: this.key
      })
      .promise()
      .then(response => {
        console.log(response.status);
      })
      .catch(response => {
        console.log(response.status);
      });
  } else {
    return promisify(fs.unlink)(
      path.resolve(__dirname, "..", "..", "tmp", "uploads", this.key)
    );
  }
});

module.exports = mongoose.model("File", File);
