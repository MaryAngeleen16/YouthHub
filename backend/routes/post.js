const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const Post = require('../models/post');
const {
  newPost,
  updatePost,
  deletePost,
  getPosts,
  getAdminPost,
  getSinglePost,
  getPostById,
} = require('../controllers/postController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

router.get('/posts', getPosts);
router.get('/posts/:id', getSinglePost);
router.get('/post/:id', getPostById);


//admin
router.put('/admin/update/post/:id', isAuthenticatedUser, authorizeRoles("admin"), upload.array('images'),updatePost);
router.delete('/admin/delete/post/:id',  deletePost);
router.post('/admin/post/new', isAuthenticatedUser, authorizeRoles("admin"), upload.array('images'), newPost);
router.get('/admin/post', isAuthenticatedUser, authorizeRoles("admin"), getAdminPost);

module.exports = router;