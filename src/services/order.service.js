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

    update = async(order) => {

        await Order.findOneAndUpdate({_id: order._id}, order);
        const nOrder = await Order.findById(order._id);

        return nOrder;

    }

    create = async(order) => {
     
        const nOrder = await Order.create(order);
        
        return nOrder ? nOrder.toObject() : nOrder;

    }
    
}

module.exports = new OrderService;