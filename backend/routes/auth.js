const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const { 
    registerUser, 
    loginUser, 
    logout, 
    forgotPassword,
    resetPassword,
    getUserProfile,
    updatePassword,
    updateProfile,
    allUsers,
    getUserDetails,
    editUserRole,
    deleteUser,
    getAdditionalInfo,
    getPublicUserNames // Added controller function
} = require('../controllers/authController');

const { isAuthenticatedUser, authorizeRoles, getUserInformation } = require('../middleware/auth');

router.post('/register', upload.single("avatar"), registerUser);
router.post('/login', loginUser);
router.get('/logout', logout);



router.get('/public/users', getUserInformation, getPublicUserNames); // Retrieves names of all users for display purposes

router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);
router.get('/me', isAuthenticatedUser, getUserProfile)
router.put('/password/update', isAuthenticatedUser,  updatePassword)
router.put('/me/update', isAuthenticatedUser, upload.single("avatar"), updateProfile)
router.get('/me/info', isAuthenticatedUser, getAdditionalInfo); // Route for additional user info
router.get('/admin/users', isAuthenticatedUser, authorizeRoles('admin'), allUsers) // Added authentication and authorization middleware
router.get('/admin/user/:id', isAuthenticatedUser, authorizeRoles('admin'), getUserDetails) // Added authentication and authorization middleware
router.put('/editUserRole/:userId', isAuthenticatedUser, authorizeRoles('admin'), editUserRole) // Added authentication and authorization middleware
router.delete('/deleteUser/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteUser) // Added authentication and authorization middleware

module.exports = router;
