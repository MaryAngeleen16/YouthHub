const mongoose = require('mongoose');

// const eventInfoSchema = new mongoose.Schema({
//   eventName: String,
//   type: String,
//   fee: Number
// });

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  schedule: {
    type: Date,
    required: true
  },
  venue_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue',
    required: true
  },
  // type: {
  //   // eventName: String,
  //   typename: {
  //     type: String, 
  //     default: '0'
  //   },
  //   fee: Number
  // }, // Corrected to use the nested schema directly
  payment_status: {
    type: String,
    required: true
  },
  amount: {
    type: Number
  },
  audience_capacity: {
    type: Number,
    required: true
  },
  banner: {
    type: String
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

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;