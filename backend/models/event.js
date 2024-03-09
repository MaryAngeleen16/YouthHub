const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    schedule: {
        type: String,
        required: true
    },
    venue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Venue',
        required: true
    },
    type: {
        eventInfo: {
            eventName: {
                type: String
            },
            type: {
                type: String
            },
            fee: {
                type: Number
            }
        },
        required: true
    },
    payment_status: {
        type: String
    },
    amount: {
        type: Number
    },
    audience_capacity: {
        type: Number
    },
    banner: {
        type: String
    },
    additionalImages: [{
        type: String
    }]
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
