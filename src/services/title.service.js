const {Title, TitleDTO} = require('../app/models/title.model');
const {Book, BStatus} = require('../app/models/book.model');

class TitleService{
    
    getAll = async(query, containingDeletedItems) => {
    
        if(!containingDeletedItems) query['deletedAt'] = null;

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

    findById = async(titleID, containingDeletedItems) => {
        let title;
        if(containingDeletedItems) title = await Title.findOne({_id: titleID});
        else title = await Title.findOne({_id: titleID, deletedAt: null});

        if(!title) return title;

        title = await this.countQuantity(title);
        return new TitleDTO(title);
    }

    checkExistedId = async(titleID) => {
        return await Title.exists({_id: titleID, deletedAt: null});
    }

    update = async(titleID, data) => {

        await Title.findOneAndUpdate({_id: titleID}, data);
        const nTitle = await Title.findById(titleID);

        return nTitle ? new TitleDTO(nTitle) : nTitle;

    }

    create = async(title) => {
     
        let nTitle = await Title.create(title);
        if(!nTitle) return nTitle;

        return new TitleDTO(nTitle);

    }

    countQuantity = async(title) => {
        title.quantity = await Book.countDocuments({titleID: title._id, status: BStatus.AVAILABLE});
        return title;
    }
    
}

module.exports = new TitleService;