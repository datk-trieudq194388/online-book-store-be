const express = require('express');
const router = express.Router();
const authz = require('../middlewares/authorization');

const cartController = require('../app/controllers/cart.controller');

router.post('/add', authz.verifyUser, cartController.addToCart);
router.post('/update', authz.verifyUser, cartController.updateCart)
router.get('/delete', authz.verifyUser, cartController.deleteFromCart);
router.get('/check-all', authz.verifyUser, cartController.checkAll);
router.get('/', authz.verifyUser, cartController.getCart);

module.exports = router;