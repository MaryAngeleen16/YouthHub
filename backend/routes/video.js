const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const Video = require('../models/video');
const {
  newVideo,
  updateVideo,
  deleteVideo,
  getVideos,
  getAdminVideos,
  getSingleVideo,
  getVideoById,
  addComment,
  deleteComment,
  editComment,
} = require('../controllers/videoController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

router.get('/videos', getVideos);
router.get('/videos/:id', getSingleVideo);
router.get('/video/:id', getVideoById);


router.post('/video/add-comment/:id',isAuthenticatedUser, addComment);
router.delete('/video/delete-comment/:id', isAuthenticatedUser, deleteComment);
router.put('/video/edit-comment/:id', isAuthenticatedUser, editComment);

//admin
router.put('/admin/update/video/:id', isAuthenticatedUser, authorizeRoles("admin"), upload.single('video'), updateVideo);
router.delete('/admin/delete/video/:id', deleteVideo);
router.post('/admin/video/new', isAuthenticatedUser, authorizeRoles("admin"), upload.single('video'), newVideo);
router.get('/admin/video', isAuthenticatedUser, authorizeRoles("admin"), getAdminVideos);

module.exports = router;