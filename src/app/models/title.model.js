const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        name: {
            type: String, required: true, trim: true,
        },
        price: {
            type: Number, required: true, default: 0,
        },
        authors: { 
            type: Array[String], required: true, trim: true,
        },
        translators: { 
            type: Array[String], trim: true, default: null
        },
        publisher: {
            type: String, required: true, trim: true
        },
        pYear: {
            type: Number, required: true,
        },
        page: {
            type: Number, required: true,
        },
        size: {
            type: Array, required: true,
        },
        categoryIDs: {
            type: Array[{
                type: Schema.Types.ObjectId,
                ref: "Category"
            }], required: true, trim: true,
        },
        description: { 
            type: String, required: true, trim: true,
        },
        trend: { 
            type: Number, required: true, default: 0,
        },
        image: { 
            type: String, required: true, default: "",
        },
        slug: { 
            type: String, slug: 'name', forceIdSlug: true,
        },
        deletedAt: {
            type: Date, default : null,
        }

    },
    {
        timestamps: true,
    },
);

class TitleDTO {
    _id;
    name;
    price;
    authors;
    translators;
    publisher;
    pYear;
    page;
    size;
    categories;
    quantity;
    description;
    image;
    slug;
    createdAt;
    updatedAt;

    constructor (data){
        this._id = data._id;
        this.name = data.name;
        this.price = data.price;
        this.authors = data.authors;
        this.translators = data.translators;
        this.publisher = data.publisher;
        this.pYear = data.pYear;
        this.page = data.page;
        this.size = data.size;
        this.categories = data.categories;
        this.quantity = data.quantity;
        this.description = data.description;
        this.image = data.image;
        this.slug = data.slug;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
}

const Title = mongoose.model('Title', schema);

module.exports = { Title, TitleDTO};