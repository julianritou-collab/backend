const Book = require('../models/book');

exports.getAllBooks = (req, res, next) => {
    Book.find().then(
        (books) => {
        res.status(200).json(books);
        }
    ).catch(
        (error) => {
            res.status(400).json({
            error: error
            });
        }
    );
};

exports.createBook = (req, res, next) => {
    const bookobject = JSON.parse(req.body.book);
    delete bookobject._userId;
    const book = new Book({
        ...bookobject,
        userId: req.auth.userId,
        ratings: [],
        averageRating: 0,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    
    book.save()
    .then(() => { res.status(201).json({message: 'Livre enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({
        _id: req.params.id
    }).then(
        (book) => {
        res.status(200).json(book);
        }
    ).catch(
        (error) => {
        res.status(404).json({
            error: error
        });
        }
    );
};

exports.modifyBook = (req, res, next) => {
};

exports.deleteBook = (req, res, next) => {
};

exports.rateBook = (req, res, next) => {
};

exports.getBestRatedBooks = (req, res, next) => {
};