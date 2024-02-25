// const mongoose = require('mongoose');

// const postSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "Please enter Post Title."]
//   },
//   description: {
//     type: String,
//     required: [true, "Enter enter Description."]
//   },
//   category: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: [true, "Please select a category."]
//   },
//   images: [
//     {
//       public_id: {
//         type: String,
//         required: true,
//       },
//       url: {
//         type: String,
//         required: true,
//       },
//     },
//   ],

// });

// const Post = mongoose.model('Post', postSchema);

// module.exports = Post;






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
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Replace 'User' with the actual model name if different
      },
      comment: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now()
      }
    }
  ]
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;

