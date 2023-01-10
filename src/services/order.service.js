const {Order} = require('../app/models/order.model');

class OrderService{
    
    getAll = async(userID) => {
    
        let query = userID ? {userID: userID} : {};
        const allOrders = await Order.find(query);
        return allOrders;

    }

    findById = async(orderID) => {

        const order = await Order.findById(orderID);

        return order; // ? order.toObject() : order;

    }

    update = async(orderID, data) => {

        await Order.findOneAndUpdate({_id: orderID}, data);
        const nOrder = await Order.findById(orderID);

        return nOrder;

    }

    create = async(order) => {
     
        const nOrder = await Order.create(order);
        return nOrder ? nOrder.toObject() : nOrder;

    }
    
}

module.exports = new OrderService;