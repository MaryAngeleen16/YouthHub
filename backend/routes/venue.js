const express = require('express');
const router = express.Router();
const Venue = require('../models/venue');
const { isAuthenticatedUser } = require('../middleware/auth');
const venueController = require('../controllers/venueController');

// Routes for venues
router.post('/venues/new', isAuthenticatedUser, venueController.createVenue);
router.put('/venues/:id', isAuthenticatedUser, venueController.updateVenue);
router.delete('/venues/:id', isAuthenticatedUser, venueController.deleteVenue);
router.get('/venues', isAuthenticatedUser, venueController.getAllVenues);
router.get('/venues/:id', isAuthenticatedUser, venueController.getSingleVenue);

module.exports = router;
