const {Title, TitleDTO} = require('../app/models/title.model');
const {Book, BStatus} = require('../app/models/book.model');

class TitleService{
    
    getAll = async(query) => {
    
        query['deletedAt'] = null;

        const titles = await Title.find(query);

        for (let i in titles){
            let title = titles[i];
            titles[i] = await this.countQuantity(title.toObject());
        }
        
        return titles;

    }

    findBySlug = async(slug) => {

        let title = await Title.findOne({slug: slug, deletedAt: null});

        if(!title) return title;

        title = await this.countQuantity(title);
        return new TitleDTO(title);

    }

    findById = async(titleId) => {
        let title = await Title.findOne({_id: titleId, deletedAt: null});

        if(!title) return title;

        title = await this.countQuantity(title);
        return new TitleDTO(title);
    }

    checkExistedId = async(titleId) => {
        return await Title.exists({_id: titleId, deletedAt: null});
    }

    update = async(title) => {

        await Title.findOneAndUpdate({_id: title._id, deletedAt: null}, title);
        const nTitle = await Title.findById(title._id);

        return nTitle ? new TitleDTO(nTitle) : nTitle;

    }

    create = async(title) => {
     
        let nTitle = await Title.create(title);
        if(!nTitle) return nTitle;

        nTitle = await this.countQuantity(nTitle);
        return new TitleDTO(nTitle);

    }

    countQuantity = async(title) => {
        title.quantity = await Book.countDocuments({titleId: title._id});
        title.availability = await Book.countDocuments({titleId: title._id, status: BStatus.AVAILABLE});
        return title;
    }
    
}

module.exports = new TitleService;