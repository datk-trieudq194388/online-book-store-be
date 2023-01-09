const {Book} = require('../app/models/book.model');

class BookService{
    
    getAll = async(titleId) => {
    
        const books = await Book.find({titleId: titleId});
        for(let i in books)
            books[i] = books[i].toObject();
        
        return books;

    }

    findById = async(bookId) => {
        const book = await Book.findById(bookId);
        return book ? book.toObject() : book;
    }

    update = async(book) => {
        await Book.findOneAndUpdate({_id: book._id}, book);
        const nBook = await Book.findById(book._id);
        return nBook ? nBook.toObject() : nBook;
    }

    delete = async(itemId) => {

     

    }

    create = async(book) => {

        const nBook = await Book.create(book);
        return  nBook ? nBook.toObject() : nBook;
    }
    
}

module.exports = new BookService;