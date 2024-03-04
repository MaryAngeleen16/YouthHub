const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, isCounselor } = require('../middleware/auth');
const ventController = require('../controllers/ventController');

// Create new feedback
router.post('/vent/new', isAuthenticatedUser, ventController.createVent);

// router.get('/counselor/vent/list', isAuthenticatedUser, isCounselor, ventController.getAllVentsForCounselor);

router.get('/vent/list', isAuthenticatedUser, ventController.getAllVents);

router.get('/vent/me', isAuthenticatedUser, ventController.getAllVentsByUser);
module.exports = router;
