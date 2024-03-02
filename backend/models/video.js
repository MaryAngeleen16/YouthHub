// const mongoose = require('mongoose');

// const videoSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "Please enter Video Title."]
//   },
//   description: {
//     type: String,
//     required: [true, "Enter enter Description."]
//   },
//   category: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: [true, "Please select a category."]
//   },
//   videos: [
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

// const Video = mongoose.model('Video', videoSchema);

// module.exports = Video;


const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter Video Title."]
  },
  description: {
    type: String,
    required: [true, "Enter enter Description."]
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please select a category."]
  },
  videos: [
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
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
