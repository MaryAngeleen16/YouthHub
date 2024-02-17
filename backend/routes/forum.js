const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const forumController = require('../controllers/forumController');
const { isAuthenticatedUser } = require('../middleware/auth');

router.post('/forum/create-topic', upload.single('image'), isAuthenticatedUser, forumController.createTopic)
router.get('/forum/all-topics', isAuthenticatedUser, forumController.getForums);
router.get('/forum/single-topic/:id', isAuthenticatedUser, forumController.getSingleTopic);
router.put('/forum/edit-forum/:id', isAuthenticatedUser, upload.single('image'), forumController.editForumTopic);
router.get('/forums/categorize/', isAuthenticatedUser, forumController.categorizeTopics)
router.delete('/forum/delete/:id', isAuthenticatedUser, forumController.deleteTopic)

router.post('/forum/make-comment/:id', isAuthenticatedUser, forumController.makeComment)
router.put('/forum/edit-comment/', isAuthenticatedUser, forumController.editComment)
router.delete('/forum/delete-comment', isAuthenticatedUser, forumController.deleteComment)

router.post('/forum/reply-to-comment', isAuthenticatedUser, forumController.replyToComment)
router.put('/forum/edit-replied-comment', isAuthenticatedUser, forumController.editRepliedComment)
router.delete('/forum/delete-replied-comments', isAuthenticatedUser, forumController.deleteRepliedComment)

module.exports = router;