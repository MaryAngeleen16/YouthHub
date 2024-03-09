const Event = require('../models/event');
const cloudinary = require('cloudinary');

exports.createEvent = async (req, res, next) => {
    try {
        let imagesLinks = [];
        let images = [];

        // Extract image paths from the request
        if (req.files.length > 0) {
            req.files.forEach(image => {
                images.push(image.path);
            });
        }

        // Handle single image upload
        if (req.file) {
            images.push(req.file.path);
        }

        // Handle image URLs in the request body
        if (req.body.images) {
            if (typeof req.body.images === 'string') {
                images.push(req.body.images);
            } else {
                images = req.body.images;
            }
        }

        // Upload images to Cloudinary and get their URLs
        for (let i = 0; i < images.length; i++) {
            let imageDataUri = images[i];
            try {
                const result = await cloudinary.v2.uploader.upload(`${imageDataUri}`, {
                    folder: 'events-youthhub',
                    width: 1000,
                    crop: "auto",
                });

                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url
                });
            } catch (error) {
                console.log(error);
            }
        }

        req.body.images = imagesLinks;

        // Create the event in the database
        const event = await Event.create(req.body);

        // Respond with success message and the created event
        res.status(201).json({
            success: true,
            event
        });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.deleteEvent = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find the event by ID and delete it
        const event = await Event.findByIdAndDelete(id);

        // Check if event exists
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Respond with success message
        return res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllEvents = async (req, res, next) => {
    try {
        // Fetch all events from the database
        const events = await Event.find();

        // Respond with the fetched events
        res.status(200).json({ events });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Failed to fetch events', error: error.message });
    }
};

exports.getSingleEvent = async (req, res, next) => {
    try {
        // Find the event by ID
        const event = await Event.findById(req.params.id);

        // Check if event exists
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Respond with the fetched event
        res.status(200).json({
            success: true,
            event
        });
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

// Additional controller methods for updating, deleting comments, etc. can be added as needed.
