const User = require('../models/user');
const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middlewares/auth');
const authController = require('../controllers/auth');

router.route('/register').post(authController.registerUser);
router.route('/login').post(authController.login);
router.route('/profile').get(authMiddleware,authController.getProfile);
router.route('/forgotpassword').post(authController.forgotPassword);
router.route('/resetpassword/:token').put(authController.resetPassword);
router.route('/updateuser').put(authMiddleware,authController.updateUser);
router.route('/updatepassword').put(authMiddleware,authController.updatePassword);

module.exports = router;
