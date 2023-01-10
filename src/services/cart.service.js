const {Cart} = require('../app/models/cart.model');

class CartService{
    
    getAll = async(userID) => {
    
        const items = await Cart.find({userId: userID});
        return items;

    }

    findById = async(userID, titleID) => {
        const item = await Cart.findById({userID: userID, titleID: titleID});
        return item ? item.toObject() : item;
    }

    findExistedTitle = async(item) => {
        const cItem = await Cart.findOne(item);
        return cItem ? cItem.toObject() : cItem;
    }

    delete = async(itemID) => {

        const item = await Cart.findOneAndDelete({_id: itemID});
        return  item ? item.toObject() : item;

    }

    create = async(item) => {

        const nItem = await Cart.create(item);
        return  nItem ? nItem.toObject() : nItem;
    }
    
    update = async(itemID, data) => {
        await Cart.findOneAndUpdate({_id: itemID}, data);
        const nCart = await Cart.findById(itemID);
        return nCart ? nCart.toObject() : nCart;

    }
}

module.exports = new CartService;