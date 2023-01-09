// const orderService = require('../../services/order.service');
// const cartService = require('../../services/cart.service');
// const userService = require('../../services/user.service')
// const bookService = require('../../services/book.service')
// const titleService = require('../../services/title.service');
const Util = require('../../utils/util');
const authz = require('../../middlewares/authorization');

class TransactionController{
    
    getAllOrders = async(req, res) => {
        
        try {
            const userId = req.query.userId;
            // console.log(userId);

            let allOrders = await orderService.getAll(userId);

            for(let i in allOrders)
                allOrders[i] = await this.formatReturnedOrder(allOrders[i]);

            return res.json(allOrders);

        }catch(err){
            return Util.throwError(res, err);
        }

    }

    getAllMyOrders = async(req, res) => {
        
        try {
            const userId = authz.requestUser(req, res);

            let allOrders = await orderService.getAll(userId);

            for(let i in allOrders)
                allOrders[i] = await this.formatReturnedOrder(allOrders[i]);

            return res.json(allOrders);

        }catch(err){
            return Util.throwError(res, err);
        }

    }

    getOrder = async(req, res) => {

        try {
            const orderId = req.params.id;

            let order = await orderService.findById(orderId);

            if(!order) return res.status(404).json({message: "not found"});

            order = await this.formatReturnedOrder(order);

            return res.json(order);

        }catch(err){
            return Util.throwError(res, err);
        }

    }

    createOrder = async(req, res) => {

        try{
            const body = req.body;
            const userId = authz.requestUser(req, res);
            body.userId = userId;

            if(!(await titleService.checkExistedId(body.titleId)))
                return res.status(400).json({message: 'title is not found'});

            // body.returnDate = Util.formatReturnedDate(body.time, new Date());

            // if(req.query.fromCart == true){
            //     let item = {titleId: body.titleId, userId: body.userId};
            //     const cItem = await cartService.findExistedTitle(item);
            //     if(await cartService.delete(cItem._id))
            //         console.log('Delete from cart successfully');
            // }

            const order = await orderService.create(body);

            if(!order) return res.status(500).json({message: 'cannot create order'});

            if( await cartService.delete(body.itemID))
                console.log('delete from cart successfully');
            
            return res.json(order);
        }catch(err){
            return Util.throwError(res, err);
        }
    }

    // createOfflineOrder = async(req, res) => {

    //     try{
    //         const body = req.body;
    //         body.isPending = false;

    //         const book = await bookService.findById(body.bookId);
    //         body.titleId = book.titleId;

    //         body.returnDate = Util.formatReturnedDate(body.time, new Date());

    //         const Order = await OrderService.create(body);

    //         if(!Order) return res.status(500).json('Cannot create transaction');
            
    //         return res.json(Order);
            

    //     }catch(err){
    //         console.log(err);
    //         return res.status(400).json({error: err.message});
    //     }
    // }

    updateOrder = async(req, res) => {

        try{
            const body = req.body;
            const orderId = req.query.id;

            const order = await orderService.findById(orderId);
            if(!order) return res.status(404).json({message: 'not found'});
            
            body._id = orderId;

            // if(body.time)
            //     body.returnDate = Util.formatReturnedDate(body.time, order.returnDate);

            const nOrder = await orderService.update(body);

            return res.json(nOrder);
            

        }catch(err){
            return Util.throwError(res, err);
        }

    }

    formatReturnedOrder = async (order) => {
        // order = order.toObject();
        // const title = await titleService.findById(order.titleID);
        // order.title = {
        //     _id: title._id,
        //     image: title.image,
        //     name: title.name,
        //     price: title.price,

        // }
        // order.book = await bookService.findById(order.bookId);
        // delete order.titleId;
        // delete order.bookId;
        return order;
    }

}

module.exports = new TransactionController;