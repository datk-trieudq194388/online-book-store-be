const express = require('express');
const router = express.Router();
const authz = require('../middlewares/authorization');

const userController = require('../app/controllers/user.controller');

router.post('/login', userController.login);
router.post('/create', userController.create);

router.get('/profile', userController.getProfile);
router.post('/update-profile', userController.updateProfile);
router.post('/update-password', userController.updatePassword);
router.get('/logout', userController.logout);

router.get('/get-all-users', authz.verifyAdmin, userController.getAllUsers);
// router.get('/lock-user', authz.verifyAdmin, userController.lockUser);

module.exports = router;