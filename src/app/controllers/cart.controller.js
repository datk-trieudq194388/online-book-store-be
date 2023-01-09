// const cartService = require('../../services/cart.service');
// const titleService = require('../../services/title.service');
const authorization = require('../../middlewares/authorization');
const Util = require('../../utils/util');

class CartController{

    getCart = async(req, res) => {

        try {
            const userId = authorization.requestUser(req, res);

            const carts = await cartService.getAll(userId);

            for (let i in carts){
                carts[i] = carts[i].toObject();
                const title = await titleService.findById(carts[i].titleID);
                carts[i]['title'] = {
                    name: title.name,
                    price: title.price,
                    image: title.image,
                    quantity: title.quantity,
                    deletedAt: title.deletedAt,
                }
                delete carts[i].titleID;
            }

            return res.json(carts);

        }catch(err) {
            return Util.throwError(res, err);
        } 

    }

    addToCart = async(req, res) => {

        try {
            let body = req.body;
            const userID = authorization.requestUser(req, res);
            body['userID'] = userID;
            // let item = {titleId: body.titleId, userId: userId, count: body.count, isChecked: body.isChecked};

            if(!await titleService.checkExistedId(body.titleID)) 
                return res.status(400).json({message: 'the title is not existed'});

            const item = await cartService.findExistedTitle(body.userID, body.titleID);
            if(item){
                item['count'] += body.count;
                if(item.isChecked === false) item['isChecked'] = body.isChecked;
                body = item;
            }

            const nItem = await cartService.create(body);

            if(!nItem) return res.status(500).json({message: 'cannot add to cart'});
            return res.json(nItem);

        }catch(err){
            return Util.throwError(res, err);
        }

    }

    updateCart = async(req, res) => {

        try {
            const itemId = req.query.id;
            const body = req.body;
            const userId = authorization.requestUser(req, res);
          
            const item = await cartService.findById(itemId);

            if(item.userId !== userId) return res.status(400).json({message: 'you are not allowed'});

            const nItem = await cartService.update(body);

            if(!nItem) return res.status(400).json({message: 'update failed'});

            return res.json(nItem);
        }catch(err){
            return Util.throwError(res, err);
        }

    }

    deleteFromCart = async(req, res) => {

        try {
            const itemId = req.query.id;
            const userId = authorization.requestUser(req, res);

            const item = await cartService.findById(itemId);

            if(item.userId !== userId) return res.status(400).json({message: 'you are not allowed'});

            const deletedItem = await cartService.delete(itemId);

            if(!deletedItem) return res.status(400).json({message: 'delete failed'});

            return res.json({message: 'delete successfully'});

        }catch(err){
            return Util.throwError(res, err);
        }
        
    }

}

module.exports = new CartController;