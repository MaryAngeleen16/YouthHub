const Event = require('../models/event');
const cloudinary = require('cloudinary');

exports.createEvent = async (req, res, next) => {
    try { 
        if (req.body.payment_status !== '0' ){
            req.body.amount = 0
        }
        let imagesLinks = [];
        let images = [];

        // Extract image paths from the request
        if (req.files?.length > 0) {
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

exports.updateEvent = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find the event by ID
        let event = await Event.findById(id);

        // Check if event exists
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Update event fields with the request body
        event.title = req.body.title || event.title;
        event.description = req.body.description || event.description;
        event.schedule = req.body.schedule || event.schedule;
        event.venue_id = req.body.venue_id || event.venue_id;
        event.type = req.body.type || event.type;
        event.payment_status = req.body.payment_status || event.payment_status;
        event.amount = req.body.amount || event.amount;
        event.audience_capacity = req.body.audience_capacity || event.audience_capacity;

        // Save the updated event
        event = await event.save();

        // Respond with the updated event
        res.json({ message: 'Event updated successfully', event });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Internal server error' });
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
        const events = await Event.find().populate({
            path: 'venue_id', 
            model: 'Venue'
        })

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




exports.getEventById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const event = await Event.findById(id);
  
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      return res.json(event);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  exports.addCommentToEvent = async (req, res, next) => {
    try {
      const { id } = req.params; // Get the ID of the event
      const userId = req.user._id; // Get the ID of the user posting the comment
  
      const event = await Event.findById(id); // Find the event by ID
  
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }
  
      const newComment = {
        user: userId,
        comment: req.body.comment,
      };
  
      event.comments.push(newComment); // Add the new comment to the event
      await event.save(); // Save the changes
  
      res.status(201).json({
        success: true,
        message: 'Comment posted',
        event: event,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error'
      });
    }
  };
  
  exports.deleteCommentFromEvent = async (req, res, next) => {
    try {
      const { id } = req.params; // Get the event ID from the URL params
      const { commentId } = req.query; // Get the comment ID from the query params
  
      // Find the event by ID
      const event = await Event.findById(id);
  
      // Check if the event exists
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      // Filter out the comment with the specified ID
      event.comments = event.comments.filter(comment => comment._id.toString() !== commentId);
  
      // Save the event with the updated comments
      await event.save();
  
      // Return success response
      return res.status(200).json({ message: 'Comment deleted successfully', event });
    } catch (error) {
      console.error('Error deleting comment:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  exports.editCommentOfEvent = async (req, res, next) => {
    try {
      const { id } = req.params; // Get the event ID from the URL params
      const { commentId } = req.query; // Get the comment ID from the query params
      const { comment: updatedComment } = req.body; // Get the updated comment text from the request body
  
      // Find the event by ID
      const event = await Event.findById(id);
  
      // Check if the event exists
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      // Find the comment within the event's comments array and update it
      const commentToUpdate = event.comments.find(comment => comment._id.toString() === commentId);
      if (!commentToUpdate) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      // Update the comment text
      commentToUpdate.comment = updatedComment;
  
      // Save the event with the updated comment
      await event.save();
  
      // Return success response
      return res.status(200).json({ message: 'Comment updated successfully', event });
    } catch (error) {
      console.error('Error updating comment:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  