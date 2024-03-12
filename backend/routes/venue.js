const express = require('express');
const router = express.Router();
const Venue = require('../models/venue');
// const { isAuthenticatedUser } = require('../middleware/auth');
const venueController = require('../controllers/venueController');

// Routes for venues
router.post('/venues/new', venueController.createVenue);
router.put('/venues/:id',  venueController.updateVenue);
router.delete('/venues/:id', venueController.deleteVenue);
router.get('/venues', venueController.getAllVenues);
router.get('/venues/:id', venueController.getVenueById);

module.exports = router;
