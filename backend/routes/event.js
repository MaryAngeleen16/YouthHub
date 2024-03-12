const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const Event = require('../models/event');
const {
    createEvent,
    updateEvent,
    deleteEvent,
    getAllEvents,
    getSingleEvent,
    addCommentToEvent,
    deleteCommentFromEvent,
    editCommentOfEvent,
    getEventById,
    // addParticipant,
    // removeParticipant
} = require('../controllers/eventController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

// Routes for events
router.get('/events', getAllEvents);
router.get('/events/:id', getSingleEvent);
router.get('/event/:id', getEventById);

router.post('/events/new', isAuthenticatedUser, upload.single('banner'), createEvent);
router.put('/events/:id', isAuthenticatedUser, upload.single('banner'), updateEvent);
router.delete('/events/:id', isAuthenticatedUser, deleteEvent);


router.post('/event/add-comment/:id',isAuthenticatedUser, addCommentToEvent);
router.delete('/event/delete-comment/:id', isAuthenticatedUser, deleteCommentFromEvent);
router.put('/event/edit-comment/:id', isAuthenticatedUser, editCommentOfEvent);
// router.post('/events/:id/participants', isAuthenticatedUser, addParticipant);
// router.delete('/events/:id/participants', isAuthenticatedUser, removeParticipant);

module.exports = router;
