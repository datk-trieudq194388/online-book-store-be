const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BStatus = {
    AVAILABLE: "A", SOLD: "S"
}

const schema = new Schema(
    {
        titleID: {
            type: Schema.Types.ObjectId, required: true, trim: true, ref: 'Title'
        },
        status: {
            type: String, required: true, trim: true, default: BStatus.AVAILABLE,
        }
    },
    {
        timestamps: true,
    },
);

const Book = mongoose.model('Book', schema);

module.exports = { Book, BStatus };