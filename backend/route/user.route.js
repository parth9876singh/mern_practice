const express = require('express');
const { register, login, profile, logout, forgetPassword, resetpassword, uploadImage, sendNotification } = require('../controller/user.controller');
const { protect } = require('../middleware/authToken');
const upload = require('../middleware/upload.js');
const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.get('/profile',protect, profile)
router.get('/logout',logout)
router.post('/forgetPassword',forgetPassword)
router.post('/resetPassword/:token',resetpassword)
router.post('/uploadImage',upload.single('image'),protect,uploadImage)
router.post('/message',sendNotification);



module.exports = router;