const express = require('express');
const router = express.Router();
const authz = require('../middlewares/authorization');

const orderController = require('../app/controllers/order.controller');

router.post('/create', authz.verifyUser, orderController.createOrder);
router.post('/order-checkout', authz.verifyUser, orderController.checkoutOrder);
router.post('/update', authz.verifyAdmin, orderController.updateOrder);
router.get('/get-all', authz.verifyAdmin, orderController.getAllOrders);
router.get('/detail/:id', authz.verifyAdmin, orderController.getOrder);

router.get('/my-orders', authz.verifyToken, orderController.getAllMyOrders);
router.get('/my-orders/detail/:id', authz.verifyToken, orderController.getOrder);


module.exports = router;