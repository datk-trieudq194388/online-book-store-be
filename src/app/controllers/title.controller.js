const titleService = require('../../services/title.service');
const Util = require('../../utils/util');

class TitleController{

    getUserTitles = async(req, res) => {
        try {
            const sortType = req.query.sortType ?? 0;
            const pageSize = req.query.pageSize ?? 12;
            const page = req.query.page ?? 1;

            console.log(pageSize, page)
            const titles = await titleService.getUserTitles(sortType, pageSize, page);
            
            return res.json(titles);

        }catch(err){
            return Util.throwError(res, err);
        }
    }
    
    getAllTitles = async(req, res) => {
        
        try {
            const titles = await titleService.getAll({}, false);

            for (let i in titles){
                delete titles[i].trend;
                delete titles[i].deletedAt;
            }
                
            return res.json(titles);

        }catch(err){
            return Util.throwError(res, err);
        }

    }

    getTitle = async(req, res) => {

        try {

            const titleSlug = req.params.slug;

            const title = await titleService.findBySlug(titleSlug);

            if(!title) return res.status(404).json({message: "not found"});

            return res.json(title);

        }catch(err){
            return Util.throwError(res, err);
        }

    }

    createTitle = async (req, res) => {

        try {
            const body = req.body;
        
            const title = await titleService.create(body);

            if(!title) return res.status(500).json({message: 'cannot create title'});
            return res.json(title);

        }catch(err){
            return Util.throwError(res, err);
        }

    }

    updateTitle = async(req, res) => {

        try {
            const titleID = req.query.id;
            const body = req.body;
            delete body.trend;

            const title = await titleService.update(titleID, body);

            if(!title) return res.status(404).json({message: 'not found'});

            return res.json(title);

        }catch(err){
            return Util.throwError(res, err);
        }

    }

    deleteTitle = async(req, res) => {

        try {
            const titleID = req.query.id;
            const currentTime = new Date();

            const title = await titleService.update(titleID, {deletedAt: currentTime});

            if(!title) return res.status(404).json({message: 'not found'});

            return res.json({message: 'delete successfully'});

        }catch(err){
            return Util.throwError(res, err);
        }

    }

}

module.exports = new TitleController;