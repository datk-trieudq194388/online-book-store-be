// const bookService = require('../../services/book.service');
// const titleService = require('../../services/title.service');
const Util = require('../../utils/util');

class BookController{
    
    getAllBooks = async(req, res) => {
        
        try{
            const titleId = req.params.titleId;

            const books = await bookService.getAll(titleId);

            return res.json(books);

        }catch(err){
            console.log(err);
            return res.status(400).json({error: err.message});
        }
    }

    getBook = async(req, res) => {

        try{
            const bookId = req.params.id;

            const book = await bookService.findById(bookId);

            if(!book) return res.status(404).json({message: 'Not found'});

            return res.json(book);

        }catch(err){
            console.log(err);
            return res.status(400).json({error: err.message});
        }

    }

    createBook = async(req, res) => {

        try{
            const body = req.body;
            delete body.status;

            if(!(await titleService.findById(body.titleId)))
                return res.status(400).json({message: 'title is not found'});

            const nBook = await bookService.create({titleId: body.titleId});

            if(!nBook) return res.status(500).json('cannot create book');
            return res.json(nBook);

        }catch(err){
            console.log(err);
            return res.status(400).json({error: err.message});
        }

    }

    updateBook = async(req, res) => {

        try{
            const bookId = req.query.id;
            const body = req.body;

            body._id = bookId;

            if(body.status) body.status = Util.formatStatus(res, body.status);

            const book = await bookService.update(body);

            if(!book) return res.status(404).json('Not found');

            return res.json(book);


        }catch(err){
            console.log(err);
            return res.status(400).json({error: err.message});
        }

    }

    deleteBook(req, res){

        res.json({content: 'delete book'});

    }

}

module.exports = new BookController;