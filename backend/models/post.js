const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter Post Title."]
  },
  description: {
    type: String,
    required: [true, "Enter enter Description."]
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please select a category."]
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
