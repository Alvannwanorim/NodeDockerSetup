const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Post much have a title"],
  },
  body: {
    type: String,
    required: [true, "Post much have a body"],
  },
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
