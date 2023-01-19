const cartService = require('../../services/cart.service');
const titleService = require('../../services/title.service');
const authz = require('../../middlewares/authorization');
const Util = require('../../utils/util');

class CartController{

    getCart = async(req, res) => {

        try {
            const userID = authz.requestUser(req, res);

            const carts = await cartService.getAll(userID);

            for (let i in carts){
                carts[i] = carts[i].toObject();
                const title = await titleService.findById(carts[i].titleID, true);
                carts[i]['title'] = {
                    _id: title._id,
                    name: title.name,
                    price: title.price,
                    image: title.image,
                    quantity: title.quantity,
                    deletedAt: title.deletedAt,
                }
                delete carts[i].titleID;

                // re-check count of items
                if(carts[i].count > title.quantity) {
                    carts[i].count = title.quantity;
                    await cartService.update(carts[i]._id, {count: carts[i].count});
                }
                    
            }

            return res.json(carts);

        }catch(err) {
            return Util.throwError(res, err);
        } 

    }

    addToCart = async(req, res) => {

        try {
            let body = req.body;
            body.userID = authz.requestUser(req, res);
            let nItem;
            
            const title = await titleService.findById(body.titleID, false);
            if(!title) 
                return res.status(400).json({message: 'the title is not existed'});

            const item = await cartService.findExistedTitle(body.userID, body.titleID);

            let flag = false;
            if(item){
                body.count += item.count;
                if(item.isChecked === true) body.isChecked = true;
                flag = true;
            }
            
            // check count
            if(body.count > title.quantity)
                return res.status(400).json({message: `${body.count} items are not available`});
            
            if(flag) nItem = await cartService.update(item._id, body);
            else nItem = await cartService.create(body);  

            if(!nItem) return res.status(500).json({message: 'cannot add to cart'});
            return res.json(nItem);

        }catch(err){
            return Util.throwError(res, err);
        }

    }

    updateCart = async(req, res) => {

        try {
            const itemID = req.query.id;
            const body = req.body; delete body.titleID;
            const userID = authz.requestUser(req, res);
           
            const item = await cartService.findById(itemID);
            
            if(item.userID != userID) return res.status(400).json({message: 'you are not allowed'});

            const title = await titleService.findById(item.titleID, true);
            if(!title) 
                return res.status(400).json({message: 'the title is not existed'});

            // check count
            if(body.count > title.quantity)
                return res.status(400).json({message: `${body.count} items are not available`});

            const nItem = await cartService.update(itemID, body);

            if(!nItem) return res.status(500).json({message: 'update failed'});

            return res.json(nItem);
        }catch(err){
            return Util.throwError(res, err);
        }

    }

    deleteFromCart = async(req, res) => {

        try {
            const itemID = req.query.id;
            const userID = authz.requestUser(req, res);

            const item = await cartService.findById(itemID);

            if(item.userID != userID) return res.status(400).json({message: 'you are not allowed'});

            const deletedItem = await cartService.delete(itemID);

            if(!deletedItem) return res.status(500).json({message: 'delete failed'});

            return res.json({message: 'delete successfully'});

        }catch(err){
            return Util.throwError(res, err);
        }
        
    }

}

module.exports = new CartController;