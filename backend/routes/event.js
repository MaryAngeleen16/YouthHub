const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const Event = require('../models/event');
const { fetchEarliestEventTimeStart } = require('../controllers/eventController');

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
    joinEvent,
    unjoinEvent ,
    
} = require('../controllers/eventController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

// Routes for events
router.get('/events', getAllEvents);
router.get('/events/:id', getSingleEvent);
router.get('/event/:id', getEventById);


router.post('/events/new', isAuthenticatedUser, upload.single('banner'), createEvent);
router.put('/events/:id', isAuthenticatedUser, upload.single('banner'), updateEvent);
router.delete('/events/:id', isAuthenticatedUser, deleteEvent);

// router.patch('/event/:id', isAuthenticatedUser, updateEventJoin);
// Define routes for joining and unjoining events
router.patch('/event/:id/join', isAuthenticatedUser,joinEvent);
router.patch('/event/:id/unjoin',isAuthenticatedUser,unjoinEvent);


router.post('/event/add-comment/:id',isAuthenticatedUser, addCommentToEvent);
router.delete('/event/delete-comment/:id', isAuthenticatedUser, deleteCommentFromEvent);
router.put('/event/edit-comment/:id', isAuthenticatedUser, editCommentOfEvent);
// router.post('/events/:id/participants', isAuthenticatedUser, addParticipant);
// router.delete('/events/:id/participants', isAuthenticatedUser, removeParticipant);

router.get('/events/earliest-event-timeStart', fetchEarliestEventTimeStart);





router.get('/is-joined/:eventId', async (req, res) => {
    try {
      const { eventId } = req.params;
      const { userId } = req.query;
  
      // Find the event by ID
      const event = await Event.findById(eventId);
  
      // Check if the event exists
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      // Check if the participants array exists and whether the user is included
      const isJoined = event.participants && event.participants.includes(userId);
  
      res.json({ isJoined });
    } catch (error) {
      console.error('Error checking if user is joined to event:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

 module.exports = router;
