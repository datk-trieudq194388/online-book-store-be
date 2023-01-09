const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        bookIDs: {
            type: Array[{
                type: Schema.Types.ObjectId,
                ref: 'Book'
            }], default: null,
        },
        quantities: {
            type: Array[{
                type: Number,
                required: true,
                default: 1,
            }], require: true,
        },
        userID: {
            type: Schema.Types.ObjectId, require: true, trim: true,
        },
        status: {
            type: String, require: true, default: OStatus.PENDING,
        },
        totalAmount: {
            type: Number, required: true, default: 0,
        },
        notes: {
            type: String, trim: true, default: '',
        },
        recipientInfo: { 
            type: String, required: true, default: '',
        }
    },
    {
        timestamps: true,
    },
);

const Order = mongoose.model('Order', schema);

const OStatus = {
    PENDING: "PE", PROCESSING: "PR", COMPLETED: "CO", CANCLED: "CA" 
}

module.exports = { Order };