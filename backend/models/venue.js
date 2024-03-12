const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    // You can add more fields as needed
    // Example: amenities, contact information, images, etc.
}, { timestamps: true });

const Venue = mongoose.model('Venue', venueSchema);

module.exports = Venue;
