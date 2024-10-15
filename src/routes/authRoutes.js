const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware.js');
const { registerUser, loginUser,logoutUser } = require('../controllers/authController.js');

router.post('/register',registerUser);
router.post('/login', loginUser);
router.post('/logout', verifyToken, logoutUser);
module.exports = router;