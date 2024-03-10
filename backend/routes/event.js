const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const Event = require('../models/event');
const {
    createEvent,
    // updateEvent,
    deleteEvent,
    getAllEvents,
    getSingleEvent,
    // addParticipant,
    // removeParticipant
} = require('../controllers/eventController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

// Routes for events
router.get('/events', getAllEvents);
router.get('/events/:id', getSingleEvent);

router.post('/events/new', isAuthenticatedUser, upload.single('banner'), createEvent);
// router.put('/events/:id', isAuthenticatedUser, updateEvent);
router.delete('/events/:id', isAuthenticatedUser, deleteEvent);

// router.post('/events/:id/participants', isAuthenticatedUser, addParticipant);
// router.delete('/events/:id/participants', isAuthenticatedUser, removeParticipant);

module.exports = router;
