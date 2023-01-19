const orderService = require('../../services/order.service');
const cartService = require('../../services/cart.service');
const userService = require('../../services/user.service');
const bookService = require('../../services/book.service');
const titleService = require('../../services/title.service');
const Util = require('../../utils/util');
const authz = require('../../middlewares/authorization');

class OrderController{
    
    getAllOrders = async(req, res) => {
        
        try {
            const userID = req.query.userID;

            let allOrders = await orderService.getAll(userID);

            for(let i in allOrders)
                allOrders[i] = await this.formatReturnedOrder(allOrders[i]);

            return res.json(allOrders);

        }catch(err){
            return Util.throwError(res, err);
        }

    }

    getAllMyOrders = async(req, res) => {
        
        try {
            const userID = authz.requestUser(req, res);

            let allOrders = await orderService.getAll(userID);

            for(let i in allOrders)
                allOrders[i] = await this.formatReturnedOrder(allOrders[i]);

            return res.json(allOrders);

        }catch(err){
            return Util.throwError(res, err);
        }

    }

    getOrder = async(req, res) => {

        try {
            const orderID = req.params.id;

            let order = await orderService.findById(orderID);

            if(!order) return res.status(404).json({message: "not found"});

            order = await this.formatReturnedOrder(order);

            return res.json(order);

        }catch(err){
            return Util.throwError(res, err);
        }

    }

    checkoutOrder = async(req, res) => {

        try{
            const body = req.body;
            const userID = authz.requestUser(req, res);
            let cOrder = {
                address: null,
                items: [],
                cartIDs: []
            };

            const user = await userService.findById(userID);

            if(user.address) cOrder.address = user.address;

            body.forEach(async item => {
                cOrder.cartIDs.push(item.cartID);
                delete item.cartID;
                cOrder.items.push(item);
            })

            return res.json(cOrder);
        }catch(err){
            return Util.throwError(res, err);
        }
    }

    createOrder = async(req, res) => {

        try{
            const body = req.body;
            body.userID = authz.requestUser(req, res);
            body.totalAmount = 0;
         
            const titlesInfo = body.items;
            const cartIDs = body.cartIDs;

            for(let i in titlesInfo){
                const title = await titleService.findById(titlesInfo[i].titleID, false);
                if(!title || title.quantity == 0 || titlesInfo[i].count > title.quantity)
                    return res.status(500).json({message: 'an error occurred, please try again'});
                
                body.totalAmount += (titlesInfo[i].price * titlesInfo[i].count);
            }

            body.totalAmount += body.shippingCost;

            const order = await orderService.create(body);

            if(!order) return res.status(500).json({message: 'cannot create order'});

            cartIDs.forEach(async cartID => {
                if(!(await cartService.delete(cartID))) 
                    console.log('delete failed');
            })
            
            return res.json(order);
        }catch(err){
            return Util.throwError(res, err);
        }
    }

    updateOrder = async(req, res) => {

        try{
            const body = req.body;
            const orderID = req.query.id;

            const order = await orderService.findById(orderID);
            if(!order) return res.status(404).json({message: 'not found'});

            const nOrder = await orderService.update(orderID, body);

            return res.json(nOrder);
            

        }catch(err){
            return Util.throwError(res, err);
        }

    }

    formatReturnedOrder = async (order) => {
        
        //fix formating returned order

        return order;
    }

}

module.exports = new OrderController;