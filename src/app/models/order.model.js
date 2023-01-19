const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OStatus = {
    PENDING: "PE", PROCESSING: "PR", COMPLETED: "CO", CANCLED: "CA" 
}

const schema = new Schema(
    {
        items:{
            type: [{
                titleID: {
                    type: Schema.Types.ObjectId,
                    ref: 'Title',
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                    trim: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                image: {
                    type: String,
                    required: true,
                    default: null,
                },
                count: {
                    type: Number,
                    required: true,
                    default: 1,
                },
                bookIDs: {
                    type: [{
                        type: Schema.Types.ObjectId,
                    }],
                    default: null,
                }
            }],
            required: true,
        },
        userID: {
            type: Schema.Types.ObjectId, require: true, trim: true,
        },
        status: {
            type: String, require: true, default: OStatus.PENDING,
        },
        shippingCost: {
            type: Number, required: true, default: 0,
        },
        totalAmount: {
            type: Number, required: true, default: 0,
        },
        notes: {
            type: String, trim: true, default: '',
        },
        recipientInfo: { 
            type: [{
                type: String,
                trim: true,
                required: true,
            }], required: true,
        }
    },
    {
        timestamps: true,
    },
);

const Order = mongoose.model('Order', schema);

module.exports = { Order };