const Venue = require('../models/venue');
const mongoose = require('mongoose');

exports.createVenue = async (req, res, next) => {
    console.log('Full Request:', req);
    try {
        // console.log('Request Body:', req.body);
        const venue = new Venue(req.body);
        await venue.save();
        res.status(201).json(venue);
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Handle validation errors, such as required fields or unique constraints
            res.status(400).json({ error: error.message });
        } else {
            // Handle other errors, such as database errors
            console.error(error); // Log the error for debugging
            res.status(500).json({ error: 'Unable to create venue' });
        }
    }
};

exports.updateVenue = async (req, res) => {
    try {
      const venue = await Venue.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!venue) {
        return res.status(404).json({ error: 'Venue not found' });
      }
      res.json(venue);
    } catch (error) {
      res.status(500).json({ error: 'Unable to update venue' });
    }
  };

  exports.getVenueById = async (req, res, next) => {
    try {
        // Find the venue by ID
        const venue = await Venue.findById(req.params.id);

        // Check if venue exists
        if (!venue) {
            return res.status(404).json({
                success: false,
                message: 'Venue not found'
            });
        }

        // Respond with the fetched venue
        res.status(200).json({
            success: true,
            venue
        });
    } catch (error) {
        console.error('Error fetching venue:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.deleteVenue = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find the venue by ID and delete it
        const venue = await Venue.findByIdAndDelete(id);

        // Check if venue exists
        if (!venue) {
            return res.status(404).json({ message: 'Venue not found' });
        }

        // Respond with success message
        return res.json({ message: 'Venue deleted successfully' });
    } catch (error) {
        console.error('Error deleting venue:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllVenues = async (req, res, next) => {
    try {
        // Fetch all venues from the database
        const venues = await Venue.find();

        // Respond with the fetched venues
        res.status(200).json({ venues });
    } catch (error) {
        console.error('Error fetching venues:', error);
        res.status(500).json({ message: 'Failed to fetch venues', error: error.message });
    }
};

exports.getSingleVenue = async (req, res, next) => {
    try {
        // Find the venue by ID
        const venue = await Venue.findById(req.params.id);

        // Check if venue exists
        if (!venue) {
            return res.status(404).json({
                success: false,
                message: 'Venue not found'
            });
        }

        // Respond with the fetched venue
        res.status(200).json({
            success: true,
            venue
        });
    } catch (error) {
        console.error('Error fetching venue:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

// Additional controller methods for updating venues, managing bookings, etc. can be added as needed.
