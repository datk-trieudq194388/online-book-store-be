const {Title, TitleDTO} = require('../app/models/title.model');
const Book = require('../app/models/book.model');
const {ViewType, BookStatus} = require('../configs/global');

class TitleService{

    getUserTitles = async(type = 0, pageSize = 12, page = 1) => { // fix available or sold

        let sortedBy;

        switch (+type) {
            case ViewType.BEST_SELLERS:
                sortedBy = {sold: -1, createdAt: -1}; 
                break;
            case ViewType.MOST_VIEWS:
                sortedBy = {trend: -1, createdAt: -1}; 
                break; 
            case ViewType.LO_TO_HI:
                sortedBy = {price: 1, createdAt: -1}; 
                break;
            case ViewType.HI_TO_LO:
                sortedBy = {price: -1, createdAt: -1}; 
                break; 
            default:
                sortedBy = {createdAt: -1};     
        }

        // if(type == ViewType.BEST_SELLERS)
        //     sortedBy = {sold: -1, createdAt: -1};   
        // else if(type == ViewType.MOST_VIEWS)
        //     sortedBy = {trend: -1, createdAt: -1}; 
        // else sortedBy = {createdAt: -1};
        
        const titles = await Title.aggregate([
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "titleID",
                    as: "books"
                }
            },
            {
                $project: {
                    _id: 1,
                    image: 1,
                    name: 1,
                    price: 1,
                    slug: 1,
                    sold: 1,
                    quantity: {
                        $size: {
                            $filter: {
                                input: '$books',
                                as: 'book',
                                cond: {
                                    $eq: ['$$book.status', String(BookStatus.AVAILABLE)]
                                }
                            }
                        }
                        
                    }
                }
            },
            { $sort: sortedBy },
            { $skip: (+page - 1) * +pageSize },
            { $limit: +pageSize },
          ]);

        return titles;

    }
    
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
        title.quantity = await Book.countDocuments({titleID: title._id, status: BookStatus.AVAILABLE});
        return title;
    }
    
}

module.exports = new TitleService;